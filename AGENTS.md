# Stance agent guide

Read [`docs/STANCE_BRIEF.md`](docs/STANCE_BRIEF.md) completely before changing the product. It is the source of truth.

Hard constraints: only selected text may be spoken; approval is required for generated expansions; stance and own-reason paths work offline; stale turn/revision results never replace choices; provider keys stay server-side; vendor adapters remain explicitly TODO until a real request succeeds; no clinical claims.

Before handoff, run:

```sh
npm test
npm run typecheck
npm run build
```

Do not start Cartesia or SpacetimeDB work beyond the current requested milestone without the user's go/no-go confirmation. Report what was actually run, what remains blocked, and any performance claims that are still hypotheses.
