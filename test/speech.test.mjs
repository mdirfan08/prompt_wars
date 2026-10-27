import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assembleCombinedTranscript,
  processRecognitionEvent,
  SPEECH_LOCALE_MAP,
  isVoiceSupportedForLanguage
} from '../src/utils/speech.ts';

test('Priority 1: Single spoken word "leave" does NOT duplicate', () => {
  let state = {
    baseText: '',
    finalParts: [],
    currentInterim: ''
  };

  // Step 1: Interim partial "lea"
  const step1 = processRecognitionEvent(
    state,
    [{ isFinal: false, transcript: 'lea' }],
    0
  );
  state = step1.nextState;
  assert.equal(assembleCombinedTranscript(state), 'lea');

  // Step 2: Interim partial "leave" (replaces "lea", doesn't append)
  const step2 = processRecognitionEvent(
    state,
    [{ isFinal: false, transcript: 'leave' }],
    0
  );
  state = step2.nextState;
  assert.equal(assembleCombinedTranscript(state), 'leave');

  // Step 3: Final committed result "leave"
  const step3 = processRecognitionEvent(
    state,
    [{ isFinal: true, transcript: 'leave' }],
    0
  );
  state = step3.nextState;
  // After finalization, interim is cleared, and finalParts has single 'leave'
  assert.equal(state.finalParts.length, 1);
  assert.equal(state.finalParts[0], 'leave');
  assert.equal(state.currentInterim, '');
  assert.equal(assembleCombinedTranscript(state), 'leave'); // NOT "leave leave"!
});

test('Priority 1: Complete sentence interim-to-final processing', () => {
  let state = {
    baseText: '',
    finalParts: [],
    currentInterim: ''
  };

  // Utterance 1: "hazard near scaffold"
  const u1_interim = processRecognitionEvent(
    state,
    [{ isFinal: false, transcript: 'hazard near' }],
    0
  );
  assert.equal(assembleCombinedTranscript(u1_interim.nextState), 'hazard near');

  const u1_final = processRecognitionEvent(
    state,
    [{ isFinal: true, transcript: 'hazard near scaffold' }],
    0
  );
  state = u1_final.nextState;
  assert.equal(assembleCombinedTranscript(state), 'hazard near scaffold');

  // Utterance 2: Web Speech results list now has 2 items: [final #0, final #1], startIndex = 1
  const u2_final = processRecognitionEvent(
    state,
    [
      { isFinal: true, transcript: 'hazard near scaffold' },
      { isFinal: true, transcript: 'immediate inspection required' }
    ],
    1
  );
  state = u2_final.nextState;
  assert.equal(
    assembleCombinedTranscript(state),
    'hazard near scaffold immediate inspection required'
  );
});

test('Priority 1: Legitimate repeated words are preserved ("no no", "very very important")', () => {
  let state = {
    baseText: '',
    finalParts: [],
    currentInterim: ''
  };

  // First sentence has legitimate repetition "no no"
  const res1 = processRecognitionEvent(
    state,
    [{ isFinal: true, transcript: 'no no' }],
    0
  );
  state = res1.nextState;
  assert.equal(assembleCombinedTranscript(state), 'no no');

  // Second sentence has legitimate repetition "very very important"
  const res2 = processRecognitionEvent(
    state,
    [
      { isFinal: true, transcript: 'no no' },
      { isFinal: true, transcript: 'this is very very important' }
    ],
    1
  );
  state = res2.nextState;
  assert.equal(assembleCombinedTranscript(state), 'no no this is very very important');
});

test('Priority 1: Respects initial base text typed manually', () => {
  let state = {
    baseText: 'Safety observation:',
    finalParts: [],
    currentInterim: ''
  };

  const res = processRecognitionEvent(
    state,
    [{ isFinal: true, transcript: 'cable insulation damaged' }],
    0
  );
  state = res.nextState;
  assert.equal(
    assembleCombinedTranscript(state),
    'Safety observation: cable insulation damaged'
  );
});

test('Priority 1 & 2: Speech locale mapping check', () => {
  assert.equal(SPEECH_LOCALE_MAP['ta'].locale, 'ta-IN');
  assert.equal(SPEECH_LOCALE_MAP['hi'].locale, 'hi-IN');
  assert.equal(SPEECH_LOCALE_MAP['ar'].locale, 'ar-SA');
  assert.equal(SPEECH_LOCALE_MAP['es'].locale, 'es-ES');
  assert.equal(isVoiceSupportedForLanguage('ta'), true);
  assert.equal(isVoiceSupportedForLanguage('hi'), true);

  // Verify removed languages are absent from speech locale map
  const removedCodes = ['kn', 'ml', 'pa', 'or', 'as'];
  for (const code of removedCodes) {
    assert.equal(SPEECH_LOCALE_MAP[code], undefined, `Speech locale for ${code} should be removed`);
  }
});
