import { describe, expect, it } from 'vitest';
import { reliabilitySummary, reliabilityTargets } from './reliability';
describe('40-target reliability', () => { it('creates forty targets and scores hits', () => { const trials = reliabilityTargets(); expect(trials).toHaveLength(40); trials[0].hit = true; trials[0].latencyMs = 200; expect(reliabilitySummary(trials).hits).toBe(1); }); });
