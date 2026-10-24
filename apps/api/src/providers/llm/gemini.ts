import { z } from 'zod';

export type GeminiResult<T> = { data: T; ms: number };
export type GeminiConfig = { apiKey?: string; model?: string; timeoutMs?: number };

// Gemini's responseSchema is not full JSON Schema on every REST version. Keep
// the provider contract strict with zod, while removing the keyword rejected
// by the GenerateContent wire schema.
const geminiSchema = (value: Record<string, unknown>): Record<string, unknown> => {
  const result = { ...value };
  delete result.additionalProperties;
  if (result.properties && typeof result.properties === 'object') {
    result.properties = Object.fromEntries(Object.entries(result.properties as Record<string, unknown>).map(([key, child]) => [key, child && typeof child === 'object' ? geminiSchema(child as Record<string, unknown>) : child]));
  }
  if (result.items && typeof result.items === 'object') result.items = geminiSchema(result.items as Record<string, unknown>);
  return result;
};

export async function geminiJSON<T>(config: GeminiConfig, input: { system: string; user: string; schema: Record<string, unknown>; validator: z.ZodType<T>; maxTokens: number }): Promise<GeminiResult<T>> {
  if (!config.apiKey) throw new Error('TODO_API_GEMINI');
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 2500);
  const model = (config.model || 'gemini-3.5-flash-lite').replace(/^models\//, '');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', signal: controller.signal,
      headers: { 'x-goog-api-key': config.apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: input.system }] },
        contents: [{ role: 'user', parts: [{ text: input.user }] }],
        generationConfig: { responseMimeType: 'application/json', responseSchema: geminiSchema(input.schema), maxOutputTokens: input.maxTokens, temperature: 0 },
      }),
    });
    if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
    const body = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const content = body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('');
    if (!content) throw new Error('Gemini returned no message content');
    return { data: input.validator.parse(JSON.parse(content)), ms: Date.now() - started };
  } finally { clearTimeout(timer); }
}
