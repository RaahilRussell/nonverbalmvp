export type HeadPoint = { x: number; y: number; confidence: number };
export function headPointFromTransform(matrix?: number[], nose?: { x: number; y: number }): HeadPoint | undefined { if (matrix && matrix.length >= 16) return { x: Math.max(0, Math.min(1, .5 + matrix[8] * .8)), y: Math.max(0, Math.min(1, .5 - matrix[9] * .8)), confidence: 1 }; return nose ? { x: nose.x, y: nose.y, confidence: .7 } : undefined; }
export const HEAD_LANDMARK_FALLBACK = 1;
