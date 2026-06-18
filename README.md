# Bubble Boy

Bubble Boy is a local sandboxed AI pet that lives inside `bubble/`.

He is a general-purpose agent with his home in a fenced world, a visible state, and an approval loop. He can inspect his bubble, chat through the local UI, create proposal JSON, apply only allowlisted proposal types, reflect after an approval, and manipulate his room in a local web interface.

The long-term direction is a smart Tamagotchi-style AI creature with personality, memory, safe tools, and a sandboxed iframe toybox for visual experiments.

## Current Status

What works now:

- Bubble Boy can inspect `bubble/` through safe storage helpers.
- `wake` and chat can produce speech plus one proposal.
- Proposals are saved as JSON in `bubble/proposals/`.
- Approval applies only explicit safe handlers.
- Applied proposals are marked with changed files and timestamps.
- The UI renders health, avatar state, room state, proposal cards, chat, and status.
- After approval, Bubble Boy can reflect on the deterministic change.
- If model API settings are missing, the mock brain keeps the project usable locally.

Known limitations:

- Approval only works for explicit safe handlers.
- Chat is wired, but memory is shallow.
- The toybox iframe is planned, not complete.
- Duplicate approval protection is frontend-only so far.

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

This keeps the core project boring in the right place. If a proposal cannot be matched to a safe handler, approval is blocked and no files are changed.

### Toybox Power

Toybox power is the planned playful lane. It should allow Bubble Boy to experiment with generated HTML, CSS, and JavaScript inside a sandboxed iframe.

The toybox can be looser because it is disposable and isolated:

- It should render inside a sandboxed iframe, separate from the main app.
- It should be resettable and reloadable.
- Broken toybox code should break only the toybox.
- The backend and main UI should not trust toybox scripts.
- Toybox updates should still enter through an explicit `update_toybox` proposal handler.

The idea is to let Bubble Boy make visual experiments without giving model output uncontrolled access to the real app or backend.

## Architecture

The repo is intentionally small.

- `bubble/` is Bubble Boy's world. It contains status, memory, logs, proposals, and world state.
- `bubble_boy/` is the Python core. It owns policy, storage, proposal creation, approval, model calls, checks, and CLI commands.
- `bubble_ui/` is the local web UI. It serves the page, exposes local API routes, renders the room, and sends wake/chat/approve requests.
- `tests/` covers the policy and storage boundaries.

Important files:

- `bubble_boy/policy.py` resolves paths and blocks access outside `bubble/`.
- `bubble_boy/storage.py` provides fenced read, write, append-log, and tree helpers.
- `bubble_boy/mind.py` calls the configured model API or falls back to a mock brain.
- `bubble_boy/proposals.py` saves proposals and applies allowlisted approval handlers.
- `bubble_ui/server.py` serves `/`, `/api/world`, `/api/wake`, `/api/chat`, and `/api/approve`.
- `bubble_ui/static/app.js` renders the client state and blocks duplicate approval clicks in the current browser session.

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
python -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
python -m pytest
```

Useful CLI commands:

```bash
python -m bubble_boy.cli status
python -m bubble_boy.cli tree
python -m bubble_boy.cli wake
python -m bubble_boy.cli approve <proposal-id-or-prefix>
python -m bubble_boy.cli read status.md
```

Run the local web UI:

```bash
python -m bubble_ui.server
```

Then open:

```text
http://127.0.0.1:8765
```\

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

## Roadmap

### Phase 1: Stable Local Creature

- Keep the project runnable without external services.
- Preserve the fenced `bubble/` world.
- Make status, memory, logs, proposals, avatar, and room state easy to inspect.
- Keep tests focused on policy and storage safety.
- Improve duplicate approval protection on the backend.

### Phase 2: Useful Safe Handlers

- Add more explicit proposal handlers for common low-risk mutations.
- Keep each handler deterministic and reviewable.
- Record changed files for every applied proposal.
- Expand tests around approval dispatch and blocked proposals.
- Prefer small handlers over a generic "write whatever the model asked for" path.

### Phase 3: 3D Toybox Iframe

- Build `bubble/world/toybox.html` as a sandboxed 3D/WebGL toybox.
- Render it in a sandboxed iframe in the UI.
- Use a persistent canvas-based renderer, not a throwaway 2D placeholder.
- Create a low-poly island scene surrounded by violent animated water.
- Add a humanoid Bubble Boy character.
- Add a workbench, campfire, receipt tree, proposal objects, log objects, and approval objects.
- Add slow orbit camera plus user camera controls.
- Add reset and reload controls.
- Add state files that drive the scene without letting model output edit the main app.
- Later add an `update_toybox_state` handler so Bubble Boy can safely manipulate the world.
- Later add an `update_toybox_code` handler only if the sandbox boundary is proven safe.

### Phase 4: Tamagotchi-Style Life Loop

- Add lightweight needs, moods, routines, and idle behavior.
- Let Bubble Boy make small observations about his world over time.
- Keep the loop inspectable and interruptible.
- Avoid background behavior that silently mutates real files.

### Phase 5: Better Chat And Memory

- Make chat use deeper memory without turning memory into an uncontrolled write surface.
- Add structured memory updates through safe handlers.
- Teach Bubble Boy to refer to recent approvals and user requests.
- Keep memory edits auditable.

### Phase 6: Shareable Demo

- Package a clean local demo flow.
- Add seed data that shows the creature, proposal loop, and toybox.
- Document the safety boundaries clearly for new users.
- Make the UI presentable without requiring secrets.

## Next Build Target

Build the first permanent 3D toybox slice.

The target is a sandboxed iframe containing a canvas/WebGL scene: a tiny island surrounded by violent waves, with a humanoid Bubble Boy, a workbench, campfire, receipt tree, proposal/log/approval objects, and an orbiting controllable camera.

This should become the real visual lane of the project, not a temporary placeholder.

Suggested first slice:

1. Create `bubble/world/toybox_state.json`.
2. Create `bubble/world/toybox.html`.
3. Add a `/toybox` route that serves the toybox iframe.
4. Add a sandboxed iframe to the Bubble viewport.
5. Add reload/reset controls for the toybox.
6. Render a low-poly island scene with:
   - stormy surrounding water
   - humanoid Bubble Boy
   - workbench
   - campfire
   - receipt tree
   - proposal/log/approval objects
   - slow orbit camera
   - user camera controls
7. Keep toybox rendering separate from the main UI.
8. Do not allow toybox scripts to call backend APIs.
9. Do not let model output edit main app code.
10. Keep current wake/chat/proposal/approval behavior working.

Future follow-up:

- Add `update_toybox_state` so Bubble Boy can safely change mood, weather, objects, speech, and world state.
- Add tests proving toybox handlers cannot write outside the allowlisted world files.
