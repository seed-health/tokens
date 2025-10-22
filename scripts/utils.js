const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Parse tokens from a JSON file
 */
function parseTokens(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Flatten nested token structure for comparison
 */
function flattenTokens(tokens, prefix = '') {
  const flat = {};

  for (const key in tokens) {
    if (key.startsWith('$')) continue;

    const currentPath = prefix ? `${prefix}.${key}` : key;
    const value = tokens[key];

    if (typeof value === 'object' && value !== null) {
      if (value.$value !== undefined) {
        flat[currentPath] = {
          value: value.$value,
          type: value.$type,
          description: value.$description
        };
      } else {
        Object.assign(flat, flattenTokens(value, currentPath));
      }
    }
  }

  return flat;
}

/**
 * Get previous version of tokens from git
 */
async function getPreviousTokens(tokensFile) {
  try {
    const { stdout } = await execAsync(`git show HEAD:${tokensFile}`);
    return JSON.parse(stdout);
  } catch (error) {
    return null;
  }
}

/**
 * Compare old and new tokens to find changes
 */
function compareTokens(oldTokens, newTokens) {
  const oldFlat = flattenTokens(oldTokens || {});
  const newFlat = flattenTokens(newTokens || {});

  const added = [];
  const removed = [];
  const modified = [];

  // Find added and modified
  for (const path in newFlat) {
    if (!oldFlat[path]) {
      added.push({
        path,
        ...newFlat[path]
      });
    } else if (JSON.stringify(oldFlat[path]) !== JSON.stringify(newFlat[path])) {
      modified.push({
        path,
        old: oldFlat[path],
        new: newFlat[path]
      });
    }
  }

  // Find removed
  for (const path in oldFlat) {
    if (!newFlat[path]) {
      removed.push({
        path,
        ...oldFlat[path]
      });
    }
  }

  return { added, removed, modified };
}

/**
 * Recursively sort object keys alphabetically for deterministic output
 */
function sortObjectKeys(obj, parentContext = null) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item, parentContext));
  }

  // Check if this is a shadow value object (has offsetX, offsetY, blur, color)
  const isShadowValue = obj.offsetX !== undefined && obj.offsetY !== undefined &&
                        obj.blur !== undefined && obj.color !== undefined;

  // Preserve order for shadow values (CSS box-shadow property order)
  if (isShadowValue) {
    const shadowKeys = ['offsetX', 'offsetY', 'blur', 'spread', 'color'];
    const sorted = {};

    // First add shadow properties in correct order
    for (const key of shadowKeys) {
      if (obj[key] !== undefined) {
        sorted[key] = sortObjectKeys(obj[key], null);
      }
    }

    // Then add any other properties (sorted)
    const otherKeys = Object.keys(obj)
      .filter(k => !shadowKeys.includes(k))
      .sort((a, b) => a.localeCompare(b));

    for (const key of otherKeys) {
      sorted[key] = sortObjectKeys(obj[key], null);
    }

    return sorted;
  }

  // Normal sorting for other objects
  const sorted = {};
  const keys = Object.keys(obj).sort((a, b) => {
    // Keep $metadata and other $ keys at the top
    if (a.startsWith('$') && !b.startsWith('$')) return -1;
    if (!a.startsWith('$') && b.startsWith('$')) return 1;
    return a.localeCompare(b);
  });

  for (const key of keys) {
    // Pass context about whether this object is a shadow token
    const context = obj.$type === 'shadow' ? 'shadow' : null;
    sorted[key] = sortObjectKeys(obj[key], context);
  }

  return sorted;
}

/**
 * Serialize object to deterministic JSON string
 */
function stringifyDeterministic(obj, space = 2) {
  const sorted = sortObjectKeys(obj);
  return JSON.stringify(sorted, null, space);
}

/**
 * Check if two token objects are deeply equal (ignoring metadata)
 */
function tokensEqual(obj1, obj2) {
  // Remove metadata for comparison
  const without$Metadata = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const copy = Array.isArray(obj) ? [...obj] : { ...obj };
    if (copy.$metadata) delete copy.$metadata;
    return copy;
  };

  return JSON.stringify(sortObjectKeys(without$Metadata(obj1))) ===
         JSON.stringify(sortObjectKeys(without$Metadata(obj2)));
}

/**
 * Build nested object from path parts
 */
function setNestedValue(obj, pathParts, value) {
  if (!Array.isArray(pathParts) || pathParts.length === 0) {
    throw new Error('pathParts must be a non-empty array');
  }
  let current = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  current[pathParts[pathParts.length - 1]] = value;
}

/**
 * Generate token statistics based on configuration
 * @param {Object} tokens - The tokens object to analyze
 * @param {Object} statsConfig - Configuration for which types to count
 * @returns {Object} Statistics object with totals
 */
function generateTokenStats(tokens, statsConfig) {
  const stats = { total: 0 };

  // Initialize stats for each configured type
  Object.keys(statsConfig).forEach(key => {
    stats[key] = 0;
  });

  function countTokens(obj) {
    for (const key in obj) {
      if (key.startsWith('$')) continue; // Skip metadata

      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        if (value.$type) {
          stats.total++;

          // Check each configured stat
          Object.entries(statsConfig).forEach(([statKey, checker]) => {
            if (typeof checker === 'function' ? checker(value) : value.$type === checker) {
              stats[statKey]++;
            }
          });
        } else {
          countTokens(value);
        }
      }
    }
  }

  countTokens(tokens);
  return stats;
}

/**
 * Save tokens to file with deterministic output and optional timestamp preservation
 * @param {string} outputFile - Full path to output file
 * @param {Object} tokens - Tokens object to save
 * @param {boolean} preserveTimestamp - Whether to preserve timestamp if content unchanged
 * @param {Object} options - Additional options
 * @param {string} options.successMessage - Custom success message (default: "Tokens saved")
 * @param {Function} options.formatStats - Function to format stats for display
 */
function saveTokensToFile(outputFile, tokens, preserveTimestamp = false, options = {}) {
  const { successMessage = 'Tokens saved', formatStats } = options;

  // Ensure output directory exists
  const outputDir = require('path').dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if we should preserve timestamp
  if (preserveTimestamp && fs.existsSync(outputFile)) {
    const existingTokens = parseTokens(outputFile);
    if (existingTokens && tokensEqual(tokens, existingTokens)) {
      // No actual changes, preserve the original timestamp
      tokens.$metadata.generated = existingTokens.$metadata.generated;
      console.log('ℹ️  No changes detected, preserving original timestamp');
    }
  }

  // Write tokens file with deterministic sorting
  fs.writeFileSync(outputFile, stringifyDeterministic(tokens));
  console.log(`✅ ${successMessage} to ${outputFile}`);

  // Display statistics if formatter provided
  if (formatStats) {
    formatStats();
  }
}

module.exports = {
  parseTokens,
  flattenTokens,
  getPreviousTokens,
  compareTokens,
  sortObjectKeys,
  stringifyDeterministic,
  tokensEqual,
  setNestedValue,
  generateTokenStats,
  saveTokensToFile
};
