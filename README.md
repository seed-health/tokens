# @seed-health/tokens

Design tokens for Seed Health applications.

## Installation

```bash
npm install @seed-health/tokens
```

## Usage

### CSS Variables

```jsx
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

### JavaScript/TypeScript

```jsx
import * as tokens from '@seed-health/tokens';

function Button() {
  return (
    <button style={{
      ...tokens.FixedLabelMedium,
      padding: tokens.SpacingX2
    }}>
      Click me
    </button>
  );
}
```

### SCSS

```scss
@use '@seed-health/tokens/build/scss/variables' as *;
@use '@seed-health/tokens/build/scss/mixins' as *;

.button {
  @include text-fixed-label-medium;
  background-color: $color-primary-500;
  padding: $spacing-medium;
}
```

### CSS Modules

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-medium);
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
