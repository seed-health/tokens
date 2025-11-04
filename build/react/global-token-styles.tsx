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
  --appearance-measurement-100: 4px;
  --appearance-measurement-200: 8px;
  --appearance-measurement-300: 12px;
  --appearance-measurement-400: 16px;
  --appearance-measurement-600: 24px;
  --appearance-measurement-800: 32px;
  --appearance-measurement-1000: 40px;
  --appearance-measurement-1200: 48px;
  --appearance-measurement-1400: 56px;
  --appearance-measurement-1600: 64px;
  --appearance-measurement-1800: 72px;
  --appearance-measurement-2000: 80px;
  --appearance-measurement-2500: 100px;
  --appearance-measurement-00: 0px;
  --appearance-measurement-025: 1px;
  --appearance-measurement-050: 2px;
  --appearance-opacity-10: 10px;
  --appearance-opacity-20: 20px;
  --appearance-opacity-30: 30px;
  --appearance-opacity-40: 40px;
  --appearance-opacity-50: 50px;
  --appearance-opacity-60: 60px;
  --appearance-opacity-70: 70px;
  --appearance-opacity-80: 80px;
  --appearance-opacity-90: 90px;
  --appearance-opacity-100: 100px;
  --appearance-opacity-00: 0px;
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
  --color-guidance-error: #eb5757;
  --color-guidance-flourescent-green: #d3fa99;
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
  --color-neutral-frosted-glass-t35: rgba(87, 94, 85, 0.35);
  --color-neutral-frosted-glass-t8: rgba(87, 94, 85, 0.08);
  --color-neutral-yellowish-white: #f6f7ef;
  --color-primary-seed-green: #1c3a13;
  --color-primary-seed-green-t10: rgba(28, 58, 19, 0.1);
  --color-primary-seed-green-t15: rgba(28, 58, 19, 0.15);
  --color-primary-seed-green-t20: rgba(28, 58, 19, 0.2);
  --color-primary-seed-green-t5: rgba(28, 58, 19, 0.05);
  --color-primary-seed-green-t50: rgba(28, 58, 19, 0.5);
  --color-primary-seed-green-t70: rgba(28, 58, 19, 0.7);
  --color-primary-snow-white: #fcfcf7;
  --color-primary-snow-white-t10: rgba(252, 252, 247, 0.1);
  --color-primary-snow-white-t20: rgba(252, 252, 247, 0.2);
  --color-primary-snow-white-t70: rgba(252, 252, 247, 0.7);
  --color-primary-soft-green: #3d5b34;
  --color-primary-white: #ffffff;
  --extended-palette-arterial-red: #731418;
  --extended-palette-arterial-red-light: #eedac2;
  --extended-palette-asparagus-green: #d0d9b9;
  --extended-palette-duck-green: #466b22;
  --extended-palette-emerald-green: #97b578;
  --extended-palette-grass-green: #86996d; /** inaccessible, only use large white text */
  --extended-palette-indigo-blue: #4d628d;
  --extended-palette-indigo-blue-light: #cdd6d1;
  --extended-palette-oil-green: #ad9f61;
  --extended-palette-olive-green: #61735e;
  --extended-palette-pistachio-green: #829249; /** inaccessible, only use large white text */
  --extended-palette-reddish-orange: #be6140; /** inaccessible, only use large white text */
  --extended-palette-reddish-orange-light: #f7ddaa;
  --extended-palette-scarlet-red: #ef4800;
  --extended-palette-siskin-green: #d7e090;
  --extended-palette-umber-brown: #533b3b;
  --extended-palette-umber-brown-light: #bb797a;
  --extended-palette-verdigris-green: #71aa89; /** inaccessible, only use large white text */
  --font-family: Seed Sans;
  --font-family-mono: Seed Sans Mono;
  --products-am-02-dark: #9f995b;
  --products-am-02-highlight: #fff593;
  --products-am-02-light: #faf7d3;
  --products-am-02-primary: #eae081;
  --products-am-02-secondary: #f2ecae;
  --products-dm-02-dark: #757c5d;
  --products-dm-02-highlight: #dcf194;
  --products-dm-02-light: #ecf2d7;
  --products-dm-02-primary: #b7c194;
  --products-dm-02-secondary: #dee3ca;
  --products-pm-02-dark: #698e79;
  --products-pm-02-highlight: #c9f3db;
  --products-pm-02-light: #ebf5ef;
  --products-pm-02-primary: #b0d1be;
  --products-pm-02-secondary: #d2e6da;
  --spacing-base: 8px;
  --spacing-x10: 80px;
  --spacing-x2: 16px;
  --spacing-x4: 32px;
  --spacing-x5: 40px;
  --spacing-x6: 48px;
  --spacing-x7: 56px;
  --spacing-x8: 64px;
  --state-layer-outer-focused-fixed: #0000f5;
  --typeface-size-350: 14px;
  --typography-font-brand: Seed Sans;
  --typography-font-brand-mono: Seed Sans Mono;
  --typography-size-300: 12px;
  --typography-size-350: 14px;
  --typography-size-400: 16px;
  --typography-size-450: 18px;
  --typography-size-500: 20px;
  --typography-size-600: 24px;
  --typography-size-800: 32px;
  --typography-size-1000: 40px;
  --typography-size-1200: 48px;
  --typography-size-1600: 64px;
  --typography-weight-300: light;
  --typography-weight-400: regular;
  --typography-weight-500: medium;
  --actions-inverse: var(--color-primary-snow-white);
  --actions-primary: var(--color-primary-seed-green);
  --background-light: var(--color-primary-snow-white);
  --background-lightest-white: var(--color-primary-white);
  --background-medium: var(--color-neutral-foam-white);
  --column-compact: var(--appearance-measurement-300);
  --column-default: var(--appearance-measurement-100);
  --column-medium: var(--appearance-measurement-200);
  --container-foam-white: var(--color-neutral-foam-white);
  --container-gray: var(--color-neutral-cool-neutral-40);
  --container-light-gray: var(--color-neutral-cool-neutral-20);
  --container-lightest: var(--color-primary-white);
  --container-medium-gray: var(--color-neutral-cool-neutral-60);
  --container-seed-green: var(--color-primary-seed-green);
  --container-snow-white: var(--color-primary-snow-white);
  --container-soft-green: var(--color-primary-soft-green);
  --container-yellowish-white: var(--color-neutral-yellowish-white);
  --gap-4: var(--appearance-measurement-100);
  --gap-8: var(--appearance-measurement-200);
  --gap-16: var(--appearance-measurement-400);
  --gap-24: var(--appearance-measurement-600);
  --gap-32: var(--appearance-measurement-800);
  --gap-40: var(--appearance-measurement-1000);
  --gap-48: var(--appearance-measurement-1200);
  --gap-56: var(--appearance-measurement-1400);
  --gap-64: var(--appearance-measurement-1600);
  --gap-72: var(--appearance-measurement-1800);
  --gap-80: var(--appearance-measurement-2000);
  --guidance-guidance-primary: var(--color-guidance-flourescent-green);
  --guidance-guidance-secondary: var(--color-guidance-lemongrass);
  --gutter-large: var(--appearance-measurement-600);
  --gutter-medium: var(--appearance-measurement-400);
  --gutter-none: var(--appearance-measurement-00);
  --gutter-small: var(--appearance-measurement-200);
  --margin-giant: var(--appearance-measurement-2000);
  --margin-large: var(--appearance-measurement-600);
  --margin-medium: var(--appearance-measurement-400);
  --margin-none: var(--appearance-measurement-00);
  --margin-small: var(--appearance-measurement-200);
  --outline-error: var(--color-guidance-error);
  --outline-light: var(--color-primary-snow-white);
  --outline-lightest: var(--color-primary-snow-white-t20);
  --outline-neutral: var(--color-neutral-faded-green-20);
  --outline-neutral-light: var(--color-primary-seed-green-t10);
  --outline-primary: var(--color-primary-seed-green);
  --page-grid-column: var(--appearance-measurement-200);
  --page-grid-gutter: var(--appearance-measurement-400);
  --page-grid-margin: var(--appearance-measurement-400);
  --radius-full: var(--appearance-measurement-2500);
  --radius-large: var(--appearance-measurement-800);
  --radius-medium: var(--appearance-measurement-400);
  --radius-small: var(--appearance-measurement-200);
  --radius-x-small: var(--appearance-measurement-100);
  --scrim-dark-20: var(--color-dark-opacity-20);
  --scrim-dark-50: var(--color-dark-opacity-50);
  --scrim-glass-dark-08: var(--color-neutral-frosted-glass-t8);
  --scrim-glass-dark-35: var(--color-neutral-frosted-glass-t35);
  --scrim-glass-light-10: var(--color-primary-snow-white-t10);
  --scrim-glass-light-20: var(--color-primary-snow-white-t20);
  --state-layer-dark-disabled: var(--color-dark-opacity-60);
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
  --state-opacity-disabled: var(--appearance-opacity-40);
  --state-opacity-focused: var(--appearance-opacity-80);
  --state-opacity-hover: var(--appearance-opacity-80);
  --state-opacity-pressed: var(--appearance-opacity-70);
  --stroke-default: var(--appearance-measurement-025);
  --text-disabled: var(--color-primary-seed-green-t50);
  --text-error: var(--color-guidance-error);
  --text-inverse: var(--color-primary-snow-white);
  --text-primary: var(--color-primary-seed-green);
  --text-secondary: var(--color-primary-seed-green-t70);
  --text-warning: var(--color-guidance-warning);
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
  font-size: 20px;
  font-weight: 350;
  letter-spacing: -0.2px;
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

.text-fixed-body-xsmall {
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
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.2px;
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

.text-fixed-label-xsmall {
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
