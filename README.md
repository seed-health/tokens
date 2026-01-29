# @seed-health/tokens

Design tokens for Seed Health applications.

> **Note:** This repository is maintained by Seed Health and is open for visibility and usage, but not accepting external contributions. Tokens are automatically synced from our Figma design system.

## Installation

```bash
npm install @seed-health/tokens
```

## Usage

### Tailwind CSS v4 (Recommended)

Import the theme and component classes directly in your CSS:

```css
@import "tailwindcss";
@import "@seed-health/tokens/tailwind";
@import "@seed-health/tokens/tailwind/components";
```

Use Tailwind utilities with your design tokens:

```html
<div class="bg-color-primary-seed-green text-color-primary-snow-white p-appearance-measurement-400 rounded-radius-medium">
  <h1 class="text-fixed-title-large">Hello</h1>
  <p class="text-fixed-body-medium">Body text with typography preset</p>
</div>
```

### CSS Variables

```jsx
import '@seed-health/tokens/css/variables.css';
import '@seed-health/tokens/css/styles.css';

function Button() {
  return (
    <button
      className="text-fixed-body-medium"
      style={{
        backgroundColor: 'var(--color-primary-seed-green)',
        padding: 'var(--appearance-measurement-400)',
        borderRadius: 'var(--radius-medium)'
      }}>
      Click me
    </button>
  );
}
```

### JavaScript/TypeScript

```jsx
import * as tokens from '@seed-health/tokens';

function Button() {
  return (
    <button style={{
      ...tokens.FixedLabelMedium,
      padding: tokens.AppearanceMeasurement400
    }}>
      Click me
    </button>
  );
}
```

### SCSS

```scss
@use '@seed-health/tokens/scss/variables' as *;
@use '@seed-health/tokens/scss/mixins' as *;

.button {
  @include text-fixed-label-medium;
  background-color: $color-primary-seed-green;
  padding: $appearance-measurement-400;
  border-radius: $radius-medium;
}
```

### CSS Modules

```css
.button {
  background-color: var(--color-primary-seed-green);
  padding: var(--appearance-measurement-400);
  border-radius: var(--radius-medium);
}
```

### React (styled-components)

```tsx
import { GlobalTokenStyles } from '@seed-health/tokens/react';

function App() {
  return (
    <>
      <GlobalTokenStyles />
      {/* Your app content */}
    </>
  );
}
```

## Available Formats

| Format | Path | Description |
|--------|------|-------------|
| Tailwind Theme | `build/tailwind/theme.css` | Tailwind v4 `@theme` block with CSS variables |
| Tailwind Components | `build/tailwind/components.css` | Typography utility classes for `@layer components` |
| CSS Variables | `build/css/variables.css` | Custom properties for colors, spacing, etc. |
| CSS Classes | `build/css/styles.css` | Typography and effect utility classes |
| React Component | `build/react/global-token-styles.tsx` | styled-components GlobalStyle |
| SCSS Variables | `build/scss/_variables.scss` | Sass variables |
| SCSS Mixins | `build/scss/_mixins.scss` | Typography and effect mixins |
| JavaScript | `build/js/tokens.js` | ES6 module with named exports |
| TypeScript | `build/js/tokens.d.ts` | Type definitions |
| JSON | `build/json/tokens.json` | Nested structure (kebab-case keys) |
| JSON (Flat) | `build/json/tokens-flat.json` | Flat key-value pairs |

## License

MIT
