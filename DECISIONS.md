# Decisions and measurements

Every brief §4 flag remains editable in Lab and is included in local turn telemetry. The measurement that decides each flag is:

| Flag | Current default | Measurement |
|---|---|---|
| `INPUT_MODE` | `mouse` | 40-target reliability by lighting/motion |
| `DWELL_MS` | `800` | selection error rate vs dwell-to-speech latency |
| `LOCKOUT_MS` | `500` | double-selection rate |
| `CHIP_COUNT` | `4` | reading time, intended-reason hits, repair rate |
| `CHIP_OUTPUT_MODE` | `template` | time-to-speech vs meaning-match score |
| `STRATEGY` | `S1_turn_end` | p50/p95 readiness and stale-choice rate |
| `LLM_PROVIDER` | `mock` | violation rate, intended-reason hits, p95 latency |
| `STANCE_CHECK` | `llm` | filtered violations vs added latency |
| `STT_PROVIDER` | `manual` | finalization accuracy and turn-end latency |
| `TTS_PROVIDER` | `browser` | audio-start latency, intelligibility, failure rate |
| `TURN_SILENCE_MS` | `700` | premature turn ends vs response latency |
| `TELEMETRY` | `local` | offline reliability; SpacetimeDB is optional later |
| `MODE` | `stance` | within-subject median/p90 and meaning match vs baseline |

Claims about performance remain hypotheses until measured with the brief's protocol.
