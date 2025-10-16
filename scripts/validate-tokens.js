#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VARIABLES_FILE = path.join(__dirname, '..', 'tokens', 'figma-variables.json');
const STYLES_FILE = path.join(__dirname, '..', 'tokens', 'figma-styles.json');

const errors = [];
const warnings = [];

/**
 * Validate that tokens file exists and is valid JSON
 */
function validateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { error: 'File not found', data: null };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { error: null, data: JSON.parse(content) };
  } catch (error) {
    return { error: `Invalid JSON: ${error.message}`, data: null };
  }
}

/**
 * Validate W3C DTCG format
 */
function validateDTCG(tokens) {
  function checkToken(obj, path = []) {
    for (const key in obj) {
      if (key.startsWith('$')) continue;

      const value = obj[key];
      const currentPath = [...path, key];

      if (typeof value === 'object' && value !== null) {
        if (value.$value !== undefined) {
          // This is a token - validate it
          if (!value.$type) {
            warnings.push(`Missing $type: ${currentPath.join('.')}`);
          }

          // Validate color format
          if (value.$type === 'color' && typeof value.$value === 'string' && !value.$value.startsWith('{')) {
            if (!/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$|^rgba?\(/.test(value.$value)) {
              errors.push(`Invalid color format: ${currentPath.join('.')} = ${value.$value}`);
            }
          }

          // Validate typography format
          if (value.$type === 'typography') {
            if (typeof value.$value !== 'object') {
              errors.push(`Typography must have object value: ${currentPath.join('.')}`);
            } else {
              const required = ['fontFamily', 'fontSize'];
              required.forEach(prop => {
                if (!value.$value[prop]) {
                  errors.push(`Typography missing ${prop}: ${currentPath.join('.')}`);
                }
              });
            }
          }

          // Validate shadow/blur format
          if (value.$type === 'blur' || value.$type === 'shadow') {
            if (typeof value.$value !== 'string') {
              errors.push(`${value.$type} must have string value: ${currentPath.join('.')}`);
            }
          }

          // Validate grid format
          if (value.$type === 'grid') {
            if (typeof value.$value !== 'object' && !Array.isArray(value.$value)) {
              errors.push(`Grid must have object or array value: ${currentPath.join('.')}`);
            }
          }
        } else {
          // Nested object, recurse
          checkToken(value, currentPath);
        }
      }
    }
  }

  checkToken(tokens);
}

/**
 * Validate token references
 */
function validateReferences(tokens) {
  const allPaths = new Set();
  const references = [];

  function collectPaths(obj, path = []) {
    for (const key in obj) {
      if (key.startsWith('$')) continue;

      const value = obj[key];
      const currentPath = [...path, key];

      if (typeof value === 'object' && value !== null) {
        if (value.$value !== undefined) {
          allPaths.add(currentPath.join('.'));

          if (typeof value.$value === 'string' && value.$value.startsWith('{') && value.$value.endsWith('}')) {
            references.push({
              from: currentPath.join('.'),
              to: value.$value.slice(1, -1)
            });
          }
        } else {
          collectPaths(value, currentPath);
        }
      }
    }
  }

  collectPaths(tokens);

  references.forEach(ref => {
    if (!allPaths.has(ref.to)) {
      errors.push(`Broken reference: ${ref.from} → {${ref.to}}`);
    }
  });
}

/**
 * Main validation
 */
function main() {
  console.log('🔍 Validating tokens...\n');

  // Validate variables file
  console.log('📦 Validating variables...');
  const variablesResult = validateFile(VARIABLES_FILE);
  if (variablesResult.error) {
    errors.push(`Variables: ${variablesResult.error}`);
  } else {
    console.log('   ✅ Variables file valid');
    validateDTCG(variablesResult.data);
    validateReferences(variablesResult.data);
  }

  // Validate styles file
  console.log('\n📦 Validating styles...');
  const stylesResult = validateFile(STYLES_FILE);
  if (stylesResult.error) {
    // Styles file is optional for now
    warnings.push(`Styles: ${stylesResult.error}`);
    console.log('   ⚠️  Styles file not found (optional)');
  } else {
    console.log('   ✅ Styles file valid');
    validateDTCG(stylesResult.data);
    validateReferences(stylesResult.data);
  }

  // Print results
  console.log();
  if (errors.length > 0) {
    console.log(`❌ Errors (${errors.length}):`);
    errors.forEach(err => console.log(`   • ${err}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(warn => console.log(`   • ${warn}`));
    console.log();
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All validations passed!\n');
    process.exit(0);
  } else if (errors.length === 0) {
    console.log('⚠️  Passed with warnings\n');
    process.exit(0);
  } else {
    console.log('❌ Validation failed\n');
    process.exit(1);
  }
}

main();
