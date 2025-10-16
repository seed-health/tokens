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
          options: {
            outputReferences: true,
            showFileHeader: true
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
