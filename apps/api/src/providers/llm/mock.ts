import { staticChips } from '@stance/core';
import type { Stance } from '@stance/core';
export function mockReasons(stance: Stance, count: number) { return staticChips(stance, count).map(({ id, label, exactShortReason }) => ({ id, label, exactShortReason })); }
export function mockExpand(userText: string) { return userText.trim() ? [`I mean ${userText.trim()}.`] : []; }
