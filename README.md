# TeamFlow AI Rules — Installation and Use

This rule pack is intended for **Google Antigravity first** and **Cursor second**. It establishes a strict question-first, learning-first workflow for TeamFlow.

## Included files

```text
teamflow-ai-rules/
├── AGENTS.md                         # Shared root instructions; recognized by Antigravity and Cursor
├── README.md                         # This guide
├── .agents/
│   └── rules/                        # Antigravity modular workspace rules
│       ├── 10-backend-and-api.md
│       ├── 20-database-and-mongoose.md
│       ├── 30-frontend-nextjs.md
│       ├── 40-security-and-tenancy.md
│       ├── 50-testing-and-verification.md
│       └── 60-floci-and-aws.md
├── .cursor/
│   └── rules/
│       └── 00-teamflow-governance.mdc # Cursor project rule that points to AGENTS.md
└── docs/
    ├── PROJECT_DECISIONS.md           # Confirmed facts and open decisions
    ├── FEATURE_PLAN_TEMPLATE.md       # Use before implementing one feature
    └── CHANGE_EXPLANATION_TEMPLATE.md # Explain why files/components exist and removal impact
```

## Install in a TeamFlow repository

1. Create or open the root folder of your TeamFlow Git repository.
2. Copy **all contents** of this pack into that repository root. Merge folders if they already exist; do not overwrite existing files without inspecting them first.
3. Keep `AGENTS.md` at the repository root. Do not put it only inside `.agents/` or `.cursor/`.
4. Open the repository root as the workspace in Antigravity.
5. Start with the discovery prompt below. Do not ask the agent to scaffold the full app immediately.

### Antigravity

Antigravity automatically discovers the root `AGENTS.md` and the Markdown rules directly inside `.agents/rules/`. The rule files use Antigravity's current `trigger` frontmatter format.

In Antigravity IDE, you can also inspect them under the Agent panel's **… → Customizations → Rules**. Keep the files in the repository so they are version-controlled with the project.

### Cursor

Current Cursor documentation supports root `AGENTS.md` as a plain-Markdown project instruction file. This pack also includes `.cursor/rules/00-teamflow-governance.mdc` as a native project rule that points the agent to the shared instructions.

Open the TeamFlow repository root in Cursor. Check the Agent's active rules/customizations to verify the rules are being picked up.

## First prompt to use

Paste this into Antigravity after installing the files:

> Read `AGENTS.md`, all applicable files in `.agents/rules/`, and `docs/PROJECT_DECISIONS.md` before doing anything. Do not create or modify code yet. Inspect the existing repository read-only. Tell me what exists, what is confirmed, what is unknown, and which decisions you need me to make before the first implementation. Ask questions for every unresolved decision that affects setup or architecture. Do not scaffold, install packages, generate files, or implement anything until I answer and approve the plan.

## Working rule

For each next feature, work in this order:

1. Discuss the requirement and acceptance criteria.
2. Ask about missing decisions; do not fill gaps with guesses.
3. Present a small implementation plan and wait for approval where required.
4. Implement only one approved feature.
5. Explain every meaningful addition, why it exists, what depends on it, and what happens if it is removed.
6. Test, report actual results, and document remaining issues.

## Important

Rules are persistent instructions, not a technical enforcement mechanism. Review diffs, tests, permission prompts, and cloud changes yourself. Never put secrets in rule files or commit them to Git.
