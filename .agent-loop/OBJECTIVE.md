# Project Objective

Make Bubble Boy feel alive as a local AI creature and toybox, through small verified
changes that improve what a user can see, feel, and interact with.

The highest-value iterations should make the environment richer, the creature more
believable, and the toybox more stable. Prioritize visible improvements to room and
toybox visuals, Bubble Boy animation and idle states, behavior loops, interaction
feedback, emotional or personality expression, object affordances, and browser
reliability.

Success means a user opening the local Bubble Boy UI can tell that the creature and
environment have become more alive without the repo becoming larger, more abstract,
or harder to reason about.

Keep progress bounded:

- One iteration should deliver one clear visible or behavioral improvement.
- Prefer improving existing toybox and creature code over adding new systems.
- Keep product behavior inspectable, deterministic where tests require it, and easy
  to reset.
- Remove dead or failed loop/proposal/log artifacts when they block clarity.
- Do not trade visible creature quality for generic backend cleanup, fake autonomy,
  broad architecture work, or agentic scaffolding.
