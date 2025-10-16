# Seed Design Tokens

Automated design token sync from Figma Variables to React. Uses Style Dictionary v4 and W3C DTCG format.

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

Get your Figma Personal Access Token from [Figma Settings](https://www.figma.com/settings) and your File Key from your Figma file URL.

Add to `.env`:
```env
FIGMA_TOKEN=your_token
FIGMA_FILE_KEY=your_file_key
```

### 2. Figma Setup

In Figma, use **Variables** (not Styles) with this naming pattern:

```
color/primary/500
color/bg/primary
spacing/medium
spacing/button/padding
```

## Usage

### Commands

```bash
npm run fetch-tokens   # Fetch from Figma
npm run build-tokens   # Build all formats
npm run validate       # Validate tokens
npm run diff           # Show changes
npm run sync           # Fetch + build
```

### In React

**Option 1: CSS Variables** (recommended)

```jsx
// App.jsx
import '@your-org/design-tokens/build/css/variables.css';

function Button() {
  return (
    <button style={{
      backgroundColor: 'var(--color-primary-500)',
      padding: 'var(--spacing-medium)'
    }}>
      Click me
    </button>
  );
}
```

**Option 2: JavaScript Import**

```jsx
import tokens from '@your-org/design-tokens';

function Button() {
  return (
    <button style={{
      backgroundColor: tokens.color.primary['500'].value,
      padding: tokens.spacing.medium.value
    }}>
      Click me
    </button>
  );
}
```

**Option 3: CSS Modules**

```css
/* Button.module.css */
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-medium);
}
```

**Option 4: styled-components**

```jsx
import styled from 'styled-components';
import tokens from '@your-org/design-tokens';

const Button = styled.button`
  background-color: ${tokens.color.primary['500'].value};
  padding: ${tokens.spacing.medium.value};
`;
```

**Option 5: Tailwind CSS**

```js
// tailwind.config.js
const tokens = require('@your-org/design-tokens/build/json/tokens-flat.json');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: tokens['color-primary-500']
      }
    }
  }
};
```

## Output Formats

| Format | Path | Usage |
|--------|------|-------|
| CSS Variables | `build/css/variables.css` | Global import |
| JavaScript ES6 | `build/js/tokens.js` | Direct imports |
| TypeScript | `build/js/tokens.d.ts` | Type definitions |
| JSON | `build/json/tokens.json` | Programmatic access |

## Installation in Your React App

### NPM Package (Recommended)

```bash
# In this repo
npm version patch
npm publish

# In your React app
npm install @your-org/design-tokens
```

### Git Submodule

```bash
cd your-react-app
git submodule add https://github.com/your-org/design-tokens.git tokens
```

### Direct GitHub

```json
{
  "dependencies": {
    "@your-org/design-tokens": "github:your-org/design-tokens#main"
  }
}
```

## Automation

GitHub Action runs hourly and creates PRs with:
- Detailed token diff
- Validation results
- Breaking change detection
- Changelog updates

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

## Troubleshooting

**"Cannot fetch from Figma API"**
- Check `FIGMA_TOKEN` is valid
- Requires Figma Professional plan or higher
- Ensure file uses Variables (not Styles)

**"Validation failed"**
```bash
npm run validate
```

**"Build fails"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run sync
```

## Requirements

- Figma Professional plan or higher
- Node.js 18.x or higher
- React application

## Resources

- [W3C DTCG Spec](https://www.designtokens.org/)
- [Style Dictionary](https://styledictionary.com/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383)
