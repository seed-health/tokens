const { test } = require('node:test');
const assert = require('node:assert/strict');

async function getTransform() {
  await import('../style-dictionary.config.mjs');
  const { default: StyleDictionary } = await import('style-dictionary');
  return StyleDictionary.hooks.transforms['blur/figma-to-css'];
}

function blurToken(value) {
  return { $type: 'blur', $value: value, path: ['frosted glass test'] };
}

test('blur/figma-to-css halves the raw Figma radius', async () => {
  const { transform, filter } = await getTransform();
  assert.equal(transform(blurToken('blur(75px)')), 'blur(37.5px)');
  assert.equal(transform(blurToken('blur(38px)')), 'blur(19px)');
  assert.equal(transform(blurToken('blur(37.5px)')), 'blur(18.75px)');
  assert.equal(transform(blurToken('blur(0px)')), 'blur(0px)');
  assert.ok(filter(blurToken('blur(38px)')));
  assert.ok(!filter({ $type: 'shadow', $value: {} }));
});

test('blur/figma-to-css rejects values it cannot parse', async () => {
  const { transform } = await getTransform();
  assert.throws(() => transform(blurToken('blur(38px) brightness(0.9)')), /Unexpected blur value/);
  assert.throws(() => transform(blurToken('38')), /Unexpected blur value/);
});
