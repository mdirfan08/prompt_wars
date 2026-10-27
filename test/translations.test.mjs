import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_LANGUAGES,
  getTranslation,
  baseEnglish
} from '../src/constants/translations.ts';

test('Priority 2: Exactly 31 languages are configured (22 Indian + 8 International + English)', () => {
  assert.equal(SUPPORTED_LANGUAGES.length, 31);

  const indian = SUPPORTED_LANGUAGES.filter(l => l.category === 'indian');
  assert.equal(indian.length, 22);

  const international = SUPPORTED_LANGUAGES.filter(l => l.category === 'international');
  assert.equal(international.length, 8);

  const defaultLang = SUPPORTED_LANGUAGES.filter(l => l.category === 'default');
  assert.equal(defaultLang.length, 1);
  assert.equal(defaultLang[0].code, 'en');
});

test('Priority 2: RTL languages (Urdu, Arabic) have isRtl set to true', () => {
  const urdu = SUPPORTED_LANGUAGES.find(l => l.code === 'ur');
  const arabic = SUPPORTED_LANGUAGES.find(l => l.code === 'ar');
  const english = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
  const tamil = SUPPORTED_LANGUAGES.find(l => l.code === 'ta');

  assert.equal(urdu.isRtl, true);
  assert.equal(arabic.isRtl, true);
  assert.equal(english.isRtl, undefined);
  assert.equal(tamil.isRtl, undefined);
});

test('Priority 2: getTranslation returns complete keys and guarantees English fallback', () => {
  // Test Tamil
  const tTamil = getTranslation('ta');
  assert.ok(tTamil.appTitle.includes('FairShift'));
  assert.ok(tTamil.clockInAction.length > 0);

  // Test Hindi
  const tHindi = getTranslation('hi');
  assert.ok(tHindi.appTitle.includes('FairShift'));
  assert.ok(tHindi.clockInAction.length > 0);

  // Test Arabic
  const tArabic = getTranslation('ar');
  assert.ok(tArabic.appTitle.includes('FairShift'));
  assert.ok(tArabic.clockInAction.length > 0);

  // Test English fallback for an arbitrary key
  const tFallback = getTranslation('brx'); // Bodo falls back safely to English where not customized
  assert.equal(typeof tFallback.appTitle, 'string');
  assert.ok(tFallback.appTitle.length > 0);
  assert.notEqual(tFallback.clockInAction, undefined);
  assert.notEqual(tFallback.clockInAction, '');
});

test('Priority 2: Every key in baseEnglish is non-empty string', () => {
  for (const [key, val] of Object.entries(baseEnglish)) {
    assert.equal(typeof val, 'string', `Key ${key} should be a string`);
    assert.ok(val.trim().length > 0, `Key ${key} should not be empty`);
  }
});
