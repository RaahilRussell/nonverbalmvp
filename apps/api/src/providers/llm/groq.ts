import { z } from 'zod';

export type GroqResult<T> = { data: T; ms: number };
export type GroqConfig = { apiKey?: string; model?: string; timeoutMs?: number };

export async function groqJSON<T>(config: GroqConfig, input: { system: string; user: string; schema: Record<string, unknown>; validator: z.ZodType<T>; maxTokens: number }): Promise<GroqResult<T>> {
  if (!config.apiKey) throw new Error('TODO_API_GROQ');
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 2500);
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: config.model || 'openai/gpt-oss-20b',
        messages: [{ role: 'system', content: input.system }, { role: 'user', content: input.user }],
        temperature: 0, max_tokens: input.maxTokens,
        response_format: { type: 'json_schema', json_schema: { name: 'stance_output', strict: true, schema: input.schema } },
      }),
    });
    if (!response.ok) throw new Error(`Groq HTTP ${response.status}`);
    const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new Error('Groq returned no message content');
    return { data: input.validator.parse(JSON.parse(content)), ms: Date.now() - started };
  } finally { clearTimeout(timer); }
}
