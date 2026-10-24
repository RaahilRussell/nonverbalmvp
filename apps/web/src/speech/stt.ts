import { isPlaybackGuarded } from './tts';
export type BrowserStt = { start: () => void; stop: () => void; supported: boolean };
export function createBrowserStt(onFinal: (text: string) => void): BrowserStt {
  const Recognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
  if (!Recognition) return { supported: false, start: () => undefined, stop: () => undefined };
  const recognition = new Recognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
  recognition.onresult = (event: any) => { if (isPlaybackGuarded()) return; for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) onFinal(event.results[i][0].transcript.trim()); };
  return { supported: true, start: () => recognition.start(), stop: () => recognition.stop() };
}
