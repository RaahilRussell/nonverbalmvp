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
| 40-target reliability screen | WORKING | Ordered 40-target UI and local accuracy/latency score; protocol still needs human runs |
| Anthropic provider | PARTIAL | Server-only Messages API structured JSON adapter with zod/2.5s fallback; live success requires key and `LLM_PROVIDER=anthropic` |
| Gemini provider | PARTIAL | Server-only `generateContent` structured JSON adapter with zod/2.5s fallback; select with `LLM_PROVIDER=gemini` |
| Groq provider | PARTIAL | Server-only OpenAI-compatible structured JSON adapter with zod/2.5s fallback; live route validated at about 1.1s |
| Approve screen / expansions | WORKING | Generated candidates and exact-typed approval |
| Cartesia TTS | PARTIAL | Server route and AudioContext client ready; live test requires keys |
| Browser SpeechRecognition | PARTIAL | Optional browser adapter with echo guard; browser support varies |
| Cartesia STT | BLOCKED | Account token-minting flow must be verified; browser STT is the current fallback |
| SpacetimeDB module | PARTIAL | 2.x metrics-only schema/reducers added; CLI publish and generated bindings require environment setup |
| Dashboard | NOT STARTED | UI shell remains after SpacetimeDB bindings |
