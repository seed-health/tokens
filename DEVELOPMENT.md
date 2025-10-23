# Development Guide

Internal documentation for maintaining and developing the Seed design tokens system.

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure (copy .env.example to .env and add your credentials)
cp .env.example .env

# 3. Sync tokens from Figma
npm run sync
```

## Setup

### 1. Figma Credentials

Get your Figma Personal Access Token from [Figma Settings](https://www.figma.com/settings) and your File Key(s) from your Figma file URL(s).

Add to `.env`:
```env
FIGMA_TOKEN=your_token

# Single file
FIGMA_FILE_KEY=abc123def456

# Multiple files (comma-separated)
FIGMA_FILE_KEY=abc123,def456,ghi789
```

**Multiple Files**: Variables from all files are merged into a single token set. If there are naming conflicts, the last file wins.

### 2. Figma Setup Expectations

**Variables** (primitives - colors, spacing, sizes):
```
color/primary/500
color/bg/primary
spacing/medium
spacing/button/padding
```

**Styles** (semantic - typography, effects, grids):
```
fixed/body medium
desktop display/large
frosted glass strong
screen grids/static grid
```

**Token Hierarchy:** Variables (primitives) → Styles (semantic) → Components (usage)

## Development Commands

```bash
npm run sync           # Fetch all + build (this will do everything)

npm run fetch-tokens   # Fetch variables from Figma
npm run fetch-styles   # Fetch styles from Figma
npm run fetch-all      # Fetch both variables and styles
npm run build-tokens   # Build all formats
npm test               # Validate tokens + build
npm run diff           # Show changes
```

## Validation

Before committing changes, you can validate tokens locally:

```bash
npm test              # Run all validations
npm run validate      # DTCG spec validation (via Terrazzo)
npm run build-tokens  # Test Style Dictionary build
```

**CI/CD:** See `.github/workflows/validate-tokens.yml`.

## Automation

### Figma Sync Workflow

GitHub Action that runs daily, or can be triggered manually, to sync tokens from Figma:
- Fetches latest variables and styles from Figma
- Validates and builds tokens
- Creates a PR with changes if any exist
- See `.github/workflows/sync-figma-tokens.yml`

### NPM Publishing Workflow

Manual workflow to publish new versions to NPM:
- Builds tokens
- Bumps patch version automatically
- Publishes to NPM with public access
- Creates GitHub release with tag
- See `.github/workflows/publish-npm.yml`

## Naming

**Hierarchy**
1. **Primitive**: `color/blue/500` (what it is)
2. **Semantic**: `color/bg/primary` (what it's for)
3. **Component**: `button/primary/bg` (where it's used)

**Guidance**

Good:
- Use lowercase: `color/primary` not `color/Primary`
- Use `/` separators: `color/primary/500`
- Be specific: `color/text/body` not `color/text/dark`

Bad:
- Avoid abbreviations at root level
- Avoid platform-specific names
- Max four levels deep

## Architecture

### Scripts

- **`scripts/fetch-figma-tokens.js`**: Fetches Figma Variables and transforms to DTCG format
- **`scripts/fetch-figma-styles.js`**: Fetches Figma Styles (typography, effects, grids)
- **`scripts/validate-tokens.js`**: Validates tokens against DTCG spec
- **`scripts/diff-tokens.js`**: Generates diff between current and previous tokens
- **`scripts/utils.js`**: Shared utility functions for token processing

### Configuration

- **`style-dictionary.config.mjs`**: Style Dictionary v4 configuration
  - Custom formats for CSS classes and SCSS mixins
  - Preprocessor to remove broken tokens
  - Multiple platform outputs (CSS, SCSS, JS, TS, JSON)

### Token Sources

- **`tokens/figma-variables.json`**: Raw Figma Variables in DTCG format
- **`tokens/figma-styles.json`**: Raw Figma Styles in DTCG format

### Build Output

All outputs are in `build/` directory:
- `css/` - CSS custom properties and utility classes
- `scss/` - Sass variables and mixins
- `js/` - JavaScript modules and TypeScript definitions
  - `tokens.js` - ES6 module with named exports
  - `tokens.d.ts` - TypeScript type definitions
  - `tokens.module.js` - Flat module exports
- `json/` - JSON formats for programmatic access

## Resources

- [W3C DTCG Spec](https://www.designtokens.org/)
- [Style Dictionary v4](https://styledictionary.com/)
- [Figma Variables API](https://www.figma.com/developers/api#variables)
- [Figma Styles API](https://www.figma.com/developers/api#styles)
- [Terrazzo CLI](https://terrazzoapp.com/docs/cli)
