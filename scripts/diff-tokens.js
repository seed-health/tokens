#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseTokens, flattenTokens, getPreviousTokens, compareTokens } = require('./utils');

const TOKENS_FILE = 'tokens/figma-variables.json';

/**
 * Format diff for display
 */
function formatDiff(diff) {
  let output = '# Design Token Changes\n\n';

  if (diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0) {
    output += '**No changes detected**\n';
    return output;
  }

  // Added tokens
  if (diff.added.length > 0) {
    output += `## ➕ Added (${diff.added.length})\n\n`;
    diff.added.forEach(token => {
      output += `- \`${token.path}\`\n`;
      output += `  - Type: \`${token.type}\`\n`;
      output += `  - Value: \`${token.value}\`\n`;
      if (token.description) {
        output += `  - Description: ${token.description}\n`;
      }
      output += '\n';
    });
  }

  // Removed tokens
  if (diff.removed.length > 0) {
    output += `## ➖ Removed (${diff.removed.length})\n\n`;
    diff.removed.forEach(token => {
      output += `- \`${token.path}\`\n`;
      output += `  - Was: \`${token.value}\`\n\n`;
    });
  }

  // Modified tokens
  if (diff.modified.length > 0) {
    output += `## 📝 Modified (${diff.modified.length})\n\n`;
    diff.modified.forEach(token => {
      output += `- \`${token.path}\`\n`;

      if (token.old.value !== token.new.value) {
        output += `  - Value: \`${token.old.value}\` → \`${token.new.value}\`\n`;
      }

      if (token.old.type !== token.new.type) {
        output += `  - Type: \`${token.old.type}\` → \`${token.new.type}\`\n`;
      }

      output += '\n';
    });
  }

  // Summary
  output += '## 📊 Summary\n\n';
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
 * Main execution
 */
async function main() {
  console.log('🔍 Analyzing token changes...\n');

  const currentTokens = parseTokens(TOKENS_FILE);
  if (!currentTokens) {
    console.error('❌ Error: Could not read current tokens file');
    process.exit(1);
  }

  const previousTokens = await getPreviousTokens(TOKENS_FILE);
  if (!previousTokens) {
    console.log('ℹ️  No previous version found (new file or no git history)');
    console.log('📊 Current token count:', Object.keys(flattenTokens(currentTokens)).length);
    process.exit(0);
  }

  const diff = compareTokens(previousTokens, currentTokens);
  const breaking = detectBreakingChanges(diff);

  // Output formatted diff
  const diffOutput = formatDiff(diff);
  console.log(diffOutput);

  // Check for breaking changes
  if (breaking.length > 0) {
    console.log('⚠️  BREAKING CHANGES DETECTED:\n');
    breaking.forEach(change => console.log(`   ❗ ${change}`));
    console.log();
  }

  // Save diff to file for GitHub Actions
  const diffFile = path.join(__dirname, '..', 'token-diff.md');
  fs.writeFileSync(diffFile, diffOutput);
  console.log(`📄 Diff saved to: token-diff.md`);

  // Exit with code 1 if there are changes (for CI)
  const hasChanges = diff.added.length + diff.removed.length + diff.modified.length > 0;
  process.exit(hasChanges ? 1 : 0);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
