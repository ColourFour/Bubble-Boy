# Improvement Backlog

The Planner may select from this backlog, but it may also propose a better Bubble
Boy-specific item if repo evidence supports it. Each selected item must be one
bounded iteration with visible acceptance criteria.

## Primary Candidates

- [ ] Improve room or environment visuals: lighting, weather, water, terrain,
  props, composition, depth cues, or time-of-day mood.
- [ ] Add or refine Bubble Boy idle animations so he feels present when the user
  does nothing.
- [ ] Make drive, mood, energy, hunger, curiosity, or personality state visible
  through behavior, posture, pacing, focus, or reaction timing.
- [ ] Improve click, drag, hover, camera, or proximity interaction feedback in the
  toybox.
- [ ] Improve object affordances so toybox items communicate what they are and how
  Bubble Boy can respond to them.
- [ ] Reduce janky motion, snapping, oscillation, visual popping, or unclear state
  transitions.
- [ ] Clarify one behavior loop so intent, action, feedback, and state changes are
  easier to observe and test.
- [ ] Improve browser or toybox reliability when loading, resetting, reloading, or
  recovering from missing assets.
- [ ] Remove obsolete agentic-loop, proposal, log, report, screenshot, or experiment
  artifacts when they clutter the repo or confuse future agents.
- [ ] Simplify behavior code only when the complexity directly blocks a visible
  creature, environment, interaction, or reliability improvement.

## Secondary Candidates

- [ ] Add focused tests or smoke checks for a visible behavior change.
- [ ] Tighten documentation only when it helps future agents choose better Bubble
  Boy toybox improvements.
- [ ] Improve deterministic simulation checks for motion, drive state, or idle
  behavior.

## Do Not Select

- Broad backend cleanup with no visible creature, environment, interaction, or
  reliability gain.
- Large rewrites, framework swaps, or generic architecture churn.
- Fake autonomous loops inside the product.
- New agent infrastructure or orchestration unless the user explicitly asks for it.
- Heavy rendering, game, physics, or state-management frameworks unless explicitly
  approved.
- Permanent reports, proposals, logs, generated screenshots, or experiment outputs
  in source folders.
- Cosmetic churn that changes colors or layout without making Bubble Boy easier to
  perceive, understand, or interact with.
