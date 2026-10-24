export const FLAG_OPTIONS = {
  INPUT_MODE: ['mouse', 'switch', 'head', 'gaze'], DWELL_MS: [400, 800, 1200, 1600, 2000],
  LOCKOUT_MS: [300, 500, 700, 900], CHIP_COUNT: [2, 3, 4],
  CHIP_OUTPUT_MODE: ['exact', 'template', 'approve'], STRATEGY: ['S0_off', 'S1_turn_end', 'S2_partials', 'S3_partials_audio'],
  LLM_PROVIDER: ['mock', 'anthropic', 'gemini', 'groq'], STANCE_CHECK: ['off', 'llm'],
  STT_PROVIDER: ['manual', 'browser', 'cartesia'], TTS_PROVIDER: ['browser', 'cartesia'],
  TURN_SILENCE_MS: [400, 700, 1000, 1300, 1500], TELEMETRY: ['local', 'spacetimedb'], MODE: ['stance', 'baseline']
} as const;
export type InputMode = 'mouse' | 'switch' | 'head' | 'gaze';
export type ChipOutputMode = 'exact' | 'template' | 'approve';
export type Strategy = 'S0_off' | 'S1_turn_end' | 'S2_partials' | 'S3_partials_audio';
export type AppMode = 'stance' | 'baseline';
export type Flags = {
  INPUT_MODE: InputMode; DWELL_MS: number; LOCKOUT_MS: number; CHIP_COUNT: 2 | 3 | 4;
  CHIP_OUTPUT_MODE: ChipOutputMode; STRATEGY: Strategy; LLM_PROVIDER: 'mock' | 'anthropic' | 'gemini' | 'groq';
  STANCE_CHECK: 'off' | 'llm'; STT_PROVIDER: 'manual' | 'browser' | 'cartesia'; TTS_PROVIDER: 'browser' | 'cartesia';
  TURN_SILENCE_MS: number; TELEMETRY: 'local' | 'spacetimedb'; MODE: AppMode;
};
export const DEFAULT_FLAGS: Flags = {
  INPUT_MODE: 'mouse', DWELL_MS: 800, LOCKOUT_MS: 500, CHIP_COUNT: 4, CHIP_OUTPUT_MODE: 'template',
  STRATEGY: 'S1_turn_end', LLM_PROVIDER: 'mock', STANCE_CHECK: 'llm', STT_PROVIDER: 'manual', TTS_PROVIDER: 'browser',
  TURN_SILENCE_MS: 700, TELEMETRY: 'local', MODE: 'stance'
};
export function loadFlags(): Flags { try { return { ...DEFAULT_FLAGS, ...JSON.parse(localStorage.getItem('stance.flags') ?? '{}') }; } catch { return DEFAULT_FLAGS; } }
export function saveFlags(flags: Flags): void { try { localStorage.setItem('stance.flags', JSON.stringify(flags)); } catch { /* private mode */ } }
