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

/**
 * Custom format for typography and effect SCSS mixins
 */
StyleDictionary.registerFormat({
  name: 'scss/style-mixins',
  format: ({ dictionary }) => {
    let scss = '//\n// Do not edit directly, this file was auto-generated.\n//\n\n';

    const sortedTokens = [...dictionary.allTokens].sort((a, b) => {
      const pathA = a.path.join('-').toLowerCase();
      const pathB = b.path.join('-').toLowerCase();
      return pathA.localeCompare(pathB);
    });

    sortedTokens.forEach(token => {
      const sanitizedPath = token.path.map(part => part.replace(/\s+/g, '-'));

      if (token.$type === 'typography') {
        const mixinName = `text-${sanitizedPath.join('-')}`;
        const value = token.original.$value;

        scss += `@mixin ${mixinName} {\n`;
        if (value.fontFamily) scss += `  font-family: "${value.fontFamily}";\n`;
        if (value.fontSize) scss += `  font-size: ${value.fontSize};\n`;
        if (value.fontWeight) scss += `  font-weight: ${value.fontWeight};\n`;
        if (value.letterSpacing) scss += `  letter-spacing: ${value.letterSpacing};\n`;
        if (value.lineHeight) scss += `  line-height: ${value.lineHeight};\n`;
        scss += '}\n\n';
      } else if (token.$type === 'blur') {
        const mixinName = `effect-${sanitizedPath.join('-')}`;
        scss += `@mixin ${mixinName} {\n`;
        scss += `  backdrop-filter: ${token.original.$value};\n`;
        scss += `  -webkit-backdrop-filter: ${token.original.$value};\n`;
        scss += '}\n\n';
      } else if (token.$type === 'shadow') {
        const mixinName = `shadow-${sanitizedPath.join('-')}`;
        scss += `@mixin ${mixinName} {\n`;
        scss += `  box-shadow: ${token.original.$value};\n`;
        scss += '}\n\n';
      }
    });

    return scss;
  }
});

/**
 * Helper function to filter out broken tokens
 */
function isValidToken(token) {
  // Exclude tokens with unresolved references
  if (typeof token.$value === 'string' && token.$value.includes('unresolved:')) {
    console.warn(`⚠️  Excluding broken token: ${token.path.join('.')} (unresolved reference)`);
    return false;
  }
  return true;
}

/**
 * Preprocessor to remove broken tokens before Style Dictionary processes them
 */
StyleDictionary.registerPreprocessor({
  name: 'remove-broken-tokens',
  preprocessor: (dictionary) => {
    const removeUnresolved = (obj) => {
      Object.keys(obj).forEach(key => {
        if (key.startsWith('$')) return; // Skip metadata

        const value = obj[key];
        if (value && typeof value === 'object') {
          // Check if this is a token with an unresolved value
          if (value.$value && typeof value.$value === 'string' && value.$value.includes('unresolved:')) {
            console.warn(`⚠️  Removing broken token: ${key} (unresolved reference)`);
            delete obj[key];
          } else {
            // Recursively process nested objects
            removeUnresolved(value);
          }
        }
      });
    };

    removeUnresolved(dictionary);
    return dictionary;
  }
});

export default {
  // Preprocessors run before Style Dictionary processes tokens
  preprocessors: ['remove-broken-tokens'],

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
            if (!isValidToken(token)) return false;
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
            if (!isValidToken(token)) return false;
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
          filter: isValidToken,
          options: {
            outputReferences: true
          }
        },
        {
          destination: 'tokens.module.js',
          format: 'javascript/module-flat',
          filter: isValidToken,
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
          filter: isValidToken,
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
          format: 'json/nested',
          filter: isValidToken
        },
        {
          destination: 'tokens-flat.json',
          format: 'json/flat',
          filter: isValidToken
        }
      ]
    },

    // SCSS Variables (for Sass/SCSS projects)
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          filter: (token) => {
            if (!isValidToken(token)) return false;
            return !['typography', 'shadow', 'blur', 'effect', 'grid'].includes(token.$type);
          },
          options: {
            outputReferences: true,
            showFileHeader: true
          }
        },
        {
          destination: '_mixins.scss',
          format: 'scss/style-mixins',
          filter: (token) => {
            if (!isValidToken(token)) return false;
            return ['typography', 'shadow', 'blur', 'effect', 'grid'].includes(token.$type);
          }
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
