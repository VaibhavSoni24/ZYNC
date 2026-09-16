# Zync — Watch Together, Perfectly In Sync

> Working name: **Zync**
> One-line pitch: A real-time watch-party platform where friends create a room, drop a YouTube link, and watch perfectly synced - with roles, live chat, and reactions.

This document is the single source of truth for building this project.

---

## 1. Tech Stack (final — resolves the PDF's either/or options)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Matches PDF's recommended stack; fast dev loop |
| Styling | Tailwind CSS | Utility-first, fast to keep consistent on a dark theme |
| Animation | `motion` (npm, formerly Framer Motion), GSAP + ScrollTrigger, Lenis (smooth scroll) | Covers micro-interactions, scroll effects, and buttery scrolling without stacking every library you listed |
| 3D/shader accents (landing page only, used sparingly) | `@react-three/fiber` + a shader gradient background | One signature visual moment, not on every page |
| Backend | Node.js + Express + TypeScript | Single language across the stack — resolves the Django-vs-Node conflict in your notes (see §2.1) |
| Real-time | **Socket.IO** | Built-in room primitives, reconnection handling, and the official Redis adapter you need for the scalability bonus |
| Database | **PostgreSQL** (via Prisma ORM) | Users/rooms/roles are inherently relational |
| Cache/Pub-Sub | **Redis** (Upstash free tier) | Powers the Socket.IO Redis adapter for horizontal scaling |
| Auth | Custom JWT (access + refresh token), bcrypt password hashing | No third-party auth vendor lock-in; matches your custom signup flow |
| OTP Email | **Brevo (formerly Sendinblue), free tier** | Only free provider that lets you send transactional email to *any* recipient without first verifying your own domain |
| Video | YouTube IFrame Player API | Required by the PDF |
| Deployment | Vercel (frontend) + Render (backend + Socket.IO) + Neon or Supabase (Postgres) + Upstash (Redis) | All have working free tiers; Render supports long-lived WebSocket connections, which Vercel serverless does not |

---

## 2. Repo Structure (production-grade monorepo, npm workspaces)

```
zync/
├── apps/
│   ├── client/                        # React + Vite + TS
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   ├── robots.txt
│   │   │   ├── sitemap.xml
│   │   │   └── llms.txt
│   │   ├── src/
│   │   │   ├── assets/avatars/        # 10 preset avatars (see §7)
│   │   │   ├── components/            # shared, dumb UI components
│   │   │   ├── features/
│   │   │   │   ├── auth/              # login, register, OTP verify
│   │   │   │   ├── landing/           # home page
│   │   │   │   ├── room/              # room creation, join, in-room UI
│   │   │   │   ├── profile/
│   │   │   │   ├── about/
│   │   │   │   └── contact/
│   │   │   ├── hooks/
│   │   │   ├── lib/                   # api client, socket client, youtube wrapper
│   │   │   ├── store/                 # zustand stores (auth, room)
│   │   │   ├── styles/                # tailwind config, design tokens
│   │   │   ├── types/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── server/                        # Node + Express + Socket.IO + TS
│       ├── src/
│       │   ├── config/                # env, redis, prisma clients
│       │   ├── modules/
│       │   │   ├── auth/              # controllers, routes, services
│       │   │   ├── users/
│       │   │   ├── rooms/
│       │   │   └── contact/
│       │   ├── sockets/
│       │   │   ├── classes/           # Room.ts, Participant.ts, MessageHandler.ts, RoleManager.ts
│       │   │   ├── events/            # one file per event group (playback, roles, chat, reactions)
│       │   │   └── index.ts           # socket server bootstrap + Redis adapter wiring
│       │   ├── middleware/            # auth guard, rate limiter, error handler
│       │   ├── utils/                 # otp generator, jwt helpers, logger
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   └── shared/                        # TS types + constants shared by client & server
│       └── src/
│           ├── roles.ts               # Role enum, permission matrix
│           ├── socketEvents.ts        # event name constants (single source of truth)
│           └── index.ts
├── .github/workflows/                 # optional CI: lint + typecheck on push
├── .gitignore
├── README.md
└── package.json                       # npm workspaces root
```

---

## 3. Design System (dark theme, sampled from `logo.png`)

Antigravity should sample exact hex values from `logo.png` at build time; these are starting values:

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0A0A12` | Page background |
| `--bg-surface` | `#14141F` | Cards, panels |
| `--bg-elevated` | `#1C1C29` | Modals, dropdowns |
| `--accent-blue` | `#2E7CF6` | Primary gradient stop |
| `--accent-purple` | `#9B3CFF` | Secondary gradient stop |
| `--text-primary` | `#F5F5FA` | Headings, body |
| `--text-muted` | `#8B8B9E` | Secondary text |
| `--border` | `#26263A` | Dividers, outlines |

**Design principle: restraint.** You listed a long list of animation/UI libraries. Use them as a toolbox, not a checklist — pick 2–3 signature moments (e.g., hero shader gradient + scroll-linked reveal on the landing page, smooth room-join transition) rather than applying every effect on every page. No glow-for-glow's-sake. The bar is "looks like a funded startup's product," not "looks like a codepen demo."

**Fonts:** one clean sans-serif for UI (e.g. Inter or Geist), no more than 2 weights in regular use.

---

## 4. Pages & Navigation

Post-login nav: **Home · Room · About · Contact · Profile**

| Page | Contents |
|---|---|
| **Landing (pre-login)** | Hero explaining the product, how it works, CTA to register/login. No mention of Web3task anywhere. |
| **Home** | Post-login landing: quick actions (Host a Room / Join a Room), maybe recent rooms. |
| **Room → Host** | Form: room name, optional description, visibility (public/private), language (Hindi, English, Japanese, Chinese, Russian — extensible list), Create button → generates unique 8-char code formatted `XXXX-XXXX` (e.g. `T6YZ-POM2`), creator becomes Host. |
| **Room → Join** | Two paths: (a) enter 8-char room code directly, or (b) browse/search public rooms by name with a language filter. Either path joins as **Viewer** by default. |
| **In-Room** | Video player (YouTube IFrame API), participant list (role-filtered visibility, §6), playback controls (permission-gated), chat panel (hidden for Viewers), reaction bar (hidden for Viewers), role/host controls panel (Host/Moderator only). |
| **About** | About the *project* (what Zync is, how it works) + About *Vaibhav Soni* as the developer. No mention of Web3task. |
| **Contact** | Vaibhav's contact info + a simple form (name, email, message) that emails submissions to Vaibhav via Brevo. |
| **Profile** | Edit name, avatar (upload or pick from presets), username (**one-time change only**, must re-validate uniqueness), DOB, bio. |
| **404** | Custom, on-brand, not the framework default. |

---

## 5. Auth & Onboarding Flow

1. **Register**: name, unique `@username`, DOB, email.
2. **Email OTP verification**: 6-digit code sent via Brevo, 10-minute expiry, stored in Redis with TTL (not Postgres — it's ephemeral data), resend cooldown of 60s, max 5 attempts before requiring a fresh code.
3. **Avatar** (optional at signup): pick from 10 presets (§7) or upload an image; can be changed later in Profile.
4. **Bio** (optional): one line, ~100 char max.
5. **Password**: hashed with bcrypt, never returned in any API response.
6. On successful verification → issue JWT access token (short-lived, ~15 min) + refresh token (httpOnly cookie, longer-lived) → redirect to Home.
7. **Login**: username or email + password → same token issuance.

**Auth/register page visual concept** (your point #29): build an interactive mascot avatar that visibly reacts as the user types (e.g. "looks" toward the active field, blinks/expresses on password field, celebrates on success) with a soft glowing blob that follows the cursor, over a smooth gradient background using the brand blue→purple tokens. Use `smontlouis/bible-strong-avatar-lab`'s approach (procedural SVG avatar geometry, exported via its React package) as the technique reference for building this reactive mascot — it's a real, actively maintained browser-based tool for exactly this kind of procedural avatar, confirmed via its GitHub repo and live app. Keep it to *one* signature interaction, not layered with every effect from your list.

---

## 6. Preset Avatars (10, for register/profile)

Simple gradient geometric "blob" avatars in the brand palette, generated as SVG assets, each a distinct silhouette so they're recognizable at a glance in participant lists:

1. **Comet** — circular blob, blue→purple diagonal gradient, subtle motion-trail tail
2. **Nova** — soft hexagon, radial gradient burst from center
3. **Drift** — asymmetric blob, horizontal gradient
4. **Pulse** — circle with concentric ring accent
5. **Glint** — teardrop shape, top-lit gradient
6. **Halo** — ring/donut shape, gradient stroke
7. **Ember** — rounded triangle, warm-cool gradient blend
8. **Wisp** — soft cloud/blob cluster shape
9. **Prism** — faceted polygon, multi-stop gradient
10. **Orbit** — small circle with a satellite dot, gradient trail

All built as lightweight inline SVGs (no external image requests), consistent 1:1 aspect ratio, safe on any background from the dark palette.

---

## 7. Rooms & Real-Time Sync

### 7.1 Room identity
- 8-character alphanumeric code, formatted `XXXX-XXXX`, generated server-side, checked for collision against active rooms.
- Fields: name, optional description, visibility (`public`/`private`), language.
- Public rooms are searchable by name and filterable by language; private rooms are only reachable via code.

### 7.2 Roles & permission matrix

| Role | Assigned by | Can control playback | Can chat | Can react | Can manage roles/remove | Visible to |
|---|---|---|---|---|---|---|
| **Host** | Auto (room creator) | ✅ | ✅ | ✅ | ✅ full control, can transfer host | Everyone |
| **Moderator** | Host | ✅ | ✅ | ✅ | ❌ cannot promote/demote Moderator or Host | Everyone |
| **Participant** | Host (or self-request, see §8.4) | ❌ (can *request* control) | ✅ | ✅ | ❌ | Host, Moderators, other Participants (not Viewers) |
| **Viewer** | Default for joiners | ❌ | ❌ | ❌ | ❌ | Only Host and Moderators |

Visibility is enforced both in the UI (don't render what a role shouldn't see) **and** server-side (don't even send that data to sockets that shouldn't have it) — never trust the client alone.

### 7.3 WebSocket events

Base set from the assignment PDF, plus additions needed for chat/reactions/requests:

| Event | Direction | Payload | Notes |
|---|---|---|---|
| `join_room` | C→S | `{ roomId, username }` | Server assigns Host (creator) or Viewer (joiner) |
| `leave_room` | C→S | `{ roomId }` | |
| `sync_state` | S→C | `{ playState, currentTime, videoId }` | Periodic + on-demand resync for late joiners |
| `play` / `pause` / `seek` | C→S | `{}` / `{}` / `{ time }` | Requires Host/Moderator; server validates before broadcasting |
| `change_video` | C→S | `{ videoId }` | Host/Moderator only |
| `assign_role` | C→S | `{ userId, role }` | Host only; server rejects Moderator attempts to touch Host/Moderator roles |
| `remove_participant` | C→S | `{ userId }` | Host only |
| `transfer_host` | C→S | `{ userId }` | Host only, bonus feature |
| `request_control` | C→S | `{}` | Participant asks to be promoted; notifies Host/Mods |
| `respond_control_request` | C→S | `{ userId, approve }` | Host/Mod approves/denies — satisfies the PDF's "participant must request approval" requirement |
| `send_chat` | C→S | `{ message }` | Rejected server-side if sender is a Viewer |
| `chat_message` | S→C | `{ userId, username, message, ts }` | Broadcast to non-Viewer members |
| `send_reaction` | C→S | `{ emoji }` | Rate-limited server-side to 1/sec per user; rejected for Viewers |
| `reaction` | S→C | `{ userId, emoji }` | Client renders as a floating emoji rising on the right edge, YouTube-live style |
| `user_joined` / `user_left` | S→C | `{ ...role-filtered participant data }` | |
| `role_assigned` / `participant_removed` | S→C | `{ ...updated participant list }` | |

### 7.4 Role enforcement
Every state-changing event is validated **on the server** against the sender's current role before it's processed or broadcast — never rely on the frontend hiding a button. This is the PDF's explicit requirement and the most commonly-missed grading point on assignments like this.

### 7.5 OOP structure for the socket server
- `Room` class — holds participants, playback state, chat history buffer, broadcast methods
- `Participant` class — socket reference, role, user metadata
- `RoleManager` — encapsulates the permission matrix and validation logic
- `MessageHandler` — routes incoming socket events to the right handler, keeping `sockets/events/*` thin

### 7.6 Scalability
- Socket.IO Redis adapter for cross-instance broadcast (needed the moment you run more than one server instance).
- Design (even if not load-tested) for the PDF's target: 1,000+ concurrent users, 100+ rooms, 50+ users/room — document this reasoning in the architecture overview rather than needing to prove it live.

---

## 8. SEO & Production Hygiene Checklist

- Custom 404 page (no framework default)
- Unique `<title>` and meta description per route
- Canonical tags
- Unique `<h1>` per page
- `sitemap.xml`, `robots.txt`, `llms.txt`
- Favicon (derived from `logo.png`)
- Social share image (OG image) for the landing page
- Structured data (Organization/Product schema, without mentioning Web3task)
- Alt text on every image, including preset avatars
- Internal links between Home/About/Contact and breadcrumbs where nested
- No console errors in production build
- No source maps shipped in production
- Strip framework fingerprints from build output (no default Vite/React dev banners, no `X-Powered-By` header on Express)
- No placeholder/lorem-ipsum text anywhere in the final build

---

## 9. Confidentiality Rule

**No mention of "Web3task" anywhere in the live application** — not in copy, metadata, comments visible to users, or commit messages that could be public-facing. It's fine only in this internal planning doc and the developer-facing README section, per your instruction.

---

## 10. Git & Deployment

- `.gitignore`: `node_modules`, `.env*`, `dist`, `build`, `.vercel`, `.turbo`, editor files
- Commit messages: **max 3 words**, imperative (e.g. `add room sync`, `fix role bug`, `wire redis adapter`)
- Push **per completed feature**, not one giant final commit
- `README.md`: setup instructions, env var list (names only, no real secrets), local run steps, live URLs, architecture summary
- Env vars needed (names, not values): `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `CLIENT_URL`, `SERVER_URL`
- Deploy: client → Vercel; server (Express + Socket.IO) → Render (needs a platform with persistent WebSocket support, which rules out plain Vercel serverless for the backend); Postgres → Neon or Supabase free tier; Redis → Upstash free tier
- Confirm current free-tier limits on each provider at signup time — they change.

---

## 11. Suggested Build Order (execution sequencing only — not a smaller product)

1. Monorepo scaffold, Prisma schema, auth (register/OTP/login), design tokens
2. Room create/join, base Socket.IO wiring, playback sync (play/pause/seek/change video)
3. Role system end-to-end (assign, remove, visibility filtering, server-side enforcement)
4. Chat + reactions + request-control flow
5. Profile, About, Contact, landing polish, animation pass
6. SEO/production hygiene checklist, deployment, README, final QA pass on mobile + desktop

---

## 12. Things Explicitly Out of Scope for Research (flagged, not fabricated)

A few resources in your original link list (kexsio.com, uisfx.com, tasteskill.dev, rareui.com, scrolltide.co, `pbakaus/impeccable`, `dashersw/liquid-glass-js`, `ruucm/shadergradient`, `collidingScopes/liquid-logo`, `emilkowalski/skills`) are niche/fast-moving design or animation resources. Treat them as visual inspiration or optional component sources — Antigravity should check each one's current README/install instructions itself before depending on it, rather than this document asserting exact current APIs it hasn't verified.
