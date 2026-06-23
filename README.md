# Bubble Boy

Bubble Boy is a local sandboxed AI pet with a simulation-first 3D toybox.

He has a fenced world in `bubble/`, a local web UI, and a proposal/approval loop for durable changes. The toybox is the visual lane: `simulate(dt, worldState, intents)` owns authoritative state changes, and the Three.js scene projects from `worldState`.

The long-term direction is a cozy Tamagotchi-style creature: deterministic simulation first, presentation second, optional AI suggestions only through explicit safe boundaries.

## Current Status

Updated: 2026-06-23

What works now:

- Bubble Boy can inspect `bubble/` through safe storage helpers.
- `wake` and chat can produce speech plus one proposal.
- Proposals are saved as JSON in `bubble/proposals/`.
- Approval applies only explicit safe handlers.
- Applied proposals are marked with changed files and timestamps.
- The UI renders health, avatar state, room state, proposal cards, chat, status, and a sandboxed toybox iframe.
- After approval, Bubble Boy can reflect on the deterministic change.
- The toybox has a deterministic simulation loop for time, weather, lighting, fire, needs, wandering, foraging, fishing, cooking/eating fish, resource regrowth, and builder work.
- The simulation state lives in `worldState`; rendering and presentation read from it instead of owning behavior.
- The toybox renders a Three.js island with ocean, sky life, Bubble Boy, fire, workbench, build sites, shelter/bed/toy progression, resource forest, arrival supplies, storage/workbench/tools, camp paths/zones/boundary stones, garden plots, food/shore/raft props, late-loop comfort/decor/lookout/capstone props, and debug traces.
- Bubble Boy uses a humanoid presentation path with safe animation fallbacks and procedural overlays/attachments.
- Presentation registries resolve visual descriptors, source/license metadata, transform normalization, carry attachments, animation fallbacks, and debug trace fields.
- Developer-only toybox review states are available through query parameters, for example `/toybox?reviewFamily=earlyIslandAssets&reviewState=active`.
- Node regression coverage exists for the simulation baseline, presentation resolver, camera controls, asset metadata, fallback behavior, and scene trace contracts.
- If model API settings are missing, the mock brain keeps the project usable locally.

Recent toybox visual coverage:

- Days 1-55 have procedural review families for arrival/camp supplies, fire/food routine props, ambient beach finds, pier/shore work, and raft/boat route staging.
- Days 56-75 have procedural placeholder families for fish traps, toy play set, music/art/decor props, and animal familiar visitor staging.
- Days 81-100 have procedural placeholder families for night comfort lights, lookout/map/horizon props, Day 100 display staging, and a major-project capstone.
- The selected Days 91-95 capstone is `communityTable`; the other capstone options remain unimplemented.
- These later-day additions are visual descriptors and review states only. They do not add timed catches, mood/play effects, animal AI, light schedules, map discovery, construction progression, or ending logic.

Known limitations:

- Approval only works for explicit safe handlers.
- Chat is wired, but memory is shallow.
- Safe update handlers for changing toybox state remain limited.
- Duplicate approval protection is frontend-only so far.
- Many toybox props are procedural placeholders. They are intentionally auditable and metadata-tagged, but not final art.
- The current simulation is a one-creature deterministic loop. Friends and optional intelligence layers are future work.

## Safety Model

Bubble Boy has two lanes of power.

### Real Power

Real power means durable file mutation. It stays strict:

- All durable writes must stay inside `bubble/`.
- Paths are resolved through policy checks before file access.
- Approval does not execute arbitrary model output.
- Each approved behavior needs an explicit deterministic handler.
- The model can suggest a proposal, but Python code decides whether anything changes.
- Current handlers are intentionally narrow and easy to audit.

If a proposal cannot be matched to a safe handler, approval is blocked and no files are changed.

### Toybox Power

Toybox power is the playful lane. It renders a local 3D world at `/toybox` and is served separately from the main app.

The toybox can be looser because it is disposable and isolated:

- It renders inside a sandboxed iframe in the main UI.
- It is reloadable from the UI.
- Broken toybox code should break only the toybox.
- The backend and main UI should not trust toybox scripts.
- Toybox updates should still enter through an explicit safe proposal handler.
- Runtime simulation behavior must remain reproducible from `worldState`, `dt`, and intents.
- Rendering, animation, and debug review helpers must not mutate authoritative simulation state.

The idea is to let Bubble Boy make visual experiments without giving model output uncontrolled access to the real app or backend.

## Architecture

The repo is intentionally small.

- `bubble/` is Bubble Boy's world. It contains status, memory, logs, proposals, and toybox state files.
- `bubble_boy/` is the Python core. It owns policy, storage, proposal creation, approval, model calls, checks, and CLI commands.
- `bubble_ui/` is the local web UI. It serves the main page, the `/toybox` page, static toybox modules, and local API routes.
- `bubble_ui/static/toybox/simulation/` owns `worldState` and `simulate`.
- `bubble_ui/static/toybox/presentation/` maps simulation state to animation, visuals, attachments, metadata, and debug traces.
- `bubble_ui/static/toybox/scene.js` renders the Three.js projection.
- `tests/` covers policy/storage plus Node-based toybox simulation and presentation regressions.

Important files:

- `bubble_boy/policy.py` resolves paths and blocks access outside `bubble/`.
- `bubble_boy/storage.py` provides fenced read, write, append-log, and tree helpers.
- `bubble_boy/mind.py` calls the configured model API or falls back to a mock brain.
- `bubble_boy/proposals.py` saves proposals and applies allowlisted approval handlers.
- `bubble_ui/server.py` serves `/`, `/toybox`, `/api/world`, `/api/wake`, `/api/chat`, and `/api/approve`.
- `bubble_ui/static/app.js` renders the client state and blocks duplicate approval clicks in the current browser session.
- `bubble_ui/static/toybox/simulation/worldState.js` defines the canonical toybox state schema.
- `bubble_ui/static/toybox/simulation/simulate.js` performs authoritative deterministic state updates.
- `bubble_ui/static/toybox/presentation/presentationState.js` resolves render-facing presentation state.
- `bubble_ui/static/toybox/presentation/visualRegistry.js`, `animationRegistry.js`, and `attachmentRegistry.js` describe visual families, animation fallbacks, attachments, source metadata, and transform normalization.
- `bubble_ui/static/toybox/reviewMode.js` provides dev-only deterministic visual review states.

## Proposal, Approval, Reflection Loop

The loop is:

1. Bubble Boy inspects his world.
2. The brain returns speech and exactly one proposal.
3. The proposal is saved as JSON in `bubble/proposals/`.
4. A human approves a proposal from the CLI or UI.
5. Approval checks that the proposal is still `proposed`.
6. Approval selects a deterministic allowlisted handler.
7. The handler mutates only specific files inside `bubble/`.
8. The proposal is updated to `applied` with `approved_at`, `apply_action`, and `changed_files`.
9. Bubble Boy reflects on the applied change and states a next intent.

The important boundary is between proposal and approval. The model may write ideas into a proposal record, but it does not get arbitrary write access. Real mutation happens only when an existing handler recognizes the proposal and applies a known operation.

## Local Setup

Use Python 3.11 or newer.

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -e ".[dev]"
python3 -m pytest
```

Useful CLI commands:

```bash
python3 -m bubble_boy.cli status
python3 -m bubble_boy.cli tree
python3 -m bubble_boy.cli wake
python3 -m bubble_boy.cli approve <proposal-id-or-prefix>
python3 -m bubble_boy.cli read status.md
```

Run the local web UI:

```bash
python3 -m bubble_ui.server
```

Then open:

```text
http://127.0.0.1:8765
```

Open the toybox directly:

```text
http://127.0.0.1:8765/toybox
```

Run the JavaScript regression checks:

```bash
node --test tests/sim/simRegression.test.js
node --test tests/sim/presentationState.test.js
node --test tests/sim/cameraControls.test.js
```

Example developer visual review URL:

```text
http://127.0.0.1:8765/toybox?reviewFamily=earlyIslandAssets&reviewState=active
```

## API Setup

Bubble Boy reads local model settings from `.env` through `bubble_boy/config.py`.

Start from `.env.example` when it is available:

```bash
cp .env.example .env
```

Set local values in `.env` without committing secrets:

```bash
OPENAI_API_KEY=your_api_key_here
BUBBLE_BOY_MODEL=your_model_name_here
BUBBLE_BOY_BASE_URL=https://api.openai.com/v1
```

`BUBBLE_BOY_BASE_URL` is optional and defaults to the OpenAI API base URL. If `OPENAI_API_KEY` or `BUBBLE_BOY_MODEL` is missing, Bubble Boy uses the mock brain so local development still works.

## Roadmap Snapshot

The detailed roadmap lives in [ROADMAP.md](ROADMAP.md).

Current baseline:

- Simulation-first toybox architecture is in place.
- Three.js is the presentation layer, not the behavior authority.
- The day 1-100 visual roadmap now has broad procedural placeholder coverage, with later-day families intentionally staged as auditable visual descriptors rather than gameplay systems.
- Simulation, presentation, and camera regression suites are green.

Near-term focus:

1. Keep the regression baseline clean before adding more asset or animation families.
2. Convert selected visual placeholders into deterministic simulation behavior only when the 100-day life-loop scaffold is ready.
3. Add safe toybox-state proposal handlers only when they preserve the existing policy boundary.
4. Improve memory/chat depth without giving model output direct write power.
5. Package a reliable local demo once the early island loop is stable and visually coherent.
