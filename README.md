# Stance

Stance is a browser AAC prototype for Cal Hacks 13.0. Its P0 path lets a person select `NO`, `YES`, or `WAIT` immediately, then choose a visible reason or write their own reason. Only selected text can be spoken.

## Run

```sh
npm install
npm run dev
```

The browser app is at `http://127.0.0.1:5173`; the API is at `http://127.0.0.1:8787`. Empty `.env` is supported. Browser speech is the default. See [`ACTION_REQUIRED.md`](ACTION_REQUIRED.md) for keys and blocked adapters.

For live model-backed chips, set exactly one of `LLM_PROVIDER=anthropic`, `LLM_PROVIDER=groq`, or `LLM_PROVIDER=gemini` and provide that provider's server-only key in `.env`. Each adapter validates structured JSON and falls back to mock chips on timeout, provider error, or invalid output.

The same root `.env` contains `GEMINI_API_KEY` / `GEMINI_MODEL` and `GROQ_API_KEY` / `GROQ_MODEL` slots. The three providers share the same API response contract, so switching providers does not change the client.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

Read [`docs/STANCE_BRIEF.md`](docs/STANCE_BRIEF.md) before implementation work.
