# @seed-health/tokens

Design tokens for Seed Health applications. Includes colors, typography, spacing, and more in multiple formats.

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
import tokens from '@seed-health/tokens';

function Button() {
  return (
    <button style={{
      backgroundColor: tokens.color.primary['500'],
      padding: tokens.spacing.medium
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

## Available Formats

| Format | Path | Description |
|--------|------|-------------|
| CSS Variables | `build/css/variables.css` | Custom properties for colors, spacing, etc. |
| CSS Classes | `build/css/styles.css` | Typography and effect utility classes |
| SCSS Variables | `build/scss/_variables.scss` | Sass variables |
| SCSS Mixins | `build/scss/_mixins.scss` | Typography and effect mixins |
| JavaScript | `build/js/tokens.js` | ES6 module |
| TypeScript | `build/js/tokens.d.ts` | Type definitions |
| JSON | `build/json/tokens.json` | Nested structure |
| JSON (Flat) | `build/json/tokens-flat.json` | Flat key-value pairs |

## Token Categories

- **Colors**: Brand colors, backgrounds, text colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Margins, paddings, gaps
- **Sizing**: Component dimensions
- **Border Radius**: Corner radius values
- **Shadows**: Box shadow styles
- **Effects**: Blur and other visual effects

## License

MIT
