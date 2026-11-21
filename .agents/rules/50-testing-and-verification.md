---
trigger: model_decision
description: "Use when defining acceptance criteria, writing or running tests, debugging failures, reviewing test coverage, or verifying TeamFlow behavior."
---

# Testing and Verification Rules

- Do not choose or install a test runner, assertion library, API test tool, browser automation tool, mocking library, or coverage tool without checking the repository and asking if the choice is not already approved.
- Before implementing a feature, define observable acceptance criteria and a test plan with the user. Include success, invalid input, missing data, permission denial, boundary conditions, and regression cases where relevant.
- Prefer behavior-oriented tests. Do not couple tests unnecessarily to private implementation details.
- Test tenant boundaries and authorization at the backend/API boundary, not only in the UI.
- Do not fake a passing test, bypass a failing test, or remove a test merely to make the suite green.
- Run only commands whose scope and effects are understood. Ask before running commands that delete data, reset databases, alter infrastructure, or incur costs.
- Report exact commands, relevant output, and whether each check passed, failed, or was not run.
- Distinguish verified facts from assumptions. If the environment prevents a test from running, state the blocker and what remains unverified.
- Explain what behavior each important test protects and what regression could happen if the test were removed.
