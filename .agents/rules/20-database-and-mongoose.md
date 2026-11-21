---
trigger: model_decision
description: "Use when designing or modifying TeamFlow's MongoDB collections, Mongoose schemas/models, indexes, queries, aggregation pipelines, transactions, seeds, or data migrations."
---

# MongoDB and Mongoose Rules

- The confirmed database stack is MongoDB + Mongoose. Do not replace it without explicit approval.
- Never design a schema from assumptions. Clarify the business entity, ownership, required/optional fields, uniqueness, lifecycle, relationships, deletion behavior, access pattern, and tenant boundary first.
- Do not choose embedded documents versus references without explaining the trade-offs for read/write patterns, document growth, consistency, and querying, then asking the user.
- Do not add fields, indexes, validators, virtuals, hooks, plugins, TTL behavior, or Mongoose middleware just because they might be useful. Explain and obtain approval when the choice is not already established.
- Before changing a schema, inspect all current read/write paths and existing data assumptions. Identify backward compatibility and migration/backfill needs.
- Before adding an index, identify the exact query or constraint it supports, expected selectivity/uniqueness, write/storage cost, and how to verify it is used.
- Do not add unique constraints without discussing case sensitivity, normalization, tenant scope, existing duplicates, and failure behavior.
- Do not claim a field or collection is safe to delete until references, API consumers, background jobs, data retention, and tests have been inspected.
- For destructive data changes, describe affected records, backup/export needs, rollback limitations, and a verification plan. Obtain explicit approval before execution.
- Multi-tenant queries must enforce the approved tenant and resource-access rules server-side. Never rely solely on a workspace ID supplied by the client.
- Do not assume transactions are available or required; verify MongoDB deployment topology and the exact consistency requirement first.
- Explain each model/schema's purpose, relationships, important indexes, query usage, and the consequences of removing or changing it.
