// Optional SpacetimeDB 2.x module. It intentionally stores timings and labels only.
// Generate bindings with: spacetime generate --lang typescript --out-dir apps/web/src/module_bindings --module-path spacetimedb
import { schema, table, t } from 'spacetimedb/server';
const db = schema({
  session: table({ public: false }, { id: t.string(), owner: t.identity(), mode: t.string(), flagsJson: t.string(), startedAt: t.timestamp() }),
  turnMetric: table({ public: true }, { turnId: t.string(), sessionId: t.string(), mode: t.string(), strategy: t.string(), path: t.string(), firstResponseMs: t.u64(), fullThoughtMs: t.u64(), selections: t.u32(), repairs: t.u32(), meaningMatch: t.u8() }),
  speechEvent: table({ public: true }, { sessionId: t.string(), turnId: t.string(), kind: t.string(), ts: t.timestamp() })
});
export default db;
export const registerSession = db.reducer({ id: t.string(), mode: t.string(), flagsJson: t.string(), startedAt: t.timestamp() }, (ctx, value) => { ctx.db.session.insert({ ...value, owner: ctx.sender }); });
export const recordMetric = db.reducer({ turnId: t.string(), sessionId: t.string(), mode: t.string(), strategy: t.string(), path: t.string(), firstResponseMs: t.u64(), fullThoughtMs: t.u64(), selections: t.u32(), repairs: t.u32(), meaningMatch: t.u8() }, (ctx, value) => { const session = [...ctx.db.session.iter()].find(row => row.id === value.sessionId && row.owner.isEqual(ctx.sender)); if (session) ctx.db.turnMetric.insert(value); });
export const recordSpeechEvent = db.reducer({ sessionId: t.string(), turnId: t.string(), kind: t.string(), ts: t.timestamp() }, (ctx, value) => { const session = [...ctx.db.session.iter()].find(row => row.id === value.sessionId && row.owner.isEqual(ctx.sender)); if (session) ctx.db.speechEvent.insert(value); });
