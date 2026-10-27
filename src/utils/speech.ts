/**
 * Browser Speech Recognition Helper for SpeakUp Shield.
 * Provides resilient speech-to-text with clear capability detection.
 */

// Define interface for browser SpeechRecognition
interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as IWindowWithSpeech;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export interface SpeechRecognitionListener {
  onResult: (transcript: string) => void;
  onError: (errorMsg: string) => void;
  onEnd: () => void;
}

export function createSpeechRecognizer(
  language: 'en' | 'ta',
  callbacks: SpeechRecognitionListener
) {
  const win = window as IWindowWithSpeech;
  const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechClass) {
    callbacks.onError('Web Speech API is not supported in this browser.');
    return null;
  }

  try {
    const recognition = new SpeechClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        callbacks.onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      callbacks.onError(event.error || 'Speech recognition encountered an error.');
    };

    recognition.onend = () => {
      callbacks.onEnd();
    };

    return recognition;
  } catch (err: any) {
    callbacks.onError(err?.message || 'Unable to initialize microphone input.');
    return null;
  }
}
