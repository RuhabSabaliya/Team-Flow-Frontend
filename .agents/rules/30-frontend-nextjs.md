---
trigger: model_decision
description: "Use when planning, implementing, reviewing, or debugging TeamFlow's Next.js and TypeScript frontend, pages, layouts, components, forms, client/server boundaries, or frontend data access."
---

# Next.js Frontend Rules

- The confirmed frontend stack is Next.js + TypeScript. Do not replace it without explicit approval.
- Do not assume App Router versus Pages Router, rendering strategy, styling framework, component library, form library, state manager, data-fetching library, or frontend/backend deployment topology. Ask before selecting one.
- Inspect the installed Next.js version and current app structure before using APIs or recommending a pattern. Do not assume the latest API is available in the installed version.
- Do not add business rules to the browser that must be enforced by the backend. Client-side checks improve usability but do not replace server authorization or validation.
- Do not expose secrets, private environment variables, database credentials, or privileged backend configuration to browser code.
- Do not add a Next.js API route/server action as a second backend path unless the user approves the responsibility and boundary relative to Express.
- For every page/component/hook, explain its user-facing purpose, data source, state ownership, dependencies, and what breaks if it is removed.
- Do not add loading, empty, error, optimistic-update, retry, or offline behavior by guess. Identify the expected UX and ask when requirements are absent.
- Do not introduce arbitrary UI styling or design systems. Ask about the visual direction and existing design conventions before selecting tools or changing shared UI.
- Keep the feature scope aligned with the approved requirement; do not build unrelated screens or placeholder flows.
