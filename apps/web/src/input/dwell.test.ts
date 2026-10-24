import { describe, expect, it } from 'vitest';
import { enterDwell, leaveDwell, tickDwell } from './dwell';
describe('dwell engine', () => {
  it('does not fire before dwell and fires once after it', () => { let s = enterDwell({ fired: false }, 'a', 0); expect(tickDwell(s, 799, 800, 500).fire).toBe(false); const fired = tickDwell(s, 800, 800, 500); expect(fired.fire).toBe(true); expect(tickDwell(fired, 900, 800, 500).fire).toBe(false); });
  it('resets on leave and locks during lockout', () => { const s = enterDwell({ fired: false }, 'a', 0); const fired = tickDwell(s, 800, 800, 500); expect(enterDwell(fired, 'b', 900).targetId).toBe('a'); expect(leaveDwell(fired).targetId).toBeUndefined(); });
});
