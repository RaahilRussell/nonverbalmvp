import { describe, expect, it } from 'vitest';
import { initialState, reducer } from './machine';
const turn = { id: 't1', revision: 1, text: 'Dinner?', endedAt: 1 };
describe('single reducer speech gate', () => {
  it('never speaks an unselected generated candidate', () => { const stance = reducer(reducer(initialState, { type: 'TURN', turn }), { type: 'STANCE', stance: 'NO' }); const s = reducer(stance, { type: 'SPEECH_DONE' }); const next = reducer(s, { type: 'EXPANSIONS', candidates: ['No, because'] }); expect(next.phase).toBe('APPROVE'); expect(next.speech).toBeUndefined(); });
  it('ignores stale chip results', () => { const s = reducer(reducer(initialState, { type: 'TURN', turn }), { type: 'STANCE', stance: 'NO' }); expect(reducer(s, { type: 'CHIPS', turnId: 'old', revision: 1, chips: [] }).chips).toEqual([]); });
  it('clears the stance dwell so prefetched chips can arrive', () => { let s = reducer(reducer(initialState, { type: 'TURN', turn }), { type: 'DWELL', targetId: 'stance:NO', startedAt: 10 }); s = reducer(s, { type: 'STANCE', stance: 'NO' }); expect(s.dwell).toBeUndefined(); expect(reducer(s, { type: 'SPEECH_DONE' }).phase).toBe('LISTENING'); });
  it('SAY EXACTLY uses only typed text', () => { let s = reducer(reducer(initialState, { type: 'TURN', turn }), { type: 'OWN_REASON' }); s = reducer(s, { type: 'KEY', key: 'X' }); s = reducer(s, { type: 'SAY_EXACTLY' }); expect(s.speech?.text).toBe('X'); });
  it('STOP clears active speech', () => { const s = reducer(reducer(initialState, { type: 'TURN', turn }), { type: 'STANCE', stance: 'NO' }); expect(reducer(s, { type: 'STOP' }).speech).toBeUndefined(); });
});
