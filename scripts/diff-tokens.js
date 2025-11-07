#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseTokens, flattenTokens, getPreviousTokens, compareTokens } = require('./utils');

const VARIABLES_FILE = 'tokens/figma-variables.json';
const STYLES_FILE = 'tokens/figma-styles.json';

/**
 * Format a value for display, handling objects properly
 */
function formatValue(value) {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return value;
}

/**
 * Format diff for display
 */
function formatDiff(diff, title = 'Design Token Changes') {
  let output = `### ${title}\n\n`;

  if (diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0) {
    output += '**No changes detected**\n';
    return output;
  }

  // Added tokens
  if (diff.added.length > 0) {
    output += `#### ➕ Added (${diff.added.length})\n\n`;
    diff.added.forEach(token => {
      output += `- \`${token.path}\`\n`;
      output += `  - Type: \`${token.type}\`\n`;
      output += `  - Value: \`${formatValue(token.value)}\`\n`;
      if (token.description) {
        output += `  - Description: ${token.description}\n`;
      }
      output += '\n';
    });
  }

  // Removed tokens
  if (diff.removed.length > 0) {
    output += `#### ➖ Removed (${diff.removed.length})\n\n`;
    diff.removed.forEach(token => {
      output += `- \`${token.path}\`\n`;
      output += `  - Was: \`${formatValue(token.value)}\`\n\n`;
    });
  }

  // Modified tokens
  if (diff.modified.length > 0) {
    output += `#### 📝 Modified (${diff.modified.length})\n\n`;
    diff.modified.forEach(token => {
      output += `- \`${token.path}\`\n`;

      if (token.old.value !== token.new.value) {
        output += `  - Value: \`${formatValue(token.old.value)}\` → \`${formatValue(token.new.value)}\`\n`;
      }

      if (token.old.type !== token.new.type) {
        output += `  - Type: \`${token.old.type}\` → \`${token.new.type}\`\n`;
      }

      output += '\n';
    });
  }

  // Summary
  output += '#### 📊 Summary\n\n';
  output += `- **Added**: ${diff.added.length}\n`;
  output += `- **Removed**: ${diff.removed.length}\n`;
  output += `- **Modified**: ${diff.modified.length}\n`;
  output += `- **Total changes**: ${diff.added.length + diff.removed.length + diff.modified.length}\n`;

  return output;
}

/**
 * Check for breaking changes
 */
function detectBreakingChanges(diff) {
  const breaking = [];

  // Removed tokens are breaking
  diff.removed.forEach(token => {
    breaking.push(`Removed token: ${token.path}`);
  });

  // Type changes are breaking
  diff.modified.forEach(token => {
    if (token.old.type !== token.new.type) {
      breaking.push(`Type changed for ${token.path}: ${token.old.type} → ${token.new.type}`);
    }
  });

  return breaking;
}

/**
 * Process diff for a single file
 */
async function processDiff(filePath, label) {
  const currentTokens = parseTokens(filePath);
  if (!currentTokens) {
    return { diff: null, breaking: [], output: `## ${label}\n\n**File not found**\n\n` };
  }

  const previousTokens = await getPreviousTokens(filePath);
  if (!previousTokens) {
    return {
      diff: null,
      breaking: [],
      output: `## ${label}\n\n**No previous version** (new file or no git history)\n\n`
    };
  }

  const diff = compareTokens(previousTokens, currentTokens);
  const breaking = detectBreakingChanges(diff);
  const output = formatDiff(diff, label);

  return { diff, breaking, output };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Analyzing token changes...\n');

  // Process variables
  console.log('📦 Checking variables...');
  const variablesResult = await processDiff(VARIABLES_FILE, 'Variables Changes');

  // Process styles
  console.log('📦 Checking styles...');
  const stylesResult = await processDiff(STYLES_FILE, 'Styles Changes');

  // Combine outputs
  let combinedOutput = variablesResult.output + '\n';
  combinedOutput += stylesResult.output + '\n';

  // Combine breaking changes
  const allBreaking = [...variablesResult.breaking, ...stylesResult.breaking];

  // Display output
  console.log('\n' + combinedOutput);

  // Check for breaking changes
  if (allBreaking.length > 0) {
    console.log('⚠️  BREAKING CHANGES DETECTED:\n');
    allBreaking.forEach(change => console.log(`   ❗ ${change}`));
    console.log();
  }

  // Save diff to file for GitHub Actions
  const diffFile = path.join(__dirname, '..', 'token-diff.md');
  fs.writeFileSync(diffFile, combinedOutput);
  console.log(`📄 Diff saved to: token-diff.md`);

  // Exit with code 1 if there are changes (for CI)
  const hasChanges =
    (variablesResult.diff && (variablesResult.diff.added.length + variablesResult.diff.removed.length + variablesResult.diff.modified.length) > 0) ||
    (stylesResult.diff && (stylesResult.diff.added.length + stylesResult.diff.removed.length + stylesResult.diff.modified.length) > 0);

  process.exit(hasChanges ? 1 : 0);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
