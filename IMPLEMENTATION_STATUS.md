# Implementation status

| Feature | Status | Notes |
|---|---|---|
| npm workspaces / React / Vite / Fastify / zod / Vitest | WORKING | M0 scaffold |
| Manual partner turn | WORKING | Manual input + turn identity/revision |
| Offline stance row | WORKING | Browser speech, no network required |
| Mock reasons / static fallback | WORKING | `/api/reasons`, stale response guard |
| Deterministic template speech | WORKING | Only selected chips can speak |
| Own reason letter groups | WORKING | `SAY EXACTLY` and expansion approval |
| STOP / BACK / THAT'S NOT IT | WORKING | Speech cancellation and repair path |
| Lab flags / local telemetry / CSV | WORKING | Flags persisted defensively |
| Baseline mode | PARTIAL | Mode and shared keyboard present; full trial protocol remains |
| Dwell engine | WORKING | Pointer-agnostic engine; UI adapter remains mouse-first |
| MediaPipe head pointer | PARTIAL | Transform/nose mapping, One Euro, calibration primitives; camera lifecycle screen remains |
| Switch scanning | WORKING | Space advance / Enter select primitive |
| 40-target reliability screen | NOT STARTED | Needs dedicated test screen |
| Anthropic provider | BLOCKED | `TODO_API_ANTHROPIC`; no key/docs verification |
| Approve screen / expansions | WORKING | Generated candidates and exact-typed approval |
| Cartesia TTS | PARTIAL | Server route and AudioContext client ready; live test requires keys |
| Browser SpeechRecognition | PARTIAL | Optional browser adapter with echo guard; browser support varies |
| Cartesia STT / SpacetimeDB / dashboard | NOT STARTED | Deferred per brief |
