import { z } from 'zod';

export type AnthropicResult<T> = { data: T; ms: number };
export type AnthropicConfig = { apiKey?: string; model?: string; timeoutMs?: number };

const textFromMessage = (value: any) => Array.isArray(value?.content) ? value.content.filter((block: any) => block?.type === 'text').map((block: any) => block.text).join('') : '';

export async function anthropicJSON<T>(config: AnthropicConfig, input: { system: string; user: string; schema: Record<string, unknown>; validator: z.ZodType<T>; maxTokens: number }): Promise<AnthropicResult<T>> {
  if (!config.apiKey) throw new Error('TODO_API_ANTHROPIC');
  const started = Date.now(); const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 2500);
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: controller.signal, headers: { 'x-api-key': config.apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: config.model ?? 'claude-haiku-5-5', max_tokens: input.maxTokens, system: input.system, messages: [{ role: 'user', content: input.user }], output_config: { format: { type: 'json_schema', schema: input.schema } } }) });
    if (!response.ok) throw new Error(`Anthropic HTTP ${response.status}`);
    const body = await response.json(); const parsed = JSON.parse(textFromMessage(body)); const data = input.validator.parse(parsed);
    return { data, ms: Date.now() - started };
  } finally { clearTimeout(timer); }
}
