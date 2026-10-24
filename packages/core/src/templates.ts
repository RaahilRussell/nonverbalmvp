import type { Stance } from './types';
export function templateSpeech(stance: Stance, reason: string): string { if (stance === 'NO') return `No, ${reason.toLowerCase().replace(/[.!?]+$/, '')}.`; if (stance === 'YES') return `Yes, ${reason.toLowerCase().replace(/[.!?]+$/, '')}.`; return reason; }
export function stanceSpeech(stance: Stance): string { return stance === 'NO' ? 'No.' : stance === 'YES' ? 'Yes.' : stance === 'WAIT' ? 'Wait, I want to say something.' : ''; }
