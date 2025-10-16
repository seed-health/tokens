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

module.exports = {
  parseTokens,
  flattenTokens,
  getPreviousTokens,
  compareTokens
};
