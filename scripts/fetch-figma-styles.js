#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const OUTPUT_DIR = path.join(__dirname, '..', 'tokens');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'figma-styles.json');

/**
 * Fetch styles metadata from a single Figma file
 */
async function fetchFigmaStyles(fileKey) {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}/styles`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN
        }
      }
    );

    console.log(`   ✅ Fetched styles metadata: ${fileKey}`);
    return response.data.meta.styles;
  } catch (error) {
    console.error(`   ❌ Error fetching styles from ${fileKey}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Fetch node details for styles
 */
async function fetchStyleNodes(fileKey, nodeIds) {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(',')}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN
        }
      }
    );

    console.log(`   ✅ Fetched node details for ${nodeIds.length} styles`);
    return response.data.nodes;
  } catch (error) {
    console.error(`   ❌ Error fetching nodes:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Map Figma style type to W3C DTCG type
 */
function mapStyleTypeToDTCG(styleType) {
  const typeMap = {
    'TEXT': 'typography',
    'EFFECT': 'shadow',
    'GRID': 'grid'
  };
  return typeMap[styleType] || 'other';
}

/**
 * Transform text style to DTCG typography token
 */
function transformTextStyle(node, styleName, description) {
  const style = node.document.style;

  // Build typography token value
  const value = {
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight,
    letterSpacing: `${style.letterSpacing}px`,
    lineHeight: style.lineHeightUnit === 'FONT_SIZE_%'
      ? `${style.lineHeightPercentFontSize}%`
      : `${style.lineHeightPx}px`
  };

  const token = {
    $value: value,
    $type: 'typography'
  };

  if (description) {
    token.$description = description;
  }

  // Check for variable references
  if (node.document.boundVariables) {
    token.$extensions = {
      'com.figma': {
        boundVariables: node.document.boundVariables
      }
    };
  }

  return token;
}

/**
 * Transform effect style to DTCG shadow token
 */
function transformEffectStyle(node, styleName, description) {
  const effects = node.document.effects || [];

  // Handle background blur separately
  const blur = effects.find(e => e.type === 'BACKGROUND_BLUR');
  if (blur) {
    const token = {
      $value: `blur(${blur.radius}px)`,
      $type: 'blur'
    };
    if (description) {
      token.$description = description;
    }
    return token;
  }

  // Handle drop shadows
  const shadows = effects
    .filter(e => e.type === 'DROP_SHADOW' && e.visible)
    .map(e => {
      const color = e.color;
      const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
      return {
        offsetX: `${e.offset.x}px`,
        offsetY: `${e.offset.y}px`,
        blur: `${e.radius}px`,
        spread: '0px',
        color: rgba
      };
    });

  if (shadows.length > 0) {
    const token = {
      $value: shadows.length === 1 ? shadows[0] : shadows,
      $type: 'shadow'
    };
    if (description) {
      token.$description = description;
    }
    return token;
  }

  // Fallback for other effect types
  const token = {
    $value: effects,
    $type: 'effect'
  };
  if (description) {
    token.$description = description;
  }
  return token;
}

/**
 * Transform grid style to DTCG custom token
 */
function transformGridStyle(node, styleName, description) {
  const grids = node.document.layoutGrids || [];

  const value = grids.map(grid => ({
    pattern: grid.pattern.toLowerCase(),
    sectionSize: `${grid.sectionSize}px`,
    gutterSize: `${grid.gutterSize}px`,
    count: grid.count,
    alignment: grid.alignment?.toLowerCase()
  }));

  const token = {
    $value: value.length === 1 ? value[0] : value,
    $type: 'grid'
  };

  if (description) {
    token.$description = description;
  }

  // Check for variable references
  if (node.document.boundVariables?.layoutGrids) {
    token.$extensions = {
      'com.figma': {
        boundVariables: node.document.boundVariables
      }
    };
  }

  return token;
}

/**
 * Build nested object from path parts
 */
function setNestedValue(obj, pathParts, value) {
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
 * Transform Figma styles to W3C DTCG format
 */
function transformStylesToDTCG(styles, nodes, fileKeys = []) {
  const tokens = {};

  styles.forEach(style => {
    const node = nodes[style.node_id];
    if (!node) {
      console.warn(`   ⚠️ No node data for style: ${style.name}`);
      return;
    }

    // Split name into path (e.g., "fixed/body medium" -> ["fixed", "body medium"])
    const pathParts = style.name.split('/');

    let token;
    switch (style.style_type) {
      case 'TEXT':
        token = transformTextStyle(node, style.name, style.description);
        break;
      case 'EFFECT':
        token = transformEffectStyle(node, style.name, style.description);
        break;
      case 'GRID':
        token = transformGridStyle(node, style.name, style.description);
        break;
      default:
        console.warn(`   ⚠️ Unknown style type: ${style.style_type} for ${style.name}`);
        return;
    }

    setNestedValue(tokens, pathParts, token);
  });

  // Add metadata
  const metadata = {
    $metadata: {
      generated: new Date().toISOString(),
      source: 'Figma Styles API',
      figmaFileKeys: fileKeys.length > 1 ? fileKeys : fileKeys[0],
      format: 'W3C DTCG',
      version: '1.0.0'
    }
  };

  return { ...metadata, ...tokens };
}

/**
 * Save tokens to file
 */
function saveTokens(tokens) {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write tokens file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokens, null, 2));
  console.log(`✅ Styles saved to ${OUTPUT_FILE}`);

  // Generate statistics
  const stats = generateStats(tokens);
  console.log('\n📊 Style Statistics:');
  console.log(`   Total styles: ${stats.total}`);
  console.log(`   Typography: ${stats.typography}`);
  console.log(`   Effects: ${stats.effects}`);
  console.log(`   Grids: ${stats.grids}`);
}

/**
 * Generate style statistics
 */
function generateStats(tokens) {
  const stats = {
    total: 0,
    typography: 0,
    effects: 0,
    grids: 0
  };

  function countTokens(obj) {
    for (const key in obj) {
      if (key.startsWith('$')) continue; // Skip metadata

      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        if (value.$type) {
          stats.total++;
          if (value.$type === 'typography') stats.typography++;
          if (value.$type === 'shadow' || value.$type === 'blur' || value.$type === 'effect') stats.effects++;
          if (value.$type === 'grid') stats.grids++;
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
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Figma styles sync...\n');

  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('❌ Error: FIGMA_TOKEN and FIGMA_FILE_KEY must be set in .env file');
    process.exit(1);
  }

  // Parse comma-delimited file keys
  const fileKeys = FIGMA_FILE_KEY.split(',').map(k => k.trim()).filter(Boolean);

  if (fileKeys.length === 0) {
    console.error('❌ Error: FIGMA_FILE_KEY is empty');
    process.exit(1);
  }

  console.log(`🔄 Fetching styles from ${fileKeys.length} Figma file(s)...\n`);

  // Fetch styles from all files
  const allStyles = [];
  for (const fileKey of fileKeys) {
    const styles = await fetchFigmaStyles(fileKey);
    allStyles.push({ fileKey, styles });
  }

  // Flatten styles and collect node IDs
  const stylesList = allStyles.flatMap(({ fileKey, styles }) =>
    styles.map(s => ({ ...s, fileKey }))
  );

  console.log(`\n📦 Processing ${stylesList.length} styles...`);
  console.log(`   Text: ${stylesList.filter(s => s.style_type === 'TEXT').length}`);
  console.log(`   Effect: ${stylesList.filter(s => s.style_type === 'EFFECT').length}`);
  console.log(`   Grid: ${stylesList.filter(s => s.style_type === 'GRID').length}`);

  // Group by file key and fetch nodes
  const nodesByFile = {};
  for (const file of allStyles) {
    const nodeIds = file.styles.map(s => s.node_id);
    const nodes = await fetchStyleNodes(file.fileKey, nodeIds);
    Object.assign(nodesByFile, nodes);
  }

  // Transform to DTCG format
  const tokens = transformStylesToDTCG(stylesList, nodesByFile, fileKeys);
  saveTokens(tokens);

  console.log('\n✨ Styles sync completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
