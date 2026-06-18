# Protected Files / Behaviors

These protections apply to every Bubble Boy loop iteration.

## Product Boundaries

- Do not create fake autonomous loops inside the product.
- Do not add new agent infrastructure, runners, schedulers, agent roles, orchestration
  code, or proposal systems unless the user explicitly requests it.
- Do not replace working creature state, survival, personality, or toybox simulation
  logic with abstract architecture.
- Do not introduce heavyweight rendering, game, physics, ECS, build, or UI frameworks
  unless the user explicitly approves the dependency and migration.
- Do not break existing toybox loading, reset/reload behavior, sandboxing, or main UI
  access to the toybox.
- Do not weaken the fenced `bubble/` storage policy, proposal approval boundary,
  safe handlers, or path checks.
- Do not silently broaden durable write access outside the approved Bubble Boy world.

## Repo And Artifact Boundaries

- Do not alter secrets, `.env` files, local virtual environments, caches, or machine
  specific settings.
- Do not leave screenshots, logs, proposals, generated reports, trace dumps,
  benchmark output, temporary HTML, or experiment outputs in source folders.
- Do not delete user data, existing world state, logs, proposals, or generated assets
  unless the plan is specifically about removing obsolete clutter and names the files.
- Do not change package metadata, dependency declarations, test configuration, or
  generated lock/package files unless the plan specifically requires it and the user
  has approved the scope.
- Do not alter public CLI commands, API routes, or UI entry points unless the plan's
  acceptance criteria require it.
