import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const mobile = JSON.parse(readFileSync('site/assets/lottie/hero-sp.json', 'utf8'));

test('mobile final brush layers stay static through frames 246-265', () => {
  const expectations = new Map([
    ['final-brush-text-artwork', [208.452, 444.781, 0]],
    ['final-brush-text-composite', [193, 432, 0]],
  ]);

  for (const [name, expected] of expectations) {
    const layer = mobile.layers.find((candidate) => candidate.nm === name);
    assert.ok(layer, `${name} must exist`);
    assert.equal(layer.ks.p.a, 0, `${name} position must not be animated`);
    assert.deepEqual(layer.ks.p.k, expected);
  }
});
