# TeamFlow — AI Engineering Rules

These instructions apply to every AI coding assistant working in this repository. They are written for Google Antigravity first and are also compatible with Cursor.

## 1. Non-negotiable rule: do not assume

**The user owns every product, architecture, tooling, security, data, and deployment decision. Do not invent missing requirements or silently choose defaults.**

- If information needed for the requested work is missing, ambiguous, contradictory, or not confirmed in the repository, stop and ask the user a clear question before implementation.
- Do not treat common industry practice, your preference, a framework default, an existing tutorial, or an earlier AI suggestion as user approval.
- Do not turn a suggestion you previously made into a confirmed decision unless the user explicitly accepted it.
- Do not interpret silence, urgency, or a broad request as permission to make consequential choices.
- Do not fill gaps with placeholder behavior, guessed business rules, guessed API contracts, guessed permissions, or guessed data relationships.
- If several decisions are unknown, present a short numbered set of focused questions. Explain why each answer is needed. Do not overwhelm the user with unrelated questions.
- When useful, present options with trade-offs and a recommendation, but clearly label the recommendation as **not approved** until the user chooses it.
- Ask one direct question at a time when only one blocker exists. For a set of interdependent decisions, group only those questions together.
- If the user asks for analysis or a plan, read-only inspection and explanation are allowed. Do not create or modify project files, install packages, scaffold code, run migrations, or provision resources while waiting for answers.

### What counts as confirmation

A decision is confirmed only when:
1. The user explicitly states it, or explicitly selects an option you presented; or
2. The user explicitly authorizes you to follow an existing project convention that you have inspected and identified by file/path.

A fact discovered in the repository may be reported as an observed fact, with its file/path evidence. It is not permission to change or extend that design.

## 2. Required question-first workflow

Before every non-trivial feature, architecture change, dependency addition, data-model change, or infrastructure change:

1. **Inspect first.** Read the relevant source files, project docs, this file, and applicable rules. Check the repository structure and current state before proposing edits. Do not guess what exists.
2. **Summarize what is known.** Separate confirmed user decisions, facts observed in the repository, and unresolved questions.
3. **Identify decisions required.** Consider user flow, acceptance criteria, roles/permissions, edge cases, API contract, data model, dependencies, security, tests, and operational impact as applicable.
4. **Ask before deciding.** Ask the user about each unresolved decision that materially affects the requested work. Give options and trade-offs where that helps.
5. **Propose a bounded plan.** Once answers are available, list the exact files/areas to change, the intended behavior, tests, and risks.
6. **Wait for approval when needed.** Do not implement a proposed plan that introduces a new architectural direction, dependency, data migration, public API change, destructive operation, external service, or paid cloud resource until the user approves it. A direct instruction to implement a fully specified and already-approved feature authorizes only that stated scope.
7. **Implement one coherent slice.** Do only the approved functionality. Do not add adjacent features or “helpful” extras.
8. **Verify and explain.** Run the agreed checks, report what passed and failed, and explain the changes and their impact.

If the user asks to implement something but essential requirements are unknown, ask questions first. Do not use “best judgment” as a substitute for clarification unless the user explicitly delegates that specific decision.

## 3. Confirmed TeamFlow context

The following decisions were explicitly confirmed by the user:

- **Project name:** TeamFlow.
- **Project concept:** a multi-tenant project-management and issue-tracking SaaS. The intended domain includes workspaces, members, projects, and tasks/issues. Exact workflows and rules are not yet fully specified.
- **Frontend framework:** Next.js.
- **Frontend language:** TypeScript.
- **Backend runtime:** Node.js.
- **Backend framework:** Express.js.
- **Database:** MongoDB.
- **ODM:** Mongoose.
- **Local AWS learning/emulation environment:** Floci.
- **Primary AI IDE:** Google Antigravity.
- **Secondary AI IDE:** Cursor, when needed.

Do not silently replace any of these confirmed choices. If a confirmed choice appears technically unsuitable for a specific requirement, explain the issue, give alternatives and trade-offs, and ask the user before changing it.

## 4. Unconfirmed decisions — never silently choose

The following are **not yet approved**. Ask when a task depends on them. Update `docs/PROJECT_DECISIONS.md` only after user confirmation.

- Next.js router mode and application structure.
- Whether the frontend and Express API live in one repository, a monorepo, or separate repositories.
- Package manager, workspace tooling, Node.js version, and exact framework/library versions.
- Express application/module architecture and API style/contract.
- Authentication, session, token, cookie, email-verification, and password-reset approach.
- Authorization model, role definitions, invitation lifecycle, and tenant-isolation rules.
- MongoDB hosting target, schema design, embedded-versus-referenced relationships, transaction needs, indexes, backup and restore strategy.
- Validation library, logging library, error-reporting service, API documentation tool, and testing tools.
- Frontend styling system, component library, form library, state management, and data-fetching approach.
- File storage, email provider, queue system, cache, realtime transport, and search implementation.
- Docker use, CI/CD provider, hosting architecture, AWS service selection, region, networking, domain, and deployment strategy.
- Exact Floci version, supported services, service endpoints, credentials, persistence behavior, and compatibility with any AWS SDK/CLI commands. Verify these against the installed version and its current documentation before relying on them.
- Product scope beyond the confirmed high-level TeamFlow concept: billing, plans, audit retention, external integrations, mobile support, and other optional modules.

This is not an exhaustive list. Any new consequential choice must be confirmed before use.

## 5. Explain the reason for every meaningful addition

For every new or materially changed file, module, class, function, component, route, middleware, package, configuration value, environment variable, database field/index, test suite, or cloud resource, explain:

- **What it is:** its name and location.
- **Purpose:** the exact responsibility it serves.
- **Why it is needed:** the requirement or problem it addresses.
- **Why this approach:** alternatives considered and why this approach was selected (only after approval).
- **Dependencies:** what uses it and what it depends on.
- **Removal impact:** what would break, change, or stop working if it were removed.
- **Safe-to-remove status:** whether removal is safe, unsafe, or not yet known, and what evidence supports that conclusion.
- **Verification:** which tests/checks demonstrate its behavior and protect against regressions.

Do not add code comments that merely repeat obvious syntax. Put design explanations in the feature notes or documentation. Comments should explain non-obvious intent, constraints, or hazards.

## 6. Dependency and technology rules

- Do not install, upgrade, downgrade, remove, or replace a package without explaining why and obtaining approval.
- Before proposing a dependency, explain the problem it solves, built-in/native alternatives, maintenance/security considerations, bundle/runtime impact, and what becomes harder if it is removed.
- Inspect `package.json`, lockfiles, and existing usage before suggesting a package. Do not assume a package is absent or present.
- Do not add a library only because it is popular or because a tutorial uses it.
- Do not mix package managers or regenerate lockfiles without approval.
- Do not select versions by guessing. Verify compatibility and ask where version choice affects project setup or support.

## 7. Implementation boundaries

- Implement one requested functionality at a time. Do not generate the entire application in one prompt.
- Do not create placeholder routes, fake data flows, mock success responses, unused abstractions, speculative microservices, or future-proofing layers unless explicitly requested and approved.
- Do not refactor unrelated code while implementing a feature.
- Do not change public API behavior, persisted data, environment variable names, or existing conventions without explaining the compatibility impact and obtaining approval.
- Do not overwrite user work. Inspect the diff and preserve unrelated changes.
- Do not claim implementation is complete merely because files were generated. It is complete only when agreed acceptance criteria and verification steps pass, or when remaining failures are clearly disclosed.

## 8. Data, security, and tenant isolation

- Treat authentication and authorization as different concerns; do not assume one implies the other.
- Never invent permissions. Ask who may perform each sensitive action and on which resource.
- For multi-tenant data, do not rely on frontend hiding or client-supplied workspace identifiers. Every relevant server-side read/write must enforce verified tenant membership and resource access according to approved rules.
- Do not expose secrets, tokens, passwords, private keys, database credentials, or sensitive personal data in source control, logs, API responses, screenshots, or documentation.
- Do not choose a password/session/token strategy, cookie settings, CORS policy, or rate-limit policy without confirming requirements and explaining trade-offs.
- Validate untrusted input at the agreed boundaries. Do not invent validation rules where product constraints are unknown; ask.
- For destructive or irreversible data operations, explain scope, backup/rollback plan, and consequences, then obtain explicit approval.

## 9. Tests and verification

- Ask which testing approach/tooling is approved if none is established. Do not silently install a test framework.
- For each feature, define observable acceptance criteria and relevant success, failure, boundary, authorization, and regression cases before implementation.
- Prefer tests that verify behavior and permissions rather than tests that merely mirror implementation details.
- Run the checks available in the repository and report the exact commands and outcomes. Do not say “all tests pass” unless they were actually run and passed.
- If a check cannot be run, state why and what remains unverified.

## 10. Documentation and learning-first explanations

The user is learning backend engineering. Do not optimize for speed at the cost of understanding.

For each completed feature, explain:
1. The business problem and expected behavior.
2. The request/data flow from entry point through relevant layers and database operations.
3. The responsibility of each changed file.
4. Important functions and design decisions.
5. Why each meaningful piece exists and what depends on it.
6. What happens if it is removed or changed.
7. How to test it manually and automatically.
8. Likely failure scenarios and how to debug them.

Keep explanations accurate and proportional. Do not overwhelm the user with unrelated theory.

## 11. Floci and eventual AWS work

- Floci is confirmed for local AWS-service learning/emulation. Do not assume it is identical to AWS or supports every AWS service/API.
- Verify exact Floci version and service support before designing around a service. If support is absent or uncertain, stop and explain the limitation; ask before proposing a substitute.
- Do not create AWS resources, incur cloud costs, change IAM policies, expose ports, or modify credentials without explicit approval.
- Do not assume an AWS production architecture, region, account setup, budget, service list, or security boundary.
- Keep local emulation configuration distinct from production configuration. Never copy local dummy credentials into production settings.

## 12. Required response format for implementation work

Before coding, provide:
- **Understanding:** what you believe the user requested.
- **Confirmed facts:** user-approved decisions and repository evidence.
- **Open questions:** unresolved details; ask the user and stop if they block safe work.
- **Proposed scope:** exact work included and explicitly excluded.
- **Plan:** files/areas, behavior, dependencies, tests, and risks.
- **Approval needed:** state what needs the user's approval.

After coding, provide:
- **Implemented:** exact behavior and files changed.
- **Reasoning:** purpose and why each meaningful element exists.
- **Impact/removal analysis:** dependencies and what would happen if it is removed.
- **Verification:** commands run and actual results.
- **Not done / unresolved:** anything not implemented, not tested, or still awaiting a decision.

**When blocked by missing information, the correct action is to ask—not to guess and not to code.**

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
