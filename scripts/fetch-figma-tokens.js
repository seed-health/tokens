#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');
const path = require('path');
const { setNestedValue, generateTokenStats, saveTokensToFile } = require('./utils');

// Configuration
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const OUTPUT_FILE = path.join(__dirname, '..', 'tokens', 'figma-variables.json');

// Store variable references for alias resolution
const variableIdMap = new Map();
const modeNamesMap = new Map();

/**
 * Fetch variables from a single Figma file
 */
async function fetchFigmaFile(fileKey) {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}/variables/local`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN
        }
      }
    );

    console.log(`   ✅ Fetched: ${fileKey}`);
    return response.data;
  } catch (error) {
    console.error(`   ❌ Error fetching ${fileKey}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Fetch variables from one or more Figma files
 */
async function fetchFigmaVariables() {
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

  console.log(`🔄 Fetching variables from ${fileKeys.length} Figma file(s)...\n`);

  // Fetch from all files
  const allData = await Promise.all(
    fileKeys.map(fileKey => fetchFigmaFile(fileKey))
  );

  // Merge all file data
  if (fileKeys.length === 1) {
    return allData[0];
  }

  console.log('\n🔀 Merging data from multiple files...');

  const merged = {
    meta: {
      variableCollections: {},
      variables: {}
    }
  };

  allData.forEach(data => {
    if (data.meta?.variableCollections) {
      Object.assign(merged.meta.variableCollections, data.meta.variableCollections);
    }
    if (data.meta?.variables) {
      Object.assign(merged.meta.variables, data.meta.variables);
    }
  });

  console.log('   ✅ Merged successfully');

  return merged;
}

/**
 * Map Figma type to W3C DTCG type
 */
function mapFigmaTypeToDTCG(figmaType) {
  const typeMap = {
    'COLOR': 'color',
    'FLOAT': 'dimension',
    'STRING': 'string',
    'BOOLEAN': 'boolean'
  };
  return typeMap[figmaType] || 'string';
}

/**
 * Format value based on type (W3C DTCG compliant)
 */
function formatValue(value, type, variableId, tokenPath = []) {
  // Handle variable aliases (references to other variables)
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    const aliasId = value.id;
    const aliasPath = variableIdMap.get(aliasId);
    if (aliasPath) {
      // Return reference in DTCG format
      return `{${aliasPath.join('.')}}`;
    }
    // If alias not found, log warning and return placeholder
    console.warn(`⚠️  Warning: Unresolved variable alias ${aliasId}`);
    return `{unresolved:${aliasId}}`;
  }

  // Handle color values
  if (type === 'COLOR' && value.r !== undefined) {
    const r = Math.round(value.r * 255);
    const g = Math.round(value.g * 255);
    const b = Math.round(value.b * 255);
    const a = value.a !== undefined ? value.a : 1;

    if (a === 1) {
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } else {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  }

  // Handle dimensions and opacity
  if (type === 'FLOAT') {
    // Ensure value is a number before processing
    if (typeof value === 'object') {
      console.warn(`⚠️  Warning: Invalid FLOAT value (object received):`, value);
      return '[invalid]';
    }

    // Check if this is an opacity token by path
    const pathString = tokenPath.join('/').toLowerCase();
    if (pathString.includes('opacity')) {
      // Opacity values should be unitless decimals (0-1 scale)
      // Convert from 0-100 scale to 0-1 scale
      return value / 100;
    }

    return `${value}px`;
  }

  return value;
}


/**
 * Transform Figma variables to W3C DTCG format
 */
function transformToDTCG(figmaData, fileKeys = []) {
  const tokens = {};
  const { meta } = figmaData;

  // First pass: Build variable ID map and mode names
  if (meta?.variableCollections) {
    Object.entries(meta.variableCollections).forEach(([collectionId, collection]) => {
      console.log(`\n📦 Processing collection: ${collection.name}`);

      // Store mode names for this collection
      collection.modes.forEach(mode => {
        modeNamesMap.set(mode.modeId, mode.name);
      });
    });
  }

  // Second pass: Map variable IDs to their token paths
  if (meta?.variables) {
    Object.entries(meta.variables).forEach(([variableId, variable]) => {
      const pathParts = variable.name.split('/');
      variableIdMap.set(variableId, pathParts);
    });
  }

  // Third pass: Process all variables and create tokens
  if (meta?.variables) {
    Object.entries(meta.variables).forEach(([variableId, variable]) => {
      const { name, resolvedType, valuesByMode, description, scopes } = variable;

      // Split name into path (e.g., "color/primary/500" -> ["color", "primary", "500"])
      const pathParts = name.split('/');

      // Check if this is a FLOAT opacity token and use 'number' type instead of 'dimension'
      // Only apply this override for FLOAT types, not COLOR types
      const pathString = pathParts.join('/').toLowerCase();
      const dtcgType = (resolvedType === 'FLOAT' && pathString.includes('opacity'))
        ? 'number'
        : mapFigmaTypeToDTCG(resolvedType);

      // Get mode information
      const modeIds = Object.keys(valuesByMode);
      const hasMultipleModes = modeIds.length > 1;

      if (hasMultipleModes) {
        // Handle multiple modes (e.g., light/dark themes)
        const modeValues = {};
        modeIds.forEach(modeId => {
          const modeName = modeNamesMap.get(modeId) || modeId;
          modeValues[modeName] = formatValue(
            valuesByMode[modeId],
            resolvedType,
            variableId,
            pathParts
          );
        });

        // Create token with modes
        const token = {
          $type: dtcgType,
          $value: modeValues[Object.keys(modeValues)[0]], // Default to first mode
          modes: modeValues
        };

        if (description) {
          token.$description = description;
        }

        setNestedValue(tokens, pathParts, token);
      } else {
        // Single mode (simple token)
        const value = formatValue(
          valuesByMode[modeIds[0]],
          resolvedType,
          variableId,
          pathParts
        );

        const token = {
          $value: value,
          $type: dtcgType
        };

        if (description) {
          token.$description = description;
        }

        setNestedValue(tokens, pathParts, token);
      }
    });
  }

  // Add metadata
  const metadata = {
    $metadata: {
      generated: new Date().toISOString(),
      source: 'Figma Variables API',
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
  console.log('🚀 Starting Figma token sync...\n');

  const args = process.argv.slice(2);
  const preserveTimestamp = args.includes('--preserve-timestamp');

  // Parse file keys
  const fileKeys = (FIGMA_FILE_KEY || '').split(',').map(k => k.trim()).filter(Boolean);

  const figmaData = await fetchFigmaVariables();
  const tokens = transformToDTCG(figmaData, fileKeys);

  // Save with custom stats formatter
  saveTokensToFile(OUTPUT_FILE, tokens, preserveTimestamp, {
    successMessage: 'Tokens saved',
    formatStats: () => {
      const stats = generateTokenStats(tokens, {
        colors: 'color',
        dimensions: 'dimension',
        strings: 'string',
        references: (token) => typeof token.$value === 'string' && token.$value.startsWith('{')
      });

      console.log('\n📊 Token Statistics:');
      console.log(`   Total tokens: ${stats.total}`);
      console.log(`   Colors: ${stats.colors}`);
      console.log(`   Dimensions: ${stats.dimensions}`);
      console.log(`   Strings: ${stats.strings}`);
      console.log(`   References: ${stats.references}`);
    }
  });

  console.log('\n✨ Token sync completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
