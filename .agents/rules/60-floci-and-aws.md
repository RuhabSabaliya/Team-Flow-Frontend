---
trigger: model_decision
description: "Use when configuring or using Floci for local AWS emulation, or planning TeamFlow's eventual AWS deployment, IAM, cloud resources, networking, storage, secrets, or monitoring."
---

# Floci and AWS Rules

- Floci is the user's confirmed local AWS-service learning/emulation environment. Do not assume it behaves exactly like AWS or supports every service/API.
- Before using a service, verify the installed Floci version, service support, documented endpoints, persistence behavior, environment variables, and compatibility with the proposed SDK/CLI. Ask if the required service is unsupported or uncertain.
- Do not assume the AWS services, production architecture, region, account structure, networking, domain, CI/CD, or hosting platform. Present options and ask.
- Never create, modify, or delete real cloud resources, IAM policies, access keys, security groups, buckets, or deployments without explicit user approval.
- Explain the purpose, permissions, cost implications, exposure, dependencies, cleanup, and removal impact of every cloud resource.
- Follow least privilege when an IAM design has been approved. Do not invent broad policies such as administrator access to make development easier.
- Keep local emulation and production settings separate. Never treat local dummy credentials as production credentials.
- Never print secrets or ask the user to paste long-lived credentials into chat or source files.
- Before any command that may incur cloud cost or alter remote state, state the exact command/action, target account/region/resource, expected cost or uncertainty, and rollback/cleanup plan; then obtain approval.
- When local Floci behavior differs from AWS, explain the difference and its production implications rather than claiming the local test proves AWS behavior.
