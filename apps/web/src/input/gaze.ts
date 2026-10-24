import type { HeadPoint } from './head';

export function irisGazePoint(landmarks?: Array<{ x: number; y: number; z?: number }>): HeadPoint | undefined {
  if (!landmarks || landmarks.length < 478) return undefined;
  const left = [landmarks[468], landmarks[469], landmarks[470], landmarks[471]].filter(Boolean);
  const right = [landmarks[473], landmarks[474], landmarks[475], landmarks[476]].filter(Boolean);
  if (!left.length || !right.length) return undefined;
  const x = [...left, ...right].reduce((sum, point) => sum + point.x, 0) / (left.length + right.length);
  const y = [...left, ...right].reduce((sum, point) => sum + point.y, 0) / (left.length + right.length);
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), confidence: .8 };
}

export function gazeZone(point: HeadPoint): 'left' | 'center' | 'right' | 'top' | 'bottom' {
  if (point.x < .33) return 'left'; if (point.x > .66) return 'right'; if (point.y < .38) return 'top'; if (point.y > .62) return 'bottom'; return 'center';
}
