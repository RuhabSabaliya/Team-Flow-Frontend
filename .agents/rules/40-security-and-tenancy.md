---
trigger: model_decision
description: "Use when handling authentication, sessions, authorization, roles, memberships, workspace isolation, invitations, passwords, cookies, secrets, uploads, or security-sensitive TeamFlow behavior."
---

# Security and Multi-Tenancy Rules

- Do not select an authentication mechanism, token/session strategy, cookie policy, identity provider, password policy, email verification flow, or password reset flow without asking the user and explaining alternatives.
- Authentication answers who the user is; authorization answers what that user may do. Do not treat them as interchangeable.
- Do not invent TeamFlow roles or permissions. Ask who can perform each operation, on which resource, and under what conditions.
- For every tenant-owned resource, establish the approved ownership and membership checks. Enforce them on the server for every relevant read and write path.
- Never treat a client-provided workspace, project, task, owner, or member ID as proof of access.
- Check for cross-tenant IDOR/BOLA cases: a user changing an identifier must not gain access to another tenant's resources.
- Clarify invitation behavior: who can invite, invitee identity, expiry, acceptance, revocation, duplicate invites, role assignment, and what happens when a member is removed.
- Do not log secrets, authentication material, private file URLs, or sensitive personal information.
- Do not weaken security controls to make a test pass. Explain the failing condition and ask before changing the intended policy.
- For file uploads, clarify allowed file types, maximum size, ownership, access control, retention, malware scanning needs, and storage approach before implementation.
- For every security-sensitive change, include negative tests for unauthorized, unauthenticated, expired, malformed, and cross-tenant access as applicable.
