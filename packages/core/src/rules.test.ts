import { describe, expect, it } from 'vitest';
import { staticChips, stanceSpeech, templateSpeech } from './index';
import { DEFAULT_FLAGS } from './flags';

describe('stance hard rules', () => {
  it('has an offline stance path', () => { expect(stanceSpeech('NO')).toBe('No.'); expect(stanceSpeech('YES')).toBe('Yes.'); expect(stanceSpeech('WAIT')).toContain('Wait'); });
  it('keeps NO templates NO-prefixed', () => { for (const chip of staticChips('NO')) expect(templateSpeech('NO', chip.exactShortReason)).toMatch(/^No,/); });
  it('always exposes a path for own reasons', () => { expect(staticChips('SOMETHING ELSE')).toEqual([]); expect(DEFAULT_FLAGS.INPUT_MODE).toBe('mouse'); });
  it('limits static choices to requested count', () => { expect(staticChips('YES', 2)).toHaveLength(2); });
});
