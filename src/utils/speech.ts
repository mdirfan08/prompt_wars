/**
 * FairShift Speech Recognition Engine (SpeakUp Shield)
 * 
 * Bulletproof Web Speech API wrapper with zero transcript duplication:
 * - Differentiates interim (provisional) from final (committed) transcripts.
 * - Replaces interim text dynamically without appending intermediate partials.
 * - Commits final transcript chunks exactly once by tracking result indices.
 * - Preserves natural repeated words (e.g., "no no", "very very important") without naive deduplication.
 * - Singleton session lifecycle: cleans up existing sessions, prevents concurrent listeners, and guarantees unmount abort.
 * - Multi-language locale mapping covering Indian and International languages.
 */

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface SpeechCallbacks {
  /**
   * Called whenever the combined text (base + committed final + current interim) updates.
   * @param combinedText The full text suitable for setting directly into form inputs.
   * @param interimSnippet The provisional uncommitted snippet currently being spoken.
   * @param isFinalUpdate True if the latest update was a committed final result.
   */
  onTranscriptChange: (combinedText: string, interimSnippet: string, isFinalUpdate: boolean) => void;
  onListeningChange: (isListening: boolean) => void;
  onError: (errorMessage: string, isPermissionDenied: boolean) => void;
}

/**
 * Locale mapping for Speech Recognition across supported languages.
 * Chrome and Edge provide broad speech support for major Indic and world languages.
 */
export const SPEECH_LOCALE_MAP: Record<string, { locale: string; name: string; verifiedSupport: boolean }> = {
  en: { locale: 'en-IN', name: 'English (India)', verifiedSupport: true },
  ta: { locale: 'ta-IN', name: 'தமிழ் (Tamil)', verifiedSupport: true },
  hi: { locale: 'hi-IN', name: 'हिन्दी (Hindi)', verifiedSupport: true },
  bn: { locale: 'bn-IN', name: 'বাংলা (Bengali)', verifiedSupport: true },
  te: { locale: 'te-IN', name: 'తెలుగు (Telugu)', verifiedSupport: true },
  mr: { locale: 'mr-IN', name: 'मराठी (Marathi)', verifiedSupport: true },
  gu: { locale: 'gu-IN', name: 'ગુજરાતી (Gujarati)', verifiedSupport: true },
  kn: { locale: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', verifiedSupport: true },
  ml: { locale: 'ml-IN', name: 'മലയാളം (Malayalam)', verifiedSupport: true },
  pa: { locale: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', verifiedSupport: true },
  ur: { locale: 'ur-IN', name: 'اردو (Urdu)', verifiedSupport: true },
  as: { locale: 'as-IN', name: 'অসমীয়া (Assamese)', verifiedSupport: false },
  or: { locale: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', verifiedSupport: false },
  ne: { locale: 'ne-NP', name: 'नेपाली (Nepali)', verifiedSupport: true },
  sa: { locale: 'sa-IN', name: 'संस्कृतम् (Sanskrit)', verifiedSupport: false },
  sd: { locale: 'sd-IN', name: 'سنڌي (Sindhi)', verifiedSupport: false },
  kok: { locale: 'kok-IN', name: 'कोंकणी (Konkani)', verifiedSupport: false },
  doi: { locale: 'doi-IN', name: 'डोगरी (Dogri)', verifiedSupport: false },
  mai: { locale: 'mai-IN', name: 'मैथिली (Maithili)', verifiedSupport: false },
  mni: { locale: 'mni-IN', name: 'মৈতৈলোন্ (Manipuri)', verifiedSupport: false },
  brx: { locale: 'brx-IN', name: 'बड़ो (Bodo)', verifiedSupport: false },
  sat: { locale: 'sat-IN', name: 'संताली (Santali)', verifiedSupport: false },
  ks: { locale: 'ks-IN', name: 'کٲشُر (Kashmiri)', verifiedSupport: false },
  // International Languages
  es: { locale: 'es-ES', name: 'Español (Spanish)', verifiedSupport: true },
  fr: { locale: 'fr-FR', name: 'Français (French)', verifiedSupport: true },
  de: { locale: 'de-DE', name: 'Deutsch (German)', verifiedSupport: true },
  ar: { locale: 'ar-SA', name: 'العربية (Arabic)', verifiedSupport: true },
  id: { locale: 'id-ID', name: 'Bahasa Indonesia', verifiedSupport: true },
  pt: { locale: 'pt-BR', name: 'Português (Portuguese)', verifiedSupport: true },
  zh: { locale: 'zh-CN', name: '简体中文 (Chinese Simplified)', verifiedSupport: true },
  ja: { locale: 'ja-JP', name: '日本語 (Japanese)', verifiedSupport: true },
};

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as IWindowWithSpeech;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function getSpeechLocale(langCode: string): string {
  return SPEECH_LOCALE_MAP[langCode]?.locale || 'en-IN';
}

export function isVoiceSupportedForLanguage(langCode: string): boolean {
  return !!SPEECH_LOCALE_MAP[langCode]?.verifiedSupport;
}

/**
 * Pure state reducer for speech session transcripts.
 * Exported for rigorous unit testing without requiring browser DOM.
 */
export interface TranscriptAccumulatorState {
  baseText: string;
  finalParts: string[];
  currentInterim: string;
}

export function assembleCombinedTranscript(state: TranscriptAccumulatorState): string {
  const parts: string[] = [];
  if (state.baseText.trim()) {
    parts.push(state.baseText.trim());
  }
  if (state.finalParts.length > 0) {
    const finalJoined = state.finalParts.join(' ').trim();
    if (finalJoined) {
      parts.push(finalJoined);
    }
  }
  if (state.currentInterim.trim()) {
    parts.push(state.currentInterim.trim());
  }
  return parts.join(' ');
}

export function processRecognitionEvent(
  state: TranscriptAccumulatorState,
  results: { isFinal: boolean; transcript: string }[],
  startIndex: number
): { nextState: TranscriptAccumulatorState; isFinalProduced: boolean; newInterim: string } {
  let isFinalProduced = false;
  const nextFinalParts = [...state.finalParts];
  let newInterim = '';

  for (let i = startIndex; i < results.length; i++) {
    const item = results[i];
    const text = (item.transcript || '').trim();
    if (!text) continue;

    if (item.isFinal) {
      nextFinalParts.push(text);
      isFinalProduced = true;
    } else {
      newInterim = text;
    }
  }

  const nextState: TranscriptAccumulatorState = {
    baseText: state.baseText,
    finalParts: nextFinalParts,
    currentInterim: newInterim
  };

  return { nextState, isFinalProduced, newInterim };
}

// Active singleton reference
let activeRecognitionInstance: any = null;

export class SpeechSessionController {
  private recognition: any = null;
  private state: TranscriptAccumulatorState;
  private callbacks: SpeechCallbacks;
  private isExplicitlyStopped: boolean = false;
  private lastProcessedFinalIndex: number = -1;

  constructor(initialBaseText: string, langCode: string, callbacks: SpeechCallbacks) {
    this.state = {
      baseText: initialBaseText || '',
      finalParts: [],
      currentInterim: ''
    };
    this.callbacks = callbacks;

    const win = typeof window !== 'undefined' ? (window as IWindowWithSpeech) : null;
    const SpeechClass = win ? (win.SpeechRecognition || win.webkitSpeechRecognition) : null;

    if (!SpeechClass) {
      this.callbacks.onError('Web Speech API is not supported in this browser.', false);
      return;
    }

    // Stop any existing session
    stopActiveSpeechSession();

    try {
      this.recognition = new SpeechClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = getSpeechLocale(langCode);

      this.recognition.onstart = () => {
        this.isExplicitlyStopped = false;
        this.callbacks.onListeningChange(true);
      };

      this.recognition.onresult = (event: any) => {
        const startIndex = event.resultIndex || 0;
        const resultsArray: { isFinal: boolean; transcript: string }[] = [];

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res && res[0]) {
            resultsArray.push({
              isFinal: !!res.isFinal,
              transcript: res[0].transcript
            });
          }
        }

        // Only process newly finalized or interim results past lastProcessedFinalIndex
        const nextFinalParts = [...this.state.finalParts];
        let interimText = '';
        let isFinalUpdate = false;

        for (let i = startIndex; i < resultsArray.length; i++) {
          const item = resultsArray[i];
          if (item.isFinal) {
            if (i > this.lastProcessedFinalIndex) {
              const text = item.transcript.trim();
              if (text) {
                nextFinalParts.push(text);
                isFinalUpdate = true;
              }
              this.lastProcessedFinalIndex = i;
            }
          } else {
            // Replace interim - DO NOT APPEND
            interimText = item.transcript.trim();
          }
        }

        this.state = {
          baseText: this.state.baseText,
          finalParts: nextFinalParts,
          currentInterim: interimText
        };

        const combined = assembleCombinedTranscript(this.state);
        this.callbacks.onTranscriptChange(combined, interimText, isFinalUpdate);
      };

      this.recognition.onerror = (event: any) => {
        const errType = event.error || 'speech_error';
        const isPermission = errType === 'not-allowed' || errType === 'service-not-allowed';
        const msg = isPermission
          ? 'Microphone permission was denied. Please allow microphone access in your browser.'
          : `Speech recognition error: ${errType}`;
        this.callbacks.onError(msg, isPermission);
        this.callbacks.onListeningChange(false);
      };

      this.recognition.onend = () => {
        this.callbacks.onListeningChange(false);
        activeRecognitionInstance = null;
      };

      activeRecognitionInstance = this;
    } catch (err: any) {
      this.callbacks.onError(err?.message || 'Failed to initialize speech recognition.', false);
    }
  }

  public start() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch (e: any) {
      // In case start is called while already active
      console.warn('Recognition start skipped:', e.message);
    }
  }

  public stop() {
    this.isExplicitlyStopped = true;
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // Ignore if already stopped
    }
  }

  public abort() {
    this.isExplicitlyStopped = true;
    if (!this.recognition) return;
    try {
      this.recognition.abort();
    } catch {
      // Ignore
    }
    activeRecognitionInstance = null;
  }
}

export function stopActiveSpeechSession() {
  if (activeRecognitionInstance) {
    activeRecognitionInstance.abort();
    activeRecognitionInstance = null;
  }
}
