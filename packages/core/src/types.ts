import type { Flags } from './flags';
export type Stance = 'NO' | 'YES' | 'WAIT' | 'SOMETHING ELSE';
export type Phase = 'START' | 'LISTENING' | 'STANCE_SPOKEN' | 'REASONS' | 'COMPOSE' | 'APPROVE' | 'SPOKEN' | 'BASELINE' | 'LAB';
export type PartnerTurn = { id: string; revision: number; text: string; endedAt: number };
export type ReasonChip = { id: string; label: string; exactShortReason: string; preview: string };
export type TelemetryTurn = { turnId: string; path: string; stance?: Stance; firstResponseMs?: number; fullThoughtMs?: number; selections: number; repairs: number; flags: Flags; at: number };
export type AppState = { phase: Phase; flags: Flags; turn?: PartnerTurn; chips: ReasonChip[]; stance?: Stance; typed: string; expanded: string[]; approvedText?: string; selectedText?: string; speech?: { text: string; startedAt: number }; speechUndoUntil?: number; trackingLost?: boolean; dwell?: { targetId: string; startedAt: number }; lockedUntil?: number; telemetry: TelemetryTurn[]; error?: string };
