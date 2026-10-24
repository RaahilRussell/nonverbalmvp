export function nextScanIndex(current: number, count: number) { return count ? (current + 1) % count : 0; }
