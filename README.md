# Seed Design Tokens

Automated design token sync from Figma Variables and Styles to React. Uses Style Dictionary v4 and W3C DTCG format.

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

## Usage

### Commands

```bash
npm run fetch-tokens   # Fetch variables from Figma
npm run fetch-styles   # Fetch styles from Figma
npm run fetch-all      # Fetch both variables and styles
npm run build-tokens   # Build all formats
npm run validate       # Validate tokens
npm run diff           # Show changes
npm run sync           # Fetch all + build
```

### In React

**Option 1: CSS Variables + Classes** (recommended)

```jsx
// App.jsx
import '@seed-health/tokens/build/css/variables.css';
import '@seed-health/tokens/build/css/styles.css';

function Button() {
  return (
    <button
      className="text-fixed-body-medium"
      style={{
        backgroundColor: 'var(--color-primary-500)',
        padding: 'var(--spacing-medium)'
      }}>
      Click me
    </button>
  );
}
```

**Option 2: CSS Classes Only (Typography & Effects)**

```jsx
// For typography styles
<p className="text-fixed-body-medium">Body text</p>
<h1 className="text-desktop-display-large">Large heading</h1>

// For effects
<div className="effect-frosted-glass-strong">Glass morphism</div>
```

**Option 3: JavaScript Import**

```jsx
import tokens from '@seed-health/tokens';

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

**Option 4: CSS Modules**

```css
/* Button.module.css */
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-medium);
}
```

**Option 5: SCSS/Sass**

```scss
@use '@seed-health/tokens/build/scss/variables' as *;
@use '@seed-health/tokens/build/scss/mixins' as *;

.button {
  @include text-fixed-label-medium;
  background-color: $color-primary-seed-green;
  padding: $spacing-base $spacing-x2;
  border-radius: $corner-radius-sm;
}

.glass-card {
  @include effect-frosted-glass-strong;
  background-color: $color-primary-snow-white-t70;
}
```

**Option 6: styled-components**

```jsx
import styled from 'styled-components';
import tokens from '@seed-health/tokens';

const Button = styled.button`
  background-color: ${tokens.color.primary['500'].value};
  padding: ${tokens.spacing.medium.value};
`;
```

## Output Formats

| Format | Path | Usage |
|--------|------|-------|
| CSS Variables | `build/css/variables.css` | Primitive tokens (colors, spacing) |
| CSS Classes | `build/css/styles.css` | Semantic styles (typography, effects) |
| SCSS Variables | `build/scss/_variables.scss` | Primitive tokens for Sass/SCSS |
| SCSS Mixins | `build/scss/_mixins.scss` | Typography & effects for Sass/SCSS |
| JavaScript ES6 | `build/js/tokens.js` | Direct imports |
| TypeScript | `build/js/tokens.d.ts` | Type definitions |
| JSON | `build/json/tokens.json` | Programmatic access |

## Using in my-seed-live (MSL) or other repo

### Git Submodule

**Setup (one time in repo):**
```bash
cd your-react-app
git submodule add git@github.com:seed-health/tokens.git tokens
git commit -m "Add design tokens submodule"
```

**Import in React:**
```jsx
// Import both CSS files
import '../tokens/build/css/variables.css';
import '../tokens/build/css/styles.css';

// Or JavaScript
import tokens from '../tokens/build/js/tokens.js';
```

**Update tokens when needed:**
```bash
cd tokens
git pull origin main
cd ..
git add tokens
git commit -m "Update design tokens"
```

**Setup from my-seed-live (MSL) or other repo:**
```bash
git clone --recursive https://github.com/seed-health/my-seed-live
# or if already cloned:
git submodule update --init --recursive
```

## Automation

GitHub Action runs hourly and creates PRs with:
- Detailed token diff
- Validation results
- Breaking change detection

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

## Requirements

- Figma Professional plan or higher
- Node.js 20.11 or higher
- React application

## Resources

- [W3C DTCG Spec](https://www.designtokens.org/)
- [Style Dictionary](https://styledictionary.com/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383)
