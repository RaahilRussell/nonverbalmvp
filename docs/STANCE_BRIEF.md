# Stance — Full Architecture and Build Brief

Cal Hacks 13.0 · Deadline Sunday Oct 25, 2026, 9:00 AM PT · 3-minute pitch + 2 minutes Q&A + live or recorded demo

> One-line pitch: **People who use AAC can say "No" instantly, then say their *own* reason in seconds, keeping control of every spoken word.**

This file is the single source of truth for humans and for Codex. `AGENTS.md` at the repo root points here.

---

## 0. Why this product (the evidence)

| Source | What it showed | What we take from it |
|---|---|---|
| Project DEAN (Univ. at Buffalo + UNC, 2023–26) | Web app: partner ASR (Deepgram) → Llama 70B on Groq (~1 s) → ElevenLabs. Field test with 2 AAC users. Todd: quick phrases 4 s, AI 8 s, spelling 43 s; DEAN 10.6 s vs home device 19.3 s. Linda (ALS, eye gaze): quick phrases 5.8 s, AI 9.3 s, spelling 378 s; ~4 s fixed eye-tracker delay. | Fast quick-phrases + AI works. **Failure:** AI offered "only consensus" when users needed to object. Linda took **2 min 45 s** to type "It's harder to keep it a surprise." DEAN's own next steps: user-controlled stance/goal settings, floor-holding, short prompts to steer AI. |
| Google SpeakFaster (+ Team Gleason) | Fine-tuned LaMDA abbreviation expansion; 29–60% faster for 2 eye-gaze ALS users. LLM latency ~0.8 s, but **selecting a phrase took 12.7–21.2 s**; single-word options were 2–3× faster to review. | The bottleneck is **reading/choosing**, not the model. Keep options short. Use initials expansion as the "say anything" path. |
| KWickChat (Cambridge) | Keywords + context + persona → 4 replies; ~71% keystroke savings (simulation only). | Keyword expansion is known; ours is constrained by an explicit stance. |
| Google Look to Speak | Phone camera, look left/right, 16 phrases halved per glance. | Coarse input works when choices are few and big. |
| Apple Eye Tracking (iOS/iPadOS 18), macOS Head Pointer, Personal Voice | Built-in camera-based control and 15-minute voice banking. | Input and voice are commodities. Our UI should work with any of them. |
| Hackathon precedents (Eye AAC Select, EyeTalk, Kural, GazeBoard…) | Webcam gaze + AI suggestions + cloned voice already built. | Do **not** pitch "AI AAC with webcam." Pitch: **say no, then say *your* reason.** |

**Honest claims only.** DEAN's 2:45 is motivation, never our baseline. Our evidence = our own within-subject A/B (same people, same unfamiliar prompts, baseline vs Stance). Teammate testing is prototype testing, not clinical validation.

---

## 1. Hard rules (non-negotiable)

1. **Nothing is spoken that the user did not select. A sentence the user has not seen is never spoken.**
2. The stance row (No / Yes / Wait) works with the network unplugged (local audio or browser speech).
3. A path to say *anything* always exists (`MY OWN REASON` → keyboard → `SAY EXACTLY`), with no AI involved.
4. No speech from transcript changes, API responses, speculation caches, DB subscriptions, hover without dwell, or tracking loss.
5. Never change a target's content while a dwell is in progress; stale `(turnId, revision)` results never replace displayed choices.
6. API keys live only on the server. Nothing secret in the browser bundle.
7. Every untested decision is a config flag (section 4). Every vendor call goes through one adapter marked `TODO_API_<NAME>`.
8. Never label a provider LIVE unless a real request succeeded. Show MOCK / LIVE / FAILING badges in the Lab screen.
9. Telemetry is fire-and-forget; it never delays speech.
10. No clinical or medical claims anywhere.

**Non-goals this weekend:** caregiver app, partner phones (beyond the read-only dashboard), ESP32, voice-clone UI as a dependency, diarization, multi-language, native iOS, accounts.

---

## 2. Architecture

```
            ┌──────────────── Browser (apps/web) ────────────────┐
 webcam ──▶ │ InputAdapter (head / mouse / switch / gaze*)        │
            │   └─ dwell + lockout ─▶ State machine               │
 mic ─────▶ │ TranscriptAdapter (manual / browser / cartesia)     │
            │   └─ turnDetector ─▶ PartnerTurn{id,rev,text}       │
            │ OptimizationStrategy (S0–S3) ─▶ /api/reasons, check │
            │ Utterance builder (deterministic templates)         │
            │ SpeechAdapter (local clip / browser / cartesia)     │
            │ Telemetry (local log + CSV, optional SpacetimeDB)   │
            └───────────────┬────────────────────┬───────────────┘
                            │ HTTP (no keys)      │ WS (metrics only)
                ┌───────────▼──────────┐   ┌─────▼──────────────┐
                │ apps/api (Fastify)   │   │ SpacetimeDB 2.x TS │
                │ LLM provider layer   │   │ session, turn_metric│
                │  mock/anthropic/...  │   │ → /dashboard        │
                │ Cartesia TTS/STT     │   └────────────────────┘
                └──────────────────────┘
```

**Speed path:** stance clip plays locally (no network). Chips are generated on partner turn end (S1) so they're ready when the stance dwell finishes. Chip speech = deterministic template around words the user sees.

**Trust path:** SpacetimeDB records *who committed what, when* (identity-checked reducers) and feeds the live timing dashboard. It is **not** in the speech path and cannot prevent local audio; never claim it does.

---

## 3. Stack and repo layout

npm workspaces · React + Vite + TS · Node 20+ Fastify · zod · Vitest (+ one Playwright smoke if time) · `@mediapipe/tasks-vision` · SpacetimeDB 2.x TypeScript module (package `spacetimedb`, server `spacetimedb/server`, client `spacetimedb/react` — verify against current quickstart; not the deprecated `@clockworklabs/spacetimedb-sdk`).

```
stance/
  AGENTS.md  ACTION_REQUIRED.md  IMPLEMENTATION_STATUS.md  DECISIONS.md  .env.example
  packages/core/src/      types.ts flags.ts templates.ts schemas.ts staticChips.ts
  apps/api/src/           index.ts routes/ providers/llm/{mock,anthropic,gemini,groq}.ts
                          providers/speech/cartesia.ts prompts/{reasons,expand,check}.ts
  apps/web/src/           state/machine.ts input/{mouse,head,switch,gaze,dwell,oneEuro,calibration}.ts
                          speech/{stt/*,tts/*,turnDetector.ts,audioCache.ts}
                          engine/{suggestions,strategy}.ts telemetry/{logger,spacetime}.ts
                          ui/screens/{Start,Calibration,Main,Reasons,Compose,Approve,Baseline,Lab,Dashboard}.tsx
  spacetimedb/src/index.ts
  bench/prompts.json  bench/bakeoff.ts
  docs/STANCE_BRIEF.md  docs/DEMO_SCRIPT.md  docs/MEASUREMENT_PLAN.md
```

Root scripts: `dev`, `test`, `typecheck`, `build`, `eval` (bake-off), `db:dev` (optional).

---

## 4. Config flags (test, don't guess)

Editable live on `/lab` (and `S` key), persisted in `localStorage` inside try/catch, and **recorded with every logged turn**.

| Flag | Options | Default | Why it's a flag |
|---|---|---|---|
| `INPUT_MODE` | `mouse` / `switch` / `head` / `gaze` | `mouse` (→ `head` after M2) | Webcam gaze unproven |
| `DWELL_MS` | 400–2000 | 800 | Speed vs accidental selection |
| `LOCKOUT_MS` | 300–900 | 500 | Double-selection guard |
| `CHIP_COUNT` | 2 / 3 / 4 | 4 | DEAN cut 8→2; scan cost vs coverage |
| `CHIP_OUTPUT_MODE` | `exact` / `template` / `approve` | `template` | Speed vs control |
| `STRATEGY` | `S0_off` / `S1_turn_end` / `S2_partials` / `S3_partials_audio` | `S1_turn_end` | Latency vs load |
| `LLM_PROVIDER` | `mock` / `anthropic` / `gemini` / `groq` | `mock` until key works | Bake-off decides |
| `STANCE_CHECK` | `off` / `llm` | `llm` | Filter, not a guarantee |
| `STT_PROVIDER` | `manual` / `browser` / `cartesia` | `manual` | Reliability vs hands-free |
| `TTS_PROVIDER` | `browser` / `cartesia` | `browser` | Voice quality vs dependency |
| `TURN_SILENCE_MS` | 400–1500 | 700 | When a partner turn ends |
| `TELEMETRY` | `local` / `spacetimedb` | `local` | Sponsor integration opt-in |
| `MODE` | `stance` / `baseline` | `stance` | A/B testing |

---

## 5. Interaction spec

**Main screen:** top = partner's last stabilized turn (big) + interim text (small). Bottom row on every screen = `NO` `YES` `WAIT` `SOMETHING ELSE`. Middle = state content, ≤ 6 targets. `STOP` and `BACK` always in the same place. After any speech, `THAT'S NOT IT` appears for 5 s (speaks "Sorry, wrong one.").

**State machine** (one reducer, no scattered booleans):

```
START → CALIBRATE → LISTENING
LISTENING --stance NO/YES--> STANCE_SPOKEN (local clip) → REASONS
LISTENING --WAIT--> STANCE_SPOKEN → LISTENING
LISTENING --SOMETHING ELSE--> COMPOSE
REASONS --chip--> (exact|template) SPOKEN  |  (approve) APPROVE
REASONS --MY OWN REASON--> COMPOSE
COMPOSE --SAY EXACTLY--> SPOKEN
COMPOSE --DONE (initials/keywords)--> APPROVE (≤3 expansions + USE EXACTLY WHAT I TYPED + NONE)
APPROVE --select--> SPOKEN
SPOKEN → LISTENING
ANY --STOP/BACK--> safe state (audio stopped)
```

**Chip output modes:**
- `exact`: speak the chip exactly ("It'd ruin the surprise.").
- `template`: `NO` + chip → "No, it'd ruin the surprise." (deterministic prefix; user saw every word in the preview under the chip).
- `approve`: show a full LLM sentence; one more selection confirms.

**Compose (letter-group keyboard, shared with Baseline):** 6 group targets `ABCDE` `FGHIJ` `KLMNO` `PQRST` `UVWXY` `Z.?␣⌫`; picking a group reveals its letters. Plus `DONE` (expand), `SAY EXACTLY` (verbatim), `BACK`.

---

## 6. Input

All modes implement `InputAdapter.onPointer({x, y, confidence})`.

- **Head (MediaPipe FaceLandmarker):** `runningMode: "VIDEO"`, `numFaces: 1`, `outputFacialTransformationMatrixes: true`. Yaw/pitch from the transform matrix (fallback: nose-tip landmark 1). One Euro filter (`minCutoff 1.0`, `beta 0.01`, tunable). Dead zone. 5-point calibration (center + 4 corners, 1.5 s each) → linear map, clamped. Face lost > 1 s → freeze cursor, banner, no selections. No frames leave the browser.
- **Switch:** Space = advance focus, Enter = select (configurable). Works with camera off.
- **Mouse:** development and baseline comparisons.
- **Gaze (experimental):** iris landmarks 468–477 → 3×2 zones only. Never claimed in the demo unless the 40-target test passes.
- **Dwell:** arm on enter, progress ring over `DWELL_MS`, reset on leave, fire once, then lock all targets `LOCKOUT_MS` and require the pointer to leave/re-enter.
- **Targets:** ≥ 22% screen width, ≥ 18% height, 2% gaps.

Compatible but not built: macOS Head Pointer, Apple Eye Tracking on iPad, Tobii — our big-target UI works with them; say so honestly.

---

## 7. Speech

**Session start:** a `START` click unlocks `AudioContext` + permissions. Pre-generate stance clips ("No.", "Yes.", "Wait, I want to say something.", "Sorry, wrong one.") for the active TTS provider.

**Transcript:** `manual` (partner types, Enter submits — P0 and demo fallback) · `browser` (`webkitSpeechRecognition`, continuous, interim) · `cartesia` (streaming STT via server-minted short-lived token; `TODO_API_CARTESIA_STT`). Turn ends after a final result + `TURN_SILENCE_MS`. Emit `PartnerTurn {id, revision, text, endedAt}`; keep last 6 turns. **Echo guard:** ignore STT during playback + 400 ms. `R` (experimenter) re-runs on the last turn.

**Voice:** `browser` (`speechSynthesis`, pre-warmed) · `cartesia` via `POST /api/tts` (`TODO_API_CARTESIA_TTS`: model id, `Cartesia-Version` header, output format — verify docs). Cache key = hash(text, provider, voice, model). With S3, pre-synthesize each chip's final spoken string when chips arrive; drop previous turn's chip audio on a new turn.

**Measure honestly:** dwell time ≠ audio-start latency ≠ total utterance time. Report all three separately.

---

## 8. Server API + LLM layer

```ts
interface LLMProvider {
  name: "mock" | "anthropic" | "gemini" | "groq";
  generateJSON<T>(a: { system: string; user: string; schema: ZodType<T>;
    maxTokens: number; timeoutMs: number; signal?: AbortSignal }): Promise<{ data: T; ms: number }>;
}
```

Hard timeout 2.5 s, one retry on parse failure, then fall back to static chips. Partner text is **untrusted quoted data**; cap 500 chars.

| Endpoint | Request | Response |
|---|---|---|
| `GET /api/status` | — | each provider `live`/`mock`/`failing` (redacted) |
| `POST /api/reasons` | `{turn:{id,revision,text}, history, stance, count}` | `{turnId, revision, stance, options:[{id,label,exactShortReason}], provider, ms}` |
| `POST /api/expand` | `{turn, history, stance, userText, source}` | `{candidates: string[]}` (≤3) |
| `POST /api/check` | `{turn, stance, texts}` | `{results:[{ok, why}]}` |
| `POST /api/tts` | `{text}` | audio bytes (`TODO_API_CARTESIA_TTS`) |
| `GET /api/stt-token` | — | `{token, expiresAt}` (`TODO_API_CARTESIA_STT`) |

**Strategies:** S0 request after stance · **S1** request NO + YES in parallel at turn end (default) · S2 debounce 400 ms on interim with `AbortController` · S3 = S2 + pre-synth audio. Never swap choices mid-dwell.

**Anthropic:** model `claude-haiku-5-5`. Verify the SDK's structured-output parameter and which sampling params Haiku 5.5 accepts before sending any (`TODO_API_ANTHROPIC`). Always validate with zod regardless.

---

## 9. Prompts

Full text lives in `apps/api/src/prompts/*.ts`. Summary:

- **reasons:** stance is already chosen; give `COUNT` *distinct* reasons (different grounds: cost, time, feelings, logistics, values, people), each `label` 1–4 words + `exactShortReason` 3–8 words first person, no leading "No/Yes", never agree/soften/hedge/question; never invent facts about the person. JSON only.
- **expand:** user typed initials or keywords for *their* reason; one letter = one word in order for initials; keep stance; ≤ 14 words; up to 3 readings; no new ideas, apologies or agreement. JSON only. UI always adds `USE EXACTLY WHAT I TYPED`.
- **check:** strict judge; `ok=false` if it agrees under NO, disagrees under YES, hedges, compromises, apologizes, or changes subject. A filter, never the safety gate.

---

## 10. SpacetimeDB (Best Use of Spacetime: $2,048 / $1,024 / $512 per organizer email)

TypeScript 2.x module in `spacetimedb/src/index.ts` (`TODO_SPACETIME`: confirm syntax/CLI from the current quickstart).

- Tables (private by default): `session {id, owner: Identity, mode, flags_json, started_at}`, `turn_metric {turn_id, session_id, mode, strategy, path, first_response_ms, full_thought_ms, selections, repairs, meaning_match}`, optional `speech_event {session_id, turn_id, kind, ts}` (**type + time only**).
- **No transcript text, spoken text, names, or audio in SpacetimeDB.** Full text stays in the local CSV.
- Reducers: `register_session`, `record_metric`, `record_speech_event`; all writes check `ctx.sender` owns the session; observers are read-only.
- `/dashboard` (second window/device) subscribes to `turn_metric` and charts timing live.
- Offline: queue locally, flush on reconnect; the AAC screen never depends on it.

---

## 11. Measurement (the slide judges can trust)

**Per turn:** `first_response_ms` (partner end → stance audio start), `full_thought_ms` (partner end → final reason audio start), `selections`, `repairs`, `path` (chip/expand/exact), `meaning_match` 1–5 (experimenter), all flags.

**Baseline mode:** same pointer + dwell + letter-group keyboard + 3 next-word predictions from a local word list (no LLM) + `SPEAK`. No stance shortcuts.

**Protocol:** participant writes their intended reason on paper *before* each trial; 6–12 unfamiliar prompts (≥ 6 disagreements); counterbalanced order; same person, same input mode, both conditions. Report median + p90 per mode with n. Fast-but-wrong = failure.

**Experimenter keys:** `N` next prompt · `T` mark turn end · `1–5` meaning match · `B` toggle mode · `E` export CSV · `C` recalibrate · `R` re-run last turn.

**Input reliability:** 40-target test (good light, dim light, head motion) before claiming hands-free.

**Model bake-off (`npm run eval`):** 12 scenarios × 10 runs per provider. Measure p50/p95 latency, JSON failure %, stance-violation % (one fixed judge model for all), intended-reason hit % (chips), expansion hit %. Winner = lowest violation rate → then intended-reason hits → then p95. p95 > 2.5 s under S1 = out.

---

## 12. Milestones (build in order; P0 slice must keep working with empty `.env`)

| # | Milestone | Done when |
|---|---|---|
| M0 | Setup, `.env.example`, `ACTION_REQUIRED.md`, `/api/status` | `npm run dev` starts both; all providers show MOCK |
| M1 | **P0 slice:** manual turn, stance row, mock chips, templates, browser TTS, Compose + `SAY EXACTLY`, STOP, local log | Mouse user completes "75 guests" and a novel reason; NO audio starts < 300 ms after dwell completes |
| M2 | Head pointer, calibration, dwell, switch | 40-target ≥ 95% for a teammate; tracking loss never selects |
| M3 | Anthropic reasons/expand/check | Under S1, chips ready before stance dwell completes on ≥ 8/10 turns |
| M4 | Approve screen + expansions | 6 unseen prompts: user states a reason absent from chips |
| **Gate** | Go/no-go | If most trials use `MY OWN REASON` or chips rarely match, fix prompts before M5–M7 |
| M5 | Baseline, metrics, experimenter keys, CSV, bake-off | Within-subject numbers exported |
| M6 | Cartesia TTS (+STT if working), cache, S3 | LIVE badge only after a real request; fallback works |
| M7 | SpacetimeDB + dashboard | Second window sees rows live; app fine with STDB off |
| M8 | Polish, demo script, video | Unrehearsed acceptance run passes twice in a row |

**Automated tests (only the real failure modes):** no speech from non-selection sources; NO templates always NO-prefixed; generated text never spoken without approval; stale results never replace choices; no change mid-dwell; no double playback; own-reason works offline; timeout/429/bad JSON/TTS fail/STDB offline all fall back; no key in bundle; live tests skip with `LIVE_INTEGRATION_NOT_CONFIGURED`.

**Unrehearsed acceptance run:** judge asks unfamiliar question → NO heard immediately → chip or own reason → any generated text reviewed → speech → STOP works mid-audio → second question where no chip fits still gets a specific reason spoken → `/lab` shows real metrics + badges.

---

## 13. Failure modes

| Failure | Behavior |
|---|---|
| Network down | Stance clips; static chips; Compose + SAY EXACTLY; browser voice |
| LLM > 2.5 s / bad JSON | Static chips; swap in LLM chips only if no dwell active and user hasn't started selecting |
| STT bad | Manual typed turn; `T` marks end; `R` re-runs |
| Self-hearing | Echo guard |
| Face lost / bad light | Freeze + banner; switch/mouse available; bring a desk lamp |
| Wrong thing spoken | `THAT'S NOT IT`; `STOP` |
| Cartesia fails | Browser voice; badge FAILING |
| STDB offline | Local queue; dashboard shows offline |

Static chips — NO: "I don't want to" · "Not right now" · "It's too much" · "I disagree". YES: "Sounds good" · "I'd like that" · "Let's do it" · "Good idea".

---

## 14. UI

Dark, calm, high contrast. NO coral/red, YES green, WAIT amber, SOMETHING ELSE gray — always with text labels. Labels ≥ 36 px, partner turn 28 px, chips 1–4 words with the exact spoken sentence previewed below. Cursor dot + dwell ring. Reduced motion. Engineering detail only on `/lab` and `/dashboard`.

---

## 15. API gaps (resolve tonight)

| Tag | Need | Blocks | Fallback |
|---|---|---|---|
| `TODO_API_ANTHROPIC` | `ANTHROPIC_API_KEY`; confirm `claude-haiku-5-5` + structured-output params | M3–M4 | mock chips |
| `TODO_API_GEMINI` / `TODO_API_GROQ` | keys + fast model ids | bake-off | skip |
| `TODO_API_CARTESIA_TTS` | key, TTS model id, `Cartesia-Version`, voice id | M6 | browser voice |
| `TODO_API_CARTESIA_STT` | streaming STT on your plan, WS URL, token minting | M6 | manual / browser STT |
| `TODO_SPACETIME` | CLI, `spacetime dev` or host, TS 2.x module syntax | M7 | local log + CSV |
| Booth questions | Anthropic prize criteria; Cartesia STT availability | — | — |

---

## 16. Prizes this maps to

First Overall · People-First Social Impact · Most Technically Advanced (S1–S3 speculation + stance guard) · Best Use of Spacetime (identity-checked metrics + live dashboard) · Anthropic (confirm criteria) · Cartesia (voice + STT) · Microsoft "Built for the Real World" · Meta "Bringing People Closer Together with AI" · MLH Commit Fellowship (opt in + form).

---

## 17. 3-minute pitch

- 0:00–0:25 — The barrier: in a published study, a woman with ALS took 2 min 45 s to explain why she disagreed. (Motivation, not our baseline.)
- 0:25–1:25 — Live, unscripted: judge proposes something; NO immediately; reason chip; natural voice.
- 1:25–1:55 — "The AI guessed wrong": MY OWN REASON → initials → approve → spoken.
- 1:55–2:25 — How: local instant stance, speculative chips, deterministic templates, user approval as the only gate.
- 2:25–3:00 — Our measured A/B (n, median, p90), limitations, next: test with AAC users and SLPs. Live dashboard in a second window.

---

## 18. Reference docs (verify before coding)

- SpacetimeDB TS quickstart: https://spacetimedb.com/docs/quickstarts/typescript/
- SpacetimeDB TS client/React: https://spacetimedb.com/docs/clients/typescript/
- SpacetimeDB access permissions: https://spacetimedb.com/docs/tables/access-permissions/
- Claude Haiku 5.5: https://platform.claude.com/docs/en/models/haiku-5-5/overview
- Anthropic structured outputs: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- Cartesia docs: https://docs.cartesia.ai/get-started/overview
- Cartesia STT WebSocket: https://docs.cartesia.ai/examples/stt-auto-finalize-websocket
- Cartesia TTS bytes: https://docs.cartesia.ai/api-reference/tts/bytes
- MediaPipe Face Landmarker (web): https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js
- Project DEAN: https://project-converseaac.com/deliverable-dean/
- SpeakFaster paper: https://arxiv.org/abs/2312.01532
