import type { AppMode } from '@stance/core';
export type ExperimentMark = { kind: 'next' | 'turnEnd' | 'meaning' | 'mode' | 'export' | 'calibrate' | 'rerun'; value?: string | number; mode: AppMode; at: number };
export function experimentKey(key: string, mode: AppMode): ExperimentMark['kind'] | undefined { return ({ n: 'next', t: 'turnEnd', b: 'mode', e: 'export', c: 'calibrate', r: 'rerun' } as Record<string, ExperimentMark['kind']>)[key.toLowerCase()] ?? (/^[1-5]$/.test(key) ? 'meaning' : undefined); }
