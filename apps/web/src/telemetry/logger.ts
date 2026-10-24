import type { TelemetryTurn } from '@stance/core';
const KEY = 'stance.telemetry';
export function logTurn(turn: TelemetryTurn) { try { const rows = JSON.parse(localStorage.getItem(KEY) ?? '[]') as TelemetryTurn[]; localStorage.setItem(KEY, JSON.stringify([...rows, turn].slice(-500))); } catch { /* telemetry never blocks speech */ } }
export function readTurns(): TelemetryTurn[] { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; } }
export function exportCsv(rows: TelemetryTurn[]) { const headers = ['turnId','path','stance','firstResponseMs','fullThoughtMs','selections','repairs','at']; const csv = [headers.join(','), ...rows.map(r => headers.map(k => JSON.stringify((r as any)[k] ?? '')).join(','))].join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = 'stance-telemetry.csv'; a.click(); URL.revokeObjectURL(url); }
