const { test } = require('node:test');
const assert = require('node:assert/strict');
const { describeRequestError } = require('./utils');

test('request errors never expose the Figma token', () => {
  const error = {
    message: 'Request failed with status code 403',
    config: { headers: { 'X-Figma-Token': 'figd_SECRET_VALUE' } },
    response: {
      status: 403,
      data: { status: 403, err: 'Invalid token' },
      config: { headers: { 'X-Figma-Token': 'figd_SECRET_VALUE' } }
    }
  };
  const message = describeRequestError(error);
  assert.match(message, /403/);
  assert.match(message, /Invalid token/);
  assert.ok(!message.includes('figd_SECRET_VALUE'));
});

test('string response bodies are passed through as-is', () => {
  const error = {
    message: 'Request failed with status code 429',
    response: { status: 429, data: 'Rate limit exceeded' }
  };
  assert.equal(describeRequestError(error), 'HTTP 429 — Rate limit exceeded');
});

test('errors without a response fall back to the message', () => {
  const error = { message: 'getaddrinfo ENOTFOUND api.figma.com' };
  assert.equal(describeRequestError(error), 'getaddrinfo ENOTFOUND api.figma.com');
});
