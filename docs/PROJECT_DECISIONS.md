# TeamFlow — Project Decision Register

This file is the source of truth for decisions the user has confirmed. Do not change a decision's status to **Confirmed** unless the user explicitly confirms it. AI suggestions remain **Proposed** until accepted.

## Confirmed

| Area | Confirmed decision | Confirmation source |
|---|---|---|
| Project name | TeamFlow | User explicitly confirmed TeamFlow |
| Product concept | Multi-tenant project-management and issue-tracking SaaS | User explicitly confirmed the TeamFlow concept |
| Domain direction | Workspaces, members, projects, tasks/issues | Included in the TeamFlow concept the user confirmed |
| Repository layout | Separate repositories/folders: `Backend/TeamFlowBackend` and `Frontend/TeamFlowFrontend` | User explicitly confirmed: `@[Backend/TeamFlowBackend] is for Backend and @[Frontend/TeamFlowFrontend] is for Frontend` |
| Frontend framework | Next.js (`v16.x` App Router) | User explicitly selected |
| Frontend language | TypeScript | User explicitly selected |
| Frontend port | `2004` (CORS origin configured on backend for `http://localhost:2004`) | User explicitly specified port 2004 |
| Frontend styling | Tailwind CSS with custom design tokens from `frontend-design` skill | User approved design proposal and skill instructions |
| Frontend design direction | High-density, restrained visual identity, no cliché cards or drop-shadows | User approved frontend-design plan |
| Frontend package manager | `npm` | User approved matching backend |
| Frontend Auth State | Option 1: React Context (`AuthContext` + `useAuth()`) with skeleton loader during session check | User explicitly selected: "option 1 with proper loading or skalton loader untill user data is avilable" |
| Frontend Navigation Layout | Option 1: Top Bar Workspace Selector + Left Project Sidebar Rail (Linear/Slack model) | User explicitly selected: "option 1" |
| Task Detail Experience | Option 1: Slide-Over Drawer with inline title/description editing, status transitions, and deletion | User explicitly selected: "option 1" |
| Backend runtime | Node.js (`v24.17.0`) + TypeScript | User explicitly selected |
| Backend framework | Express.js (`v5.x`) | User explicitly selected |
| Backend port | `2811` | User explicitly specified port 2811 |
| Package manager | `npm` | User explicitly selected npm |
| Backend architecture | Layered Architecture (`routes/`, `controllers/`, `services/`, `models/`, `middlewares/`, `config/`, `utils/`) | User explicitly selected: "i prefer layer architecture with proper comments" |
| API Style | Direct REST Payloads (relying on HTTP status codes) with `/api/v1/` prefix | User explicitly selected Option 2 with `/api/v1/` prefix |
| TypeScript Dev Runner | `tsx watch` | User explicitly selected Option 1 (`tsx`) |
| Request Validation | `zod` for API-boundary schema validation (`body`, `query`, `params`) | User explicitly selected Zod |
| Error Response Format | Standard Error Format A (`{ error: { code, message, details?: [] } }`) with proper HTTP status codes, no status code in body | User explicitly selected Format A with specified schema |
| Database | MongoDB local on `mongodb://localhost:27017` | User confirmed: "i have mongo db compass installed so you can use 27017 local" |
| ODM | Mongoose (`v9.x`) | User explicitly selected |
| Authentication Strategy | JWT with dual-support: HttpOnly Cookies + Authorization Bearer header | User explicitly selected: "JWT Authentication with HttpOnly Cookies + Bearer Token Support" |
| Password Hashing | `bcrypt` (work factor 10) | User explicitly selected: "bcrypt" |
| Token Lifecycle | Access Token (short-lived, 15m) + Refresh Token (long-lived, 7d with DB tracking) | User explicitly selected: "Acess +Refreshtoken" |
| Onboarding / Signup Flow | Option B: User-only registration first; workspaces created/joined separately | User explicitly selected: "Option B for new user" |
| Workspace Membership Model | Option 2: Dedicated `WorkspaceMember` collection (referenced many-to-many with compound index) | User explicitly selected: "option 2" |
| Workspace Slug Strategy | Hybrid: User can supply custom slug; auto-generated with collision suffix if omitted | User confirmed: "User Must Provide It but also have option to generate It" |
| Role Hierarchy | `owner` (full authority/deletion), `admin` (management), `member` (contributor), `viewer` (read-only) | User confirmed role hierarchy and permission matrix |
| Task Statuses | 7 States: `backlog`, `todo`, `in_progress`, `in_review`, `on_hold`, `done`, `canceled` | User selected Option 1 and requested adding `on_hold`: "yes on_hold sounds good" |
| Task Priorities | 5 Levels: `urgent`, `high`, `medium`, `low`, `none` | Confirmed as understandable standard |
| Project Key Format | 2 to 5 uppercase alphanumeric letters unique within workspace (e.g., `TF`, `DEV`); task keys formatted as `KEY-SEQ` (e.g., `TF-1`) | User approved: "yes continue m4" |
| Workspace Member UI | Modal roster management, inline invite by email, role assignment (`admin`, `member`, `viewer`), protected owner role | Confirmed by user: Option 1 |
| Task Search & Filter Rail | Real-time text search (key, title, notes), priority filter, member filter, active filter counters, reset button | Confirmed by user: Option 3 |
| Project Settings & Danger Zone | General settings (name, description, immutable key) and safe deletion requiring typing key confirmation | Confirmed by user: Option 3 |
| Workspace Settings & Renaming | General settings (name, slug) and safe deletion requiring typing slug confirmation (owner-only) | Confirmed by user: Option 3 |
| User Profile & Password Management | Display name update (`PATCH /api/v1/auth/profile`), secure password change with bcrypt verification (`POST /api/v1/auth/change-password`), modal tabs | Confirmed by user: Option 3 |
| The Complete Frontend Suite | Task assignees, Board vs. List view switcher (`TaskListView`), Discussion comments feed (`TaskComments`), Attachments dropzone, Global `Ctrl+K` Command Menu | Approved by user: "continue to work on all of them together" |
| Local AWS learning/emulation | Floci (`v0.4.0`) | User explicitly selected |
| Primary AI IDE | Google Antigravity | User said mostly Antigravity |
| Secondary AI IDE | Cursor, if needed | User said Cursor if needed |

## Not yet confirmed — ask before relying on these

| Area | Open decision / question | Status |
|---|---|---|
| File storage & attachments | Floci S3 bucket integration setup? | Open |
| Operations | Production logging library, metrics, error reporting, health checks and alerting? | Open |
| Integrations | Email (SES/Floci), queues, cache, realtime? | Open |
| Production cloud | AWS services, region, network, hosting, secrets, domain, CI/CD, budget? | Open |
| Product scope | Billing, plans, audit retention, external integrations, optional features? | Open |

## Decision update protocol

For each new decision, add:

- **Decision:** the selected option in precise terms.
- **Status:** Proposed / Confirmed / Replaced / Deprecated.
- **User confirmation:** date or direct confirmation context, when available.
- **Reason:** why this option was selected.
- **Alternatives:** options considered and trade-offs.
- **Impact:** affected modules, APIs, data, security, cost, deployment and tests.
- **Reversal/removal:** what it takes to change or remove the decision later.

Do not infer confirmation from an AI-generated plan or from an unanswered question. If a confirmed decision needs to change, preserve the old decision as Replaced and record the new user's approval.
