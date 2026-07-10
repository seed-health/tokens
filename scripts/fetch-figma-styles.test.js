const { test } = require('node:test');
const assert = require('node:assert/strict');
const { transformTextStyle, transformEffectStyle, transformStylesToDTCG } = require('./fetch-figma-styles');

function effectNode(effects) {
  return { document: { effects } };
}

test('background blur keeps the raw Figma radius', () => {
  const token = transformEffectStyle(
    effectNode([{ type: 'BACKGROUND_BLUR', visible: true, radius: 38 }]),
    'frosted glass light'
  );
  assert.deepEqual(token, { $value: 'blur(38px)', $type: 'blur' });
});

test('invisible effects are ignored', () => {
  const token = transformEffectStyle(
    effectNode([
      { type: 'DROP_SHADOW', visible: false, offset: { x: 0, y: 1 }, radius: 2, color: { r: 0, g: 0, b: 0, a: 1 } },
      { type: 'BACKGROUND_BLUR', radius: 75 }
    ]),
    'frosted glass strong'
  );
  assert.deepEqual(token, { $value: 'blur(75px)', $type: 'blur' });
});

test('drop shadow preserves offset, blur, spread, color and order', () => {
  const token = transformEffectStyle(
    effectNode([{
      type: 'DROP_SHADOW',
      visible: true,
      offset: { x: 0, y: 4 },
      radius: 30,
      spread: 6,
      color: { r: 0, g: 0, b: 0, a: 0.08 }
    }]),
    'subtle shadow',
    'elevation'
  );
  assert.equal(token.$type, 'shadow');
  assert.equal(token.$description, 'elevation');
  assert.deepEqual(token.$value, {
    offsetX: '0px',
    offsetY: '4px',
    blur: '30px',
    spread: '6px',
    color: 'rgba(0, 0, 0, 0.08)'
  });
});

test('drop shadow without spread defaults to 0px', () => {
  const token = transformEffectStyle(
    effectNode([{
      type: 'DROP_SHADOW',
      visible: true,
      offset: { x: 0, y: 4 },
      radius: 30,
      color: { r: 0, g: 0, b: 0, a: 0.08 }
    }]),
    'subtle shadow'
  );
  assert.equal(token.$value.spread, '0px');
});

test('multiple drop shadows keep their order', () => {
  const token = transformEffectStyle(
    effectNode([
      { type: 'DROP_SHADOW', visible: true, offset: { x: 0, y: 1 }, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 } },
      { type: 'DROP_SHADOW', visible: true, offset: { x: 0, y: 8 }, radius: 24, color: { r: 0, g: 0, b: 0, a: 0.2 } }
    ]),
    'layered shadow'
  );
  assert.equal(token.$value.length, 2);
  assert.equal(token.$value[0].offsetY, '1px');
  assert.equal(token.$value[1].offsetY, '8px');
});

test('compound blur + shadow fails with the style name', () => {
  assert.throws(
    () => transformEffectStyle(
      effectNode([
        { type: 'BACKGROUND_BLUR', radius: 38 },
        { type: 'DROP_SHADOW', visible: true, offset: { x: 0, y: 4 }, radius: 30, color: { r: 0, g: 0, b: 0, a: 0.08 } }
      ]),
      'glass with shadow'
    ),
    /Unsupported effect style "glass with shadow": BACKGROUND_BLUR \+ DROP_SHADOW/
  );
});

test('unsupported effect types fail instead of emitting a token', () => {
  assert.throws(
    () => transformEffectStyle(effectNode([{ type: 'INNER_SHADOW', visible: true }]), 'inset'),
    /Unsupported effect style "inset": INNER_SHADOW/
  );
  assert.throws(
    () => transformEffectStyle(effectNode([{ type: 'LAYER_BLUR', radius: 4 }]), 'soften'),
    /Unsupported effect style "soften": LAYER_BLUR/
  );
});

test('progressive background blur fails instead of flattening to a uniform blur', () => {
  assert.throws(
    () => transformEffectStyle(
      effectNode([{ type: 'BACKGROUND_BLUR', radius: 38, blurType: 'PROGRESSIVE' }]),
      'progressive glass'
    ),
    /Unsupported effect style "progressive glass": BACKGROUND_BLUR\(PROGRESSIVE\)/
  );
});

test('drop shadow with a blend mode fails instead of dropping the blend', () => {
  assert.throws(
    () => transformEffectStyle(
      effectNode([{
        type: 'DROP_SHADOW',
        visible: true,
        blendMode: 'MULTIPLY',
        offset: { x: 0, y: 4 },
        radius: 30,
        color: { r: 0, g: 0, b: 0, a: 0.08 }
      }]),
      'tinted shadow'
    ),
    /Unsupported effect style "tinted shadow": DROP_SHADOW\(MULTIPLY\)/
  );
});

test('a style with no visible effects fails', () => {
  assert.throws(
    () => transformEffectStyle(effectNode([{ type: 'BACKGROUND_BLUR', visible: false, radius: 38 }]), 'hidden'),
    /Unsupported effect style "hidden": no visible effects/
  );
});

test('effect failures include the Figma file key and node id', () => {
  const styles = [{
    name: 'bad effect',
    style_type: 'EFFECT',
    node_id: '1:23',
    fileKey: 'FILEKEY123'
  }];
  const nodes = { '1:23': { document: { effects: [{ type: 'LAYER_BLUR', radius: 4 }] } } };
  assert.throws(
    () => transformStylesToDTCG(styles, nodes, ['FILEKEY123']),
    /Unsupported effect style "bad effect".*\(file FILEKEY123, node 1:23\)/
  );
});

test('text styles emit the Figma-resolved numeric font weight', () => {
  const node = {
    document: {
      style: {
        fontFamily: 'Seed Sans',
        fontSize: 16,
        fontWeight: 350,
        letterSpacing: 0,
        lineHeightUnit: 'FONT_SIZE_%',
        lineHeightPercentFontSize: 110
      }
    }
  };
  const token = transformTextStyle(node, 'body md reg');
  assert.equal(token.$value.fontWeight, 350);
  assert.equal(typeof token.$value.fontWeight, 'number');
});
