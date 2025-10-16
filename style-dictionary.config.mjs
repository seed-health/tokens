import StyleDictionary from 'style-dictionary';

/**
 * Custom format for typography and effect CSS classes
 */
StyleDictionary.registerFormat({
  name: 'css/style-classes',
  format: ({ dictionary }) => {
    let css = '/**\n * Figma Styles - CSS Classes\n * Generated from Figma Styles API\n */\n\n';

    // Sort tokens alphabetically by their path
    const sortedTokens = [...dictionary.allTokens].sort((a, b) => {
      const pathA = a.path.join('-').toLowerCase();
      const pathB = b.path.join('-').toLowerCase();
      return pathA.localeCompare(pathB);
    });

    sortedTokens.forEach(token => {
      // Replace spaces with hyphens in path for valid CSS class names
      const sanitizedPath = token.path.map(part => part.replace(/\s+/g, '-'));

      if (token.$type === 'typography') {
        const className = `.text-${sanitizedPath.join('-')}`;
        const value = token.original.$value; // Use original value before transforms

        css += `${className} {\n`;
        if (value.fontFamily) css += `  font-family: "${value.fontFamily}";\n`;
        if (value.fontSize) css += `  font-size: ${value.fontSize};\n`;
        if (value.fontWeight) css += `  font-weight: ${value.fontWeight};\n`;
        if (value.letterSpacing) css += `  letter-spacing: ${value.letterSpacing};\n`;
        if (value.lineHeight) css += `  line-height: ${value.lineHeight};\n`;
        css += '}\n\n';
      } else if (token.$type === 'blur') {
        const className = `.effect-${sanitizedPath.join('-')}`;
        css += `${className} {\n`;
        css += `  backdrop-filter: ${token.original.$value};\n`;
        css += `  -webkit-backdrop-filter: ${token.original.$value};\n`;
        css += '}\n\n';
      } else if (token.$type === 'shadow') {
        const className = `.shadow-${sanitizedPath.join('-')}`;
        css += `${className} {\n`;
        css += `  box-shadow: ${token.original.$value};\n`;
        css += '}\n\n';
      }
    });

    return css;
  }
});

export default {
  // Source files support DTCG format natively in v4
  source: ['tokens/**/*.json'],

  platforms: {
    // CSS Custom Properties (for CSS Modules, global styles, CSS-in-JS)
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          // Only include primitive tokens (color, dimension, string, etc.)
          filter: (token) => {
            return !['typography', 'shadow', 'blur', 'effect', 'grid'].includes(token.$type);
          },
          options: {
            outputReferences: true,
            showFileHeader: true
          }
        },
        {
          destination: 'styles.css',
          format: 'css/style-classes',
          // Only include style tokens (typography, effects, grids)
          filter: (token) => {
            return ['typography', 'shadow', 'blur', 'effect', 'grid'].includes(token.$type);
          }
        }
      ]
    },

    // JavaScript ES6 Module (for importing in React components)
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: {
            outputReferences: true
          }
        },
        {
          destination: 'tokens.module.js',
          format: 'javascript/module-flat',
          options: {
            outputReferences: true
          }
        }
      ]
    },

    // TypeScript Definitions (for type-safe React/TypeScript projects)
    ts: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
          options: {
            outputStringLiterals: true
          }
        }
      ]
    },

    // JSON formats (for programmatic access in React)
    json: {
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested'
        },
        {
          destination: 'tokens-flat.json',
          format: 'json/flat'
        }
      ]
    }
  },

  // Custom logging
  log: {
    warnings: 'warn',
    verbosity: 'default'
  }
};
