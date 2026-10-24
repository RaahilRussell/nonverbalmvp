import { describe, expect, it } from 'vitest';
import { headPointFromTransform } from './head';
describe('head pointer primitives', () => { it('uses transformation matrix and nose fallback', () => { expect(headPointFromTransform(new Array(16).fill(0))?.confidence).toBe(1); expect(headPointFromTransform(undefined, { x: .4, y: .6 })?.confidence).toBe(.7); }); });
