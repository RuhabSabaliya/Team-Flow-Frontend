---
trigger: model_decision
description: "Use when planning, implementing, reviewing, or debugging TeamFlow's Node.js and Express backend, routes, middleware, controllers, services, API contracts, or server configuration."
---

# Backend and API Rules

- The confirmed backend stack is Node.js + Express + TypeScript. Do not replace it without the user's explicit approval.
- Do not assume the backend folder structure, module boundaries, controller/service/repository pattern, API versioning, REST conventions, response envelope, error format, or validation library. Inspect the repository; if no approved convention exists, present options and ask.
- Do not create a route, controller, service, middleware, repository, DTO, schema, or abstraction until its responsibility and place in the architecture are agreed.
- For each endpoint, clarify its purpose, HTTP method/path, request shape, response shape, authentication requirement, authorization rule, validation, error cases, pagination/filtering behavior (if relevant), and compatibility impact before implementation.
- Do not invent status codes, error codes, naming conventions, or response shapes where the API contract is not established. Suggest a consistent option and ask the user to approve it.
- Inspect existing middleware order and Express version before modifying request handling. Middleware ordering can affect security and behavior.
- Keep business rules out of transport-specific code only if the approved architecture calls for that separation. Do not impose a layered architecture merely because it is fashionable.
- For each new middleware or layer, state the responsibility it owns, who calls it, what it depends on, and what breaks if removed.
- Explain request flow in order: incoming request → applicable middleware → route → handler/layers → database or external service → response/error handling. Use the actual implementation, not a generic imagined flow.
- Do not add CORS, Helmet, rate-limiting, compression, logging, validation, or security packages without checking the current setup and asking about library choice when unresolved.
- Do not silently add a second backend inside Next.js route handlers or move logic between Next.js and Express. Ask before changing the boundary between frontend and backend.
