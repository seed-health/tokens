#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TOKENS_FILE = path.join(__dirname, '..', 'tokens', 'figma-variables.json');

const errors = [];
const warnings = [];

/**
 * Validate that tokens file exists and is valid JSON
 */
function validateFile() {
  if (!fs.existsSync(TOKENS_FILE)) {
    errors.push('Tokens file not found');
    return null;
  }

  try {
    const content = fs.readFileSync(TOKENS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    errors.push(`Invalid JSON: ${error.message}`);
    return null;
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

  const tokens = validateFile();
  if (!tokens) {
    console.log('❌ Validation failed\n');
    errors.forEach(err => console.log(`   • ${err}`));
    process.exit(1);
  }

  validateDTCG(tokens);
  validateReferences(tokens);

  // Print results
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
