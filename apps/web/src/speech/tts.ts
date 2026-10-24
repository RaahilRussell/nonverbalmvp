let audioContext: AudioContext | undefined;
let playbackGuardUntil = 0;
let playbackActive = false;
let playbackId = 0;
let activeSource: AudioBufferSourceNode | undefined;
let activeRequest: AbortController | undefined;
const cache = new Map<string, ArrayBuffer>();
export function isPlaybackGuarded() { return playbackActive || Date.now() < playbackGuardUntil; }
export function markPlaybackGuard(ms = 400) { playbackGuardUntil = Date.now() + ms; }
function browserSpeech(text: string, done: () => void, id: number) { playbackActive = true; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); const finish = () => { if (id !== playbackId) return; playbackActive = false; markPlaybackGuard(); done(); }; u.onend = finish; u.onerror = finish; window.speechSynthesis.speak(u); }
export async function playSpeech(text: string, provider: 'browser' | 'cartesia', done: () => void) {
  if (!text) return;
  const id = ++playbackId;
  if (provider === 'browser') return browserSpeech(text, done, id);
  try {
    const key = `${text}\u0000${provider}`; let bytes = cache.get(key); activeRequest = new AbortController();
    if (!bytes) { const response = await fetch('/api/tts', { method: 'POST', signal: activeRequest.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) }); if (!response.ok) throw new Error(`TTS ${response.status}`); bytes = await response.arrayBuffer(); cache.set(key, bytes); }
    if (id !== playbackId) return;
    audioContext ??= new AudioContext(); await audioContext.resume(); const buffer = await audioContext.decodeAudioData(bytes.slice(0));
    if (id !== playbackId) return;
    const source = audioContext.createBufferSource(); activeSource = source; playbackActive = true; source.buffer = buffer; source.connect(audioContext.destination); markPlaybackGuard(buffer.duration * 1000 + 400); source.onended = () => { if (id !== playbackId) return; activeSource = undefined; playbackActive = false; done(); }; source.start();
  } catch (error) { if (id !== playbackId || (error instanceof DOMException && error.name === 'AbortError')) return; playbackActive = false; browserSpeech(text, done, id); }
  finally { if (id === playbackId) activeRequest = undefined; }
}
export function stopSpeech() { playbackId += 1; activeRequest?.abort(); activeRequest = undefined; activeSource?.stop(); activeSource = undefined; playbackActive = false; window.speechSynthesis.cancel(); markPlaybackGuard(); }
