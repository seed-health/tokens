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

### 2. Figma Setup

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

Before committing changes, validate tokens locally:

```bash
npm test              # Run all validations
npm run validate      # DTCG spec validation (Terrazzo)
npm run build-tokens  # Test Style Dictionary build
```

**What's validated:**
- ✅ DTCG format and structure
- ✅ Token types (colors, dimensions, typography, etc.)
- ✅ Reference integrity and circular references
- ✅ Style Dictionary build compatibility

**CI/CD:** Every PR automatically runs validation and displays results. See `.github/workflows/validate-tokens.yml`.

## Automation

### Figma Sync Workflow

GitHub Action that can be triggered manually to sync tokens from Figma:
- Fetches latest variables and styles from Figma
- Validates and builds tokens
- Creates a PR with changes if any exist
- See `.github/workflows/sync-figma-tokens.yml`

### NPM Publishing Workflow

Manual workflow to publish new versions to NPM:
- Bumps patch version automatically
- Builds tokens
- Publishes to NPM with public access
- Creates GitHub release with tag
- See `.github/workflows/publish-npm.yml`

Trigger manually via GitHub Actions UI.

## Token Format

Uses W3C DTCG standard:

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#3b82f6",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

## Naming Best Practices

**Three-tier hierarchy:**
1. **Primitive**: `color/blue/500` (what it is)
2. **Semantic**: `color/bg/primary` (what it's for)
3. **Component**: `button/primary/bg` (where it's used)

**Rules:**
- ✅ Use lowercase: `color/primary` not `color/Primary`
- ✅ Be specific: `color/text/body` not `color/text/dark`
- ✅ Use `/` separators: `color/primary/500`
- ❌ Avoid abbreviations at root level
- ❌ No platform-specific names
- ❌ Max 4 levels deep

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
- `json/` - JSON formats for programmatic access

## Troubleshooting

### Token Collisions

If you see warnings about token collisions, check for:
- Duplicate token names across variables and styles
- Tokens with same path but different casing
- Legacy tokens that should be removed

### Unresolved References

If tokens reference other tokens that don't exist:
- Check the Figma file for broken variable references
- Ensure all referenced variables are published
- May need to temporarily ignore problematic tokens (see `isValidToken()` in config)

### Build Failures

If Style Dictionary build fails:
- Run `npm run validate` to check DTCG compliance
- Check for tokens with invalid values or types
- Look for circular references in token aliases

## Requirements

- Figma Professional plan or higher (for Variables API access)
- Node.js 20.11 or higher
- GitHub Actions for automation (optional)

## Resources

- [W3C DTCG Spec](https://www.designtokens.org/)
- [Style Dictionary v4](https://styledictionary.com/)
- [Figma Variables API](https://www.figma.com/developers/api#variables)
- [Figma Styles API](https://www.figma.com/developers/api#styles)
- [Terrazzo CLI](https://terrazzoapp.com/docs/cli)
