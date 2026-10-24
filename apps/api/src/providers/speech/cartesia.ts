const cache = new Map<string, Buffer>();

export type CartesiaConfig = { apiKey?: string; voiceId?: string; modelId?: string; version?: string };

export async function cartesiaTts(text: string, config: CartesiaConfig): Promise<{ audio: Buffer; contentType: string; cached: boolean }> {
  const { apiKey, voiceId, modelId, version } = config;
  if (!apiKey || !voiceId || !modelId || !version) throw new Error('TODO_API_CARTESIA_TTS');
  const key = `${text}\u0000${voiceId}\u0000${modelId}\u0000${version}`;
  const existing = cache.get(key);
  if (existing) return { audio: existing, contentType: 'audio/wav', cached: true };
  const response = await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Cartesia-Version': version, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model_id: modelId, transcript: text, voice: voiceId, output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 }, language: 'en' })
  });
  if (!response.ok) throw new Error(`Cartesia HTTP ${response.status}`);
  const audio = Buffer.from(await response.arrayBuffer()); cache.set(key, audio);
  return { audio, contentType: response.headers.get('content-type') ?? 'audio/wav', cached: false };
}
