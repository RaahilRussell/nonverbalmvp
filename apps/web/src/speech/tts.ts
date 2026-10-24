let audioContext: AudioContext | undefined;
let playbackGuardUntil = 0;
const cache = new Map<string, ArrayBuffer>();
export function isPlaybackGuarded() { return Date.now() < playbackGuardUntil; }
export function markPlaybackGuard(ms = 400) { playbackGuardUntil = Date.now() + ms; }
function browserSpeech(text: string, done: () => void) { markPlaybackGuard(); window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.onend = () => { markPlaybackGuard(); done(); }; u.onerror = done; window.speechSynthesis.speak(u); }
export async function playSpeech(text: string, provider: 'browser' | 'cartesia', done: () => void) {
  if (!text) return;
  if (provider === 'browser') return browserSpeech(text, done);
  try {
    const key = `${text}\u0000${provider}`; let bytes = cache.get(key);
    if (!bytes) { const response = await fetch('/api/tts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) }); if (!response.ok) throw new Error(`TTS ${response.status}`); bytes = await response.arrayBuffer(); cache.set(key, bytes); }
    audioContext ??= new AudioContext(); await audioContext.resume(); const buffer = await audioContext.decodeAudioData(bytes.slice(0)); const source = audioContext.createBufferSource(); source.buffer = buffer; source.connect(audioContext.destination); markPlaybackGuard(buffer.duration * 1000 + 400); source.onended = done; source.start();
  } catch { browserSpeech(text, done); }
}
export function stopSpeech() { window.speechSynthesis.cancel(); }
