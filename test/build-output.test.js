const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Acceptance checks for the committed build artifacts. `npm test` rebuilds
// before running these, so they always describe the published output.

const BUILD_DIR = path.join(__dirname, '..', 'build');

function read(file) {
  return fs.readFileSync(path.join(BUILD_DIR, file), 'utf8');
}

function readSourceTokens() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tokens', 'figma-styles.json'), 'utf8'));
}

test('frosted glass emits the CSS-equivalent radius (Figma radius ÷ 2)', () => {
  const stylesCss = read('css/styles.css');
  assert.match(stylesCss, /\.effect-frosted-glass-light {\n  backdrop-filter: blur\(19px\);\n  -webkit-backdrop-filter: blur\(19px\);/);
  assert.match(stylesCss, /\.effect-frosted-glass-strong {\n  backdrop-filter: blur\(37\.5px\);\n  -webkit-backdrop-filter: blur\(37\.5px\);/);

  const mixins = read('scss/_mixins.scss');
  assert.match(mixins, /@mixin effect-frosted-glass-light {\n  backdrop-filter: blur\(19px\);/);
  assert.match(mixins, /@mixin effect-frosted-glass-strong {\n  backdrop-filter: blur\(37\.5px\);/);
});

test('JS exports keep their names and carry the converted blur values', () => {
  const tokensJs = read('js/tokens.js');
  assert.match(tokensJs, /export const FrostedGlassLight = "blur\(19px\)";/);
  assert.match(tokensJs, /export const FrostedGlassStrong = "blur\(37\.5px\)";/);

  const tokensJson = JSON.parse(read('json/tokens.json'));
  assert.equal(tokensJson['frosted-glass-light'], 'blur(19px)');
  assert.equal(tokensJson['frosted-glass-strong'], 'blur(37.5px)');
});

test('subtle shadow keeps its offset, blur, spread, color and order', () => {
  const shadow = readSourceTokens()['subtle shadow'].$value;
  const shorthand = `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
  assert.ok(read('css/styles.css').includes(`.shadow-subtle-shadow {\n  box-shadow: ${shorthand};`));
  assert.ok(read('scss/_mixins.scss').includes(`@mixin shadow-subtle-shadow {\n  box-shadow: ${shorthand};`));
});

test('typography emits numeric font weights only', () => {
  const stylesCss = read('css/styles.css');
  assert.match(stylesCss, /font-weight: 350;/);
  assert.match(stylesCss, /font-weight: 500;/);
  assert.doesNotMatch(stylesCss, /font-weight: "/);
  assert.doesNotMatch(read('scss/_mixins.scss'), /font-weight: "/);
});

test('no quoted string weight variables remain in any public artifact', () => {
  assert.doesNotMatch(read('css/variables.css'), /--font-weight-/);
  assert.doesNotMatch(read('scss/_variables.scss'), /\$font-weight-/);
  assert.doesNotMatch(read('js/tokens.js'), /FontWeight\d/);
  assert.doesNotMatch(read('js/tokens.d.ts'), /FontWeight\d/);
  assert.equal(JSON.parse(read('json/tokens.json')).font?.weight, undefined);
});

test('the inlined React global styles match the CSS build', () => {
  const globalStyles = read('react/global-token-styles.tsx');
  assert.match(globalStyles, /backdrop-filter: blur\(19px\);/);
  assert.match(globalStyles, /backdrop-filter: blur\(37\.5px\);/);
  assert.doesNotMatch(globalStyles, /--font-weight-/);
});
