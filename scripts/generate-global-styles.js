const fs = require('fs');
const path = require('path');

/**
 * Generate global-token-styles.tsx for styled-components
 * This script reads the generated CSS files and creates a TypeScript
 * file that exports a createGlobalStyle component.
 */

const BUILD_DIR = path.join(__dirname, '..', 'build');
const CSS_DIR = path.join(BUILD_DIR, 'css');
const REACT_DIR = path.join(BUILD_DIR, 'react');

const VARIABLES_CSS = path.join(CSS_DIR, 'variables.css');
const STYLES_CSS = path.join(CSS_DIR, 'styles.css');
const OUTPUT_FILE = path.join(REACT_DIR, 'global-token-styles.tsx');

/**
 * Escape template literal content to prevent interpolation issues
 */
function escapeTemplateContent(content) {
  // Replace ${} with \${} and backticks with \`
  return content
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/`/g, '\\`')     // Escape backticks
    .replace(/\$\{/g, '\\${'); // Escape template interpolations
}

/**
 * Read and process a CSS file
 */
function readCSSFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSS file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Remove the auto-generated comment from the top if present
  return content.replace(/^\/\*\*[\s\S]*?\*\/\s*\n/, '');
}

/**
 * Generate the TypeScript file content
 */
function generateTypeScriptContent(variablesCSS, stylesCSS) {
  const escapedVariables = escapeTemplateContent(variablesCSS);
  const escapedStyles = escapeTemplateContent(stylesCSS);

  return `import { createGlobalStyle } from 'styled-components';

/**
 * Global Token Styles
 *
 * This component inlines CSS from @seed-health/tokens package.
 * Auto-generated - do not edit directly.
 */
export const GlobalTokenStyles = createGlobalStyle\`
  /**
   * Design Token Variables
   * Source: build/css/variables.css
   */
${escapedVariables}

  /**
   * Figma Styles - CSS Classes
   * Source: build/css/styles.css
   */
${escapedStyles}
\`;
`;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🎨 Generating global-token-styles.tsx...');

    // Ensure output directory exists
    if (!fs.existsSync(REACT_DIR)) {
      fs.mkdirSync(REACT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${REACT_DIR}`);
    }

    // Read CSS files
    console.log('📖 Reading CSS files...');
    const variablesCSS = readCSSFile(VARIABLES_CSS);
    const stylesCSS = readCSSFile(STYLES_CSS);

    // Generate TypeScript content
    const tsContent = generateTypeScriptContent(variablesCSS, stylesCSS);

    // Write output file
    fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
    console.log(`✅ Generated: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error generating global styles:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
