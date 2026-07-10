#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');
const path = require('path');
const { setNestedValue, generateTokenStats, describeRequestError, saveTokensToFile } = require('./utils');

// Configuration
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const OUTPUT_FILE = path.join(__dirname, '..', 'tokens', 'figma-styles.json');

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
    console.error(`   ❌ Error fetching styles from ${fileKey}:`, describeRequestError(error));
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
    console.error(`   ❌ Error fetching nodes:`, describeRequestError(error));
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
 * Transform a Figma drop shadow effect to a DTCG shadow value
 */
function toShadowValue(effect) {
  const { r, g, b, a } = effect.color;
  return {
    offsetX: `${effect.offset.x}px`,
    offsetY: `${effect.offset.y}px`,
    blur: `${effect.radius}px`,
    spread: `${effect.spread ?? 0}px`,
    color: `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`
  };
}

/**
 * Describe an effect for error messages, including the variant that made it
 * unsupported (e.g. BACKGROUND_BLUR(PROGRESSIVE))
 */
function describeEffect(effect) {
  if (effect.type === 'BACKGROUND_BLUR' && effect.blurType && effect.blurType !== 'NORMAL') {
    return `${effect.type}(${effect.blurType})`;
  }
  if (effect.type === 'DROP_SHADOW' && effect.blendMode && effect.blendMode !== 'NORMAL') {
    return `${effect.type}(${effect.blendMode})`;
  }
  return effect.type;
}

/**
 * Transform effect style to DTCG blur or shadow token
 *
 * $type "blur" is only emitted for a single BACKGROUND_BLUR effect and keeps
 * the raw Figma radius; Figma renders background blur at half its stored
 * radius, so the CSS conversion (÷2) happens in the Style Dictionary
 * transform at build time.
 *
 * Only shapes with an exact CSS equivalent are accepted: one uniform
 * background blur, or normal-blend drop shadows. Anything else (progressive
 * blurs, blend modes, inner shadows, compound effects) fails the sync
 * rather than emitting a token that silently drops or flattens effects.
 */
function transformEffectStyle(node, styleName, description) {
  const effects = (node.document.effects || []).filter(e => e.visible !== false);

  const blurs = effects.filter(e =>
    e.type === 'BACKGROUND_BLUR' && (e.blurType ?? 'NORMAL') === 'NORMAL');
  const shadows = effects.filter(e =>
    e.type === 'DROP_SHADOW' && (e.blendMode ?? 'NORMAL') === 'NORMAL');

  let token;
  if (blurs.length === 1 && effects.length === 1) {
    token = {
      $value: `blur(${blurs[0].radius}px)`,
      $type: 'blur'
    };
  } else if (shadows.length > 0 && shadows.length === effects.length) {
    token = {
      $value: shadows.length === 1 ? toShadowValue(shadows[0]) : shadows.map(toShadowValue),
      $type: 'shadow'
    };
  } else {
    const shape = effects.length === 0
      ? 'no visible effects'
      : effects.map(describeEffect).join(' + ');
    throw new Error(`Unsupported effect style "${styleName}": ${shape}`);
  }

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
        try {
          token = transformEffectStyle(node, style.name, style.description);
        } catch (error) {
          throw new Error(`${error.message} (file ${style.fileKey}, node ${style.node_id})`);
        }
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
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Figma styles sync...\n');

  const args = process.argv.slice(2);
  const preserveTimestamp = args.includes('--preserve-timestamp');

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

  // Save with custom stats formatter
  saveTokensToFile(OUTPUT_FILE, tokens, preserveTimestamp, {
    successMessage: 'Styles saved',
    formatStats: () => {
      const stats = generateTokenStats(tokens, {
        typography: 'typography',
        effects: (token) => ['shadow', 'blur'].includes(token.$type),
        grids: 'grid'
      });

      console.log('\n📊 Style Statistics:');
      console.log(`   Total styles: ${stats.total}`);
      console.log(`   Typography: ${stats.typography}`);
      console.log(`   Effects: ${stats.effects}`);
      console.log(`   Grids: ${stats.grids}`);
    }
  });

  console.log('\n✨ Styles sync completed successfully!');
}

// Run the script when invoked directly (not when required by tests).
// Log error.message only — the raw error can carry the Figma token header.
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { transformTextStyle, transformEffectStyle, transformStylesToDTCG };
