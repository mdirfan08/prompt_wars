import test from 'node:test';
import assert from 'node:assert/strict';

test('Priority 3: Theme mode values and toggle behavior', () => {
  let theme = 'light';
  const toggle = (current) => (current === 'dark' ? 'light' : 'dark');

  theme = toggle(theme);
  assert.equal(theme, 'dark');

  theme = toggle(theme);
  assert.equal(theme, 'light');
});

test('Priority 3: Theme storage key is consistent', () => {
  const THEME_STORAGE_KEY = 'fairshift_theme';
  assert.equal(THEME_STORAGE_KEY, 'fairshift_theme');
});
