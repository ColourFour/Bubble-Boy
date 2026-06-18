# Project Gates

Use real gates discovered from the Bubble Boy repo. Do not invent commands.

## Default Required Gate

Run this for most iterations:

```bash
python -m pytest
```

If the repo-local virtual environment exists and the shell does not provide
`python`, activate it first:

```bash
source .venv/bin/activate
python -m pytest
```

This is configured by `pyproject.toml` and includes the Python tests. When Node is
available, pytest also runs the JS toybox simulation regression wrappers.

## Focused Simulation Gate

For behavior, idle, motion, drive-state, or deterministic toybox simulation changes,
this focused Node gate is available:

```bash
node --experimental-default-type=module --test tests/sim/simRegression.test.js
```

Use this in addition to `python -m pytest` when it is the fastest way to isolate
simulation behavior.

## Optional Style Gate

Ruff is listed in the `dev` optional dependencies. If it is installed in the local
environment and the iteration changes Python code, run:

```bash
python -m ruff check .
```

Do not fail an iteration solely because Ruff is unavailable in an environment that
has not installed `.[dev]`.

## Browser / Toybox Smoke Check

For visible toybox, creature, interaction, or loading changes, run the local UI:

```bash
python -m bubble_ui.server
```

Then open:

```text
http://127.0.0.1:8765
```

Manual smoke checklist:

- The main Bubble Boy UI loads without a server traceback.
- The toybox iframe or canvas loads instead of showing a blank or broken surface.
- Bubble Boy, the room, and important objects are visible.
- Camera, click, drag, hover, or interaction behavior relevant to the slice responds.
- Reset or reload controls still recover the toybox when applicable.
- The browser console has no new recurring errors from the changed code.
- Any visible state expression, idle animation, or feedback promised by the plan can
  be observed directly.
