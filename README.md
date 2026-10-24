# Stance

Stance is a browser AAC prototype for Cal Hacks 13.0. Its P0 path lets a person select `NO`, `YES`, or `WAIT` immediately, then choose a visible reason or write their own reason. Only selected text can be spoken.

## Run

```sh
npm install
npm run dev
```

The browser app is at `http://127.0.0.1:5173`; the API is at `http://127.0.0.1:8787`. Empty `.env` is supported. Browser speech is the default. See [`ACTION_REQUIRED.md`](ACTION_REQUIRED.md) for keys and blocked adapters.

For Anthropic-backed chips, set `LLM_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` in the server `.env`. The adapter validates structured JSON and falls back to mock chips on any failure.

The same root `.env` contains reserved `GEMINI_API_KEY` / `GEMINI_MODEL` and `GROQ_API_KEY` / `GROQ_MODEL` slots for the provider bake-off; they are not live integrations yet.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

Read [`docs/STANCE_BRIEF.md`](docs/STANCE_BRIEF.md) before implementation work.
