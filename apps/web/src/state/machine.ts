import { DEFAULT_FLAGS, staticChips, stanceSpeech, templateSpeech } from '@stance/core';
import type { AppState, Phase, ReasonChip, Stance, PartnerTurn } from '@stance/core';
export type Action =
  | { type: 'START' } | { type: 'TURN'; turn: PartnerTurn } | { type: 'STANCE'; stance: Stance }
  | { type: 'CHIPS'; turnId: string; revision: number; chips: ReasonChip[] }
  | { type: 'CHIP'; chip: ReasonChip } | { type: 'OWN_REASON' } | { type: 'KEY'; key: string }
  | { type: 'SAY_EXACTLY' } | { type: 'EXPANSIONS'; candidates: string[] } | { type: 'APPROVE'; text: string }
  | { type: 'SPEECH_DONE' } | { type: 'STOP' } | { type: 'BACK' } | { type: 'WRONG' }
  | { type: 'FLAGS'; flags: AppState['flags'] } | { type: 'TRACKING_LOST'; lost: boolean } | { type: 'BASELINE' };
export const initialState: AppState = { phase: 'START', flags: DEFAULT_FLAGS, chips: [], typed: '', expanded: [], telemetry: [] };
function withSpeech(state: AppState, text: string): AppState { if (!text) return state; return { ...state, phase: 'SPOKEN', speech: { text, startedAt: Date.now() }, speechUndoUntil: Date.now() + 5000 }; }
export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START': return { ...state, phase: state.flags.MODE === 'baseline' ? 'BASELINE' : 'LISTENING', error: undefined };
    case 'TURN': return { ...state, turn: action.turn, phase: 'LISTENING', chips: [], stance: undefined, error: undefined };
    case 'STANCE': if (state.trackingLost) return state; if (action.stance === 'SOMETHING ELSE') return { ...state, stance: action.stance, phase: 'COMPOSE', typed: '', expanded: [] }; if (action.stance === 'WAIT') return withSpeech({ ...state, stance: action.stance }, stanceSpeech(action.stance)); return withSpeech({ ...state, stance: action.stance }, stanceSpeech(action.stance));
    case 'CHIPS': if (!state.turn || state.turn.id !== action.turnId || state.turn.revision !== action.revision || state.dwell) return state; return { ...state, chips: action.chips, phase: 'REASONS' };
    case 'CHIP': { const text = state.flags.CHIP_OUTPUT_MODE === 'exact' ? action.chip.exactShortReason : templateSpeech(state.stance ?? 'NO', action.chip.exactShortReason); return state.flags.CHIP_OUTPUT_MODE === 'approve' ? { ...state, selectedText: text, phase: 'APPROVE' } : withSpeech({ ...state, selectedText: text }, text); }
    case 'OWN_REASON': return { ...state, phase: 'COMPOSE', typed: '', expanded: [] };
    case 'KEY': return { ...state, typed: action.key === '⌫' ? state.typed.slice(0, -1) : state.typed + (action.key === '␣' ? ' ' : action.key) };
    case 'SAY_EXACTLY': return withSpeech({ ...state, selectedText: state.typed }, state.typed);
    case 'EXPANSIONS': return { ...state, expanded: action.candidates, phase: 'APPROVE' };
    case 'APPROVE': return withSpeech({ ...state, approvedText: action.text, selectedText: action.text }, action.text);
    case 'SPEECH_DONE': return { ...state, phase: 'LISTENING', speech: undefined, speechUndoUntil: undefined };
    case 'STOP': return { ...state, phase: 'LISTENING', speech: undefined, speechUndoUntil: undefined };
    case 'BACK': return { ...state, phase: state.turn ? 'LISTENING' : 'START', speech: undefined, typed: '', expanded: [] };
    case 'WRONG': return withSpeech({ ...state, speechUndoUntil: undefined }, "Sorry, wrong one.");
    case 'FLAGS': return { ...state, flags: action.flags, phase: action.flags.MODE === 'baseline' ? 'BASELINE' : state.phase === 'BASELINE' ? 'LISTENING' : state.phase };
    case 'TRACKING_LOST': return { ...state, trackingLost: action.lost };
    case 'BASELINE': return { ...state, phase: 'BASELINE', flags: { ...state.flags, MODE: 'baseline' } };
    default: return state;
  }
}
