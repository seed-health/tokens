import { createGlobalStyle } from 'styled-components';

/**
 * Global Token Styles
 *
 * This component inlines CSS from @seed-health/tokens package.
 * Auto-generated - do not edit directly.
 */
export const GlobalTokenStyles = createGlobalStyle`
  /**
   * Design Token Variables
   * Source: build/css/variables.css
   */
:root {
  --color-dark-opacity-10: rgba(0, 0, 0, 0.1);
  --color-dark-opacity-12: rgba(0, 0, 0, 0.12);
  --color-dark-opacity-16: rgba(0, 0, 0, 0.16);
  --color-dark-opacity-20: rgba(0, 0, 0, 0.2);
  --color-dark-opacity-30: rgba(0, 0, 0, 0.3);
  --color-dark-opacity-40: rgba(0, 0, 0, 0.4);
  --color-dark-opacity-50: rgba(0, 0, 0, 0.5);
  --color-dark-opacity-60: rgba(0, 0, 0, 0.6);
  --color-dark-opacity-70: rgba(0, 0, 0, 0.7);
  --color-dark-opacity-80: rgba(0, 0, 0, 0.8);
  --color-dark-opacity-90: rgba(0, 0, 0, 0.9);
  --color-dark-opacity-100: #000000;
  --color-dark-opacity-00: rgba(0, 0, 0, 0);
  --color-dark-opacity-08: rgba(0, 0, 0, 0.08);
  --color-guidance-bright-green: #d3fa99;
  --color-guidance-error: #eb5757;
  --color-guidance-lemongrass: #e9f0ca;
  --color-guidance-warning: #ebb057;
  --color-light-opacity-10: rgba(255, 255, 255, 0.1);
  --color-light-opacity-12: rgba(255, 255, 255, 0.12);
  --color-light-opacity-16: rgba(255, 255, 255, 0.16);
  --color-light-opacity-20: rgba(255, 255, 255, 0.2);
  --color-light-opacity-30: rgba(255, 255, 255, 0.3);
  --color-light-opacity-40: rgba(255, 255, 255, 0.4);
  --color-light-opacity-50: rgba(255, 255, 255, 0.5);
  --color-light-opacity-60: rgba(255, 255, 255, 0.6);
  --color-light-opacity-70: rgba(255, 255, 255, 0.7);
  --color-light-opacity-80: rgba(255, 255, 255, 0.8);
  --color-light-opacity-90: rgba(255, 255, 255, 0.9);
  --color-light-opacity-100: #ffffff;
  --color-light-opacity-00: rgba(255, 255, 255, 0);
  --color-light-opacity-08: rgba(255, 255, 255, 0.08);
  --color-neutral-cool-neutral-20: #f9f9f9;
  --color-neutral-cool-neutral-40: #efefef;
  --color-neutral-cool-neutral-60: #e6e6e6;
  --color-neutral-faded-green-20: #d2d8d0;
  --color-neutral-faded-green-40: #a4b0a1;
  --color-neutral-faded-green-60: #778971;
  --color-neutral-foam-white: #eff1e4;
  --color-neutral-frosted-glass-08: rgba(87, 94, 85, 0.08);
  --color-neutral-frosted-glass-35: rgba(87, 94, 85, 0.35);
  --color-neutral-yellowish-white: #f6f7ef;
  --color-primary-seed-green: #1c3a13;
  --color-primary-seed-green-05: rgba(28, 58, 19, 0.05);
  --color-primary-seed-green-10: rgba(28, 58, 19, 0.1);
  --color-primary-seed-green-15: rgba(28, 58, 19, 0.15);
  --color-primary-seed-green-20: rgba(28, 58, 19, 0.2);
  --color-primary-seed-green-50: rgba(28, 58, 19, 0.5);
  --color-primary-seed-green-70: rgba(28, 58, 19, 0.7);
  --color-primary-snow-white: #fcfcf7;
  --color-primary-snow-white-10: rgba(252, 252, 247, 0.1);
  --color-primary-snow-white-20: rgba(252, 252, 247, 0.2);
  --color-primary-snow-white-50: rgba(252, 252, 247, 0.5);
  --color-primary-snow-white-70: rgba(252, 252, 247, 0.7);
  --color-primary-soft-green: #3d5b34;
  --color-primary-white: #ffffff;
  --extended-palette-arterial-red: #731418;
  --extended-palette-arterial-red-light: #eedac2;
  --extended-palette-asparagus-green: #d0d9b9;
  --extended-palette-duck-green: #466b22;
  --extended-palette-emerald-green: #97b578;
  --extended-palette-grass-green: #86996d;
  --extended-palette-indigo-blue: #4d628d;
  --extended-palette-indigo-blue-light: #cdd6d1;
  --extended-palette-oil-green: #ad9f61;
  --extended-palette-olive-green: #61735e;
  --extended-palette-pistachio-green: #829249;
  --extended-palette-reddish-orange: #be6140;
  --extended-palette-reddish-orange-light: #f7ddaa;
  --extended-palette-scarlet-red: #ef4800;
  --extended-palette-siskin-green: #d7e090;
  --extended-palette-umber-brown: #533b3b;
  --extended-palette-umber-brown-light: #bb797a;
  --extended-palette-verdigris-green: #71aa89;
  --font-family: "Seed Sans";
  --font-family-brand: "Seed Sans";
  --font-family-brand-mono: "Seed Sans Mono";
  --font-size-250: 0.625rem;
  --font-size-300: 0.75rem;
  --font-size-350: 0.875rem;
  --font-size-400: 1rem;
  --font-size-450: 1.125rem;
  --font-size-500: 1.25rem;
  --font-size-600: 1.5rem;
  --font-size-800: 2rem;
  --font-size-1000: 2.5rem;
  --font-size-1200: 3rem;
  --font-size-1600: 4rem;
  --font-weight-300: "light";
  --font-weight-400: "regular";
  --font-weight-500: "medium";
  --opacity-10: 0.1;
  --opacity-20: 0.2;
  --opacity-30: 0.3;
  --opacity-40: 0.4;
  --opacity-50: 0.5;
  --opacity-60: 0.6;
  --opacity-70: 0.7;
  --opacity-80: 0.8;
  --opacity-90: 0.9;
  --opacity-100: 1;
  --opacity-00: 0;
  --products-am-02-dark: #9f995b;
  --products-am-02-darkest: #797648;
  --products-am-02-highlight: #fff593;
  --products-am-02-light: #faf7d3;
  --products-am-02-primary: #eae081;
  --products-am-02-secondary: #f2ecae;
  --products-dm-02-dark: #757c5d;
  --products-dm-02-darkest: #6e7951;
  --products-dm-02-highlight: #dcf194;
  --products-dm-02-light: #ecf2d7;
  --products-dm-02-primary: #b7c194;
  --products-dm-02-secondary: #dee3ca;
  --products-pm-02-dark: #698e79;
  --products-pm-02-darkest: #4e6b5c;
  --products-pm-02-highlight: #c9f3db;
  --products-pm-02-light: #ebf5ef;
  --products-pm-02-primary: #b0d1be;
  --products-pm-02-secondary: #d2e6da;
  --size-100: 0.25rem;
  --size-200: 0.5rem;
  --size-300: 0.75rem;
  --size-400: 1rem;
  --size-600: 1.5rem;
  --size-800: 2rem;
  --size-1000: 2.5rem;
  --size-1200: 3rem;
  --size-1400: 3.5rem;
  --size-1600: 4rem;
  --size-1800: 4.5rem;
  --size-2000: 5rem;
  --size-2500: 6.25rem;
  --size-00: 0;
  --size-025: 0.0625rem;
  --size-050: 0.125rem;
  --actions-bright: var(--color-primary-white);
  --actions-inverse: var(--color-primary-snow-white);
  --actions-primary: var(--color-primary-seed-green);
  --active: var(--opacity-70);
  --column-compact: var(--size-300);
  --column-default: var(--size-100);
  --column-medium: var(--size-200);
  --disabled: var(--opacity-40);
  --fill-foam-white: var(--color-neutral-foam-white);
  --fill-gray: var(--color-neutral-cool-neutral-40);
  --fill-light-gray: var(--color-neutral-cool-neutral-20);
  --fill-lightest: var(--color-primary-white);
  --fill-medium-gray: var(--color-neutral-cool-neutral-60);
  --fill-seed-green: var(--color-primary-seed-green);
  --fill-snow-white: var(--color-primary-snow-white);
  --fill-soft-green: var(--color-primary-soft-green);
  --fill-yellowish-white: var(--color-neutral-yellowish-white);
  --focused: var(--opacity-80);
  --guidance-primary: var(--color-guidance-bright-green);
  --guidance-secondary: var(--color-guidance-lemongrass);
  --gutter-large: var(--size-600);
  --gutter-medium: var(--size-400);
  --gutter-none: var(--size-00);
  --gutter-small: var(--size-200);
  --hover: var(--opacity-80);
  --margin-giant: var(--size-2000);
  --margin-large: var(--size-600);
  --margin-medium: var(--size-400);
  --margin-none: var(--size-00);
  --margin-small: var(--size-200);
  --outline-error: var(--color-guidance-error);
  --outline-light: var(--color-primary-snow-white);
  --outline-lightest: var(--color-primary-snow-white-20);
  --outline-neutral: var(--color-neutral-faded-green-20);
  --outline-neutral-light: var(--color-primary-seed-green-10);
  --outline-primary: var(--color-primary-seed-green);
  --page-grid-column: var(--size-200);
  --page-grid-gutter: var(--size-400);
  --page-grid-margin: var(--size-400);
  --radius-full: var(--size-2500);
  --radius-lg: var(--size-600);
  --radius-md: var(--size-400);
  --radius-sm: var(--size-200);
  --radius-xl: var(--size-800);
  --radius-xs: var(--size-100);
  --scrim-dark-20: var(--color-dark-opacity-20);
  --scrim-dark-50: var(--color-dark-opacity-50);
  --scrim-glass-dark-08: var(--color-neutral-frosted-glass-08);
  --scrim-glass-dark-35: var(--color-neutral-frosted-glass-35);
  --scrim-glass-light-10: var(--color-primary-snow-white-10);
  --scrim-glass-light-20: var(--color-primary-snow-white-20);
  --spacing-4: var(--size-100);
  --spacing-8: var(--size-200);
  --spacing-16: var(--size-400);
  --spacing-24: var(--size-600);
  --spacing-32: var(--size-800);
  --spacing-40: var(--size-1000);
  --spacing-48: var(--size-1200);
  --spacing-56: var(--size-1400);
  --spacing-64: var(--size-1600);
  --spacing-72: var(--size-1800);
  --spacing-80: var(--size-2000);
  --state-layer-dark-disabled: var(--color-dark-opacity-40);
  --state-layer-dark-enabled: var(--color-dark-opacity-00);
  --state-layer-dark-focused: var(--color-dark-opacity-12);
  --state-layer-dark-hovered: var(--color-dark-opacity-08);
  --state-layer-dark-pressed: var(--color-dark-opacity-12);
  --state-layer-inner-focused-fixed: var(--color-primary-snow-white);
  --state-layer-light-disabled: var(--color-light-opacity-60);
  --state-layer-light-enabled: var(--color-light-opacity-00);
  --state-layer-light-focused: var(--color-light-opacity-12);
  --state-layer-light-hovered: var(--color-light-opacity-08);
  --state-layer-light-pressed: var(--color-light-opacity-12);
  --stroke-default: var(--size-025);
  --text-disabled: var(--color-primary-seed-green-50);
  --text-error: var(--color-guidance-error);
  --text-inverse-disabled: var(--color-primary-snow-white-50);
  --text-inverse-primary: var(--color-primary-snow-white);
  --text-inverse-secondary: var(--color-primary-snow-white-70);
  --text-primary: var(--color-primary-seed-green);
  --text-secondary: var(--color-primary-seed-green-70);
  --text-warning: var(--color-guidance-warning);
  --state-layer-outer-focused-fixed: var(--outline-primary);
}


  /**
   * Figma Styles - CSS Classes
   * Source: build/css/styles.css
   */
.text-desktop-display-large {
  font-family: "Seed Sans";
  font-size: 64px;
  font-weight: 350;
  letter-spacing: -1.28px;
  line-height: 110%;
}

.text-desktop-display-small {
  font-family: "Seed Sans";
  font-size: 48px;
  font-weight: 350;
  letter-spacing: -0.96px;
  line-height: 100%;
}

.text-fixed-body-large {
  font-family: "Seed Sans";
  font-size: 18px;
  font-weight: 350;
  letter-spacing: -0.18px;
  line-height: 140%;
}

.text-fixed-body-medium {
  font-family: "Seed Sans";
  font-size: 16px;
  font-weight: 350;
  letter-spacing: -0.16px;
  line-height: 140%;
}

.text-fixed-body-small {
  font-family: "Seed Sans";
  font-size: 14px;
  font-weight: 350;
  letter-spacing: -0.14px;
  line-height: 140%;
}

.text-fixed-body-x-large {
  font-family: "Seed Sans";
  font-size: 20px;
  font-weight: 350;
  letter-spacing: -0.2px;
  line-height: 140%;
}

.text-fixed-body-x-small {
  font-family: "Seed Sans";
  font-size: 12px;
  font-weight: 350;
  letter-spacing: -0.06px;
  line-height: 140%;
}

.text-fixed-body-xx-small {
  font-family: "Seed Sans";
  font-size: 10px;
  font-weight: 350;
  letter-spacing: -0.05px;
  line-height: 140%;
}

.text-fixed-eyebrow {
  font-family: "Seed Sans";
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.24px;
  line-height: 110%;
}

.text-fixed-label-large {
  font-family: "Seed Sans";
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.18px;
  line-height: 140%;
}

.text-fixed-label-medium {
  font-family: "Seed Sans";
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.16px;
  line-height: 140%;
}

.text-fixed-label-small {
  font-family: "Seed Sans";
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 140%;
}

.text-fixed-label-x-large {
  font-family: "Seed Sans";
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.2px;
  line-height: 140%;
}

.text-fixed-label-x-small {
  font-family: "Seed Sans";
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.06px;
  line-height: 140%;
}

.text-fixed-mono-large {
  font-family: "Seed Sans Mono";
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 110%;
}

.text-fixed-mono-small {
  font-family: "Seed Sans Mono";
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 110%;
}

.text-fixed-title-large {
  font-family: "Seed Sans";
  font-size: 32px;
  font-weight: 350;
  letter-spacing: -0.64px;
  line-height: 110%;
}

.text-fixed-title-small {
  font-family: "Seed Sans";
  font-size: 24px;
  font-weight: 350;
  letter-spacing: -0.36px;
  line-height: 120.00000762939453%;
}

.effect-frosted-glass-light {
  backdrop-filter: blur(38px);
  -webkit-backdrop-filter: blur(38px);
}

.effect-frosted-glass-strong {
  backdrop-filter: blur(75px);
  -webkit-backdrop-filter: blur(75px);
}

.text-mobile-display-large {
  font-family: "Seed Sans";
  font-size: 48px;
  font-weight: 350;
  letter-spacing: -0.96px;
  line-height: 110%;
}

.text-mobile-display-small {
  font-family: "Seed Sans";
  font-size: 40px;
  font-weight: 350;
  letter-spacing: -0.8px;
  line-height: 110%;
}

.shadow-subtle-shadow {
  box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.07999999821186066);
}


`;
