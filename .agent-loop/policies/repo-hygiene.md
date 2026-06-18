# Repo Hygiene Policy

The loop must leave the repo cleaner than it found it and must not turn Bubble Boy
into a scaffold-heavy agent demo.

## Default behavior

- Prefer editing existing files over creating new files.
- Delete obsolete files when replacing behavior.
- Keep generated outputs in `.agent-runs/`, not in source directories.
- Do not commit caches, logs, screenshots, one-off reports, local databases, or model outputs.
- Do not introduce new dependency stacks for small problems.
- Do not create a permanent framework for a one-time workflow.
- Do not add proposal documents, audit reports, screenshots, benchmark dumps, or
  planning notes outside `.agent-runs/`.
- Do not preserve failed experiments as source files. Either finish the slice or
  remove temporary work before handing off.
- Prefer local, direct changes to toybox, behavior, or UI code over cross-cutting
  abstractions.
- Keep generated or third-party assets out of source folders unless they are actual
  product assets with clear provenance and a visible purpose.

## Bloat budget

Per iteration default maximum:

- 6 changed files.
- 2 new files.
- 0 new dependencies.

Exceeding this budget requires explicit justification in the plan and auditor approval.

## Visual Asset Allowance

Small visual assets are allowed only when all of these are true:

- The asset directly supports a visible Bubble Boy, environment, affordance, or
  interaction improvement.
- The asset is small enough for repo review and appropriate for local toybox loading.
- The asset is placed in the existing static asset area, such as
  `bubble_ui/static/assets/toybox/`, not beside source modules or tests.
- The source, license, or generation reason is clear from nearby naming or existing
  asset conventions.
- Any temporary source images, screenshots, drafts, or generated previews are removed
  before the iteration is complete.

## Cleanup Expectations

- Remove obsolete agentic-loop, proposal, log, screenshot, and experiment artifacts
  when they are no longer useful.
- Keep `.agent-runs/` as the only home for loop packets and agent reports.
- If a browser or visual verification creates screenshots or logs, store them outside
  source folders and delete them before final handoff unless the user explicitly asks
  to keep them.
