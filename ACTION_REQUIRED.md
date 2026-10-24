# Action required

The app runs with an empty `.env` using browser speech, static chips, local telemetry, and manual partner turns.

To enable M6 Cartesia TTS, provide these server-only values in `.env` (never `VITE_`-prefixed):

- `CARTESIA_API_KEY`
- `CARTESIA_VOICE_ID`
- `CARTESIA_MODEL_ID` (the current docs default is `sonic-3.6`)
- `CARTESIA_VERSION` (use the version required by your Cartesia account/docs)

The currently verified defaults are voice `db6b0ed5-d5d3-463d-ae85-518a07d3c2b4`, model `sonic-3.6`, and Cartesia-Version `2026-08-14`. You can replace the voice ID with another Cartesia voice.

To enable the Anthropic adapter, also provide `ANTHROPIC_API_KEY` and set `LLM_PROVIDER=anthropic`. The adapter uses the current Messages API structured JSON format, validates the result with zod, and falls back to static chips on timeout, HTTP error, or invalid output.

Reserved server-only slots for future provider bake-off work:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GROQ_API_KEY`
- `GROQ_MODEL`

Gemini and Groq remain MOCK until their current structured-output/API contracts are verified and implemented.

Then run `npm run dev`, select Cartesia in the Lab panel, and test a selected utterance. The server route returns `501 TODO_API_CARTESIA_TTS` until all values exist; it never labels Cartesia LIVE without a successful request.

Still intentionally blocked: `TODO_API_ANTHROPIC`, `TODO_API_GEMINI`, `TODO_API_GROQ`, `TODO_API_CARTESIA_STT`, and `TODO_SPACETIME`.
