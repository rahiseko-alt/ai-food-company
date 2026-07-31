import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isSuccessfulFormSubmit,
  isValidContact,
} from '../../site/assets/js/contact-controller.mjs';

test('contact accepts email or a 10-11 digit separated phone number', () => {
  for (const value of [
    'owner@example.com',
    '080-1234-5678',
    '03 (1234) 5678',
    '090 1234 5678',
  ]) {
    assert.equal(isValidContact(value), true, value);
  }

  for (const value of [
    'owner@example',
    '090-123-456',
    '090-1234-56789',
    '連絡先なし',
  ]) {
    assert.equal(isValidContact(value), false, value);
  }
});

test('only an explicit FormSubmit success payload is accepted', () => {
  assert.equal(isSuccessfulFormSubmit({ success: true }), true);
  assert.equal(isSuccessfulFormSubmit({ success: 'true' }), true);
  assert.equal(isSuccessfulFormSubmit({ success: false }), false);
  assert.equal(isSuccessfulFormSubmit({ message: 'ok' }), false);
  assert.equal(isSuccessfulFormSubmit(null), false);
});
