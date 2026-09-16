# Zync — Watch Together, Perfectly In Sync

> A modern real-time collaborative watch-party platform where friends create rooms, drop any YouTube link, and watch with synchronized playback, granular roles, live chat, and reactions.

![Zync Preview](logo.png)

---

## Features

- **Sub-Second Playback Synchronization**: Flawless play, pause, seek, and video changes with periodic drift correction to guarantee everyone watches the exact same frame.
- **Granular Role-Based Access Control (RBAC)**:
  - **Host**: Full control over playback, room settings, participant management, and host transfers.
  - **Moderator**: Can control playback, chat, and react.
  - **Participant**: Can request playback control, chat, and react.
  - **Viewer**: Watch-only spectator (chat and playback controls restricted).
- **Server-Side Enforcement & Role Filtering**:
  - Every action is strictly validated on the server.
  - Sockets only receive participant metadata and chat events permitted by their role (Viewers cannot see other Viewers or Participants; non-Viewers receive live chat).
- **Live Chat & YouTube-Style Floating Reactions**: Real-time messaging with timestamping, along with floating emoji reactions rising along the player's edge.
- **Interactive Reactive Mascot**: SVG mascot that reacts to typing, covers its eyes during password entry, and celebrates upon successful verification.
- **10 Distinct Geometric Preset Avatars**: High-contrast, brand-tuned SVG silhouettes (`Comet`, `Nova`, `Drift`, `Pulse`, `Glint`, `Halo`, `Ember`, `Wisp`, `Prism`, `Orbit`).
- **Transactional OTP Authentication**: 6-digit verification codes sent via Brevo with 10-minute expiry and 60-second cooldown stored ephemerally in Redis.
- **One-Time Username Customization**: Strict enforcement permitting only one permanent username change per account.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Fast dev loop, responsive SPA |
| **Styling** | Tailwind CSS | Consistent dark theme sampled from brand mark |
| **Real-time** | Socket.IO | Bidirectional event streaming and room clustering |
| **Backend** | Node.js, Express, TypeScript | REST APIs and OOP WebSocket server |
| **Database** | PostgreSQL (Prisma ORM) | Relational persistence for users and rooms |
| **Cache & Pub/Sub** | Redis (Upstash) | Ephemeral OTP storage and multi-instance adapter |
| **Email** | Brevo API | Transactional OTP and contact form submissions |
| **Player** | YouTube IFrame Player API | Video embedding and programmatic sync |

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│                      Client                            │
│  (React 18 + Vite + Zustand + YouTube IFrame API)      │
└──────────────────────────┬─────────────────────────────┘
                           │ WebSocket / HTTP
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Express Server                       │
│    ├── Modules: Auth, Rooms, Users, Contact            │
│    └── OOP Socket.IO Server                            │
│         ├── MessageHandler (Event Dispatcher)          │
│         ├── RoleManager (Permission Guards)            │
│         ├── Room (Playback State, Chat Ring Buffer)    │
│         └── Participant (Socket & Identity)            │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│     PostgreSQL (DB)     │    │       Redis Cache       │
│  (Prisma ORM: Users,    │    │ (Upstash: OTP TTL,      │
│   Rooms, History)       │    │  Socket.IO Adapter)     │
└─────────────────────────┘    └─────────────────────────┘
```

---

## Environment Variables

Create a `.env` file in the project root or configure the following environment variables in your deployment environments:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, or local) |
| `REDIS_URL` | Redis connection URI (Upstash or local) |
| `JWT_ACCESS_SECRET` | Secret key for signing short-lived access tokens |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `BREVO_API_KEY` | Brevo API key for transactional emails |
| `BREVO_SENDER_EMAIL` | Verified sender email address |
| `CLIENT_URL` | Client application origin URL (e.g. `http://localhost:3000`) |
| `SERVER_URL` | Server URL for API and WebSockets |
| `PORT` | Server listening port (default `5000`) |

*(Note: In local development, if `REDIS_URL` or `BREVO_API_KEY` are omitted, the server operates with simulated in-memory caching and console email logging.)*

---

## Local Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/VaibhavSoni24/ZYNC.git
cd ZYNC
npm install
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate --workspace=@zync/server
```

### 3. Start Development Servers
Start both client and server in parallel:
```bash
npm run dev
```

Alternatively, run them separately:
```bash
# Terminal 1: Backend API & Socket Server (port 5000)
npm run dev:server

# Terminal 2: Frontend Client (port 3000)
npm run dev:client
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Tests & Typechecks

```bash
# Run unit & integration test suite
npm run test

# Typecheck all packages
npm run typecheck

# Production build test
npm run build
```

---

## Deployment Guide

### 1. Frontend (Vercel)
1. Push your repository to GitHub.
2. Import project into Vercel with root directory set to `apps/client`.
3. Set Framework Preset to **Vite**.
4. Configure environment variable:
   - `VITE_SERVER_URL`: Your Render server URL (e.g. `https://zync-server.onrender.com`).

### 2. Backend Server (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository: `https://github.com/VaibhavSoni24/ZYNC`.
3. Configure settings:
   - **Root Directory**: leave empty (root)
   - **Build Command**: `npm install && npm run build:shared && npm run build:server`
   - **Start Command**: `npm run start --workspace=@zync/server`
4. Add environment variables:
   - `DATABASE_URL`: your Neon or Supabase PostgreSQL connection string
   - `CLIENT_URL`: `https://zync-watch-party.vercel.app`
   - `JWT_ACCESS_SECRET`: `zync-access-super-secret-key-production-2026`
   - `JWT_REFRESH_SECRET`: `zync-refresh-super-secret-key-production-2026`
   - `BREVO_API_KEY`: *(optional, from Brevo)*
   - `BREVO_SENDER_EMAIL`: *(your sender email)*
   - `REDIS_URL`: *(optional, from Upstash)*

### 3. Database & Cache
- **PostgreSQL**: Hosted on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
- **Redis**: Hosted on [Upstash](https://upstash.com).

---

## Live Deployment

- **Client (Live)**: [https://zync-watch-party.vercel.app](https://zync-watch-party.vercel.app)
- **Server (Live)**: [https://zync-server-zt02.onrender.com](https://zync-server-zt02.onrender.com)

---

## License & Credits

Designed and developed by **Vaibhav Soni**.
Distributed under the MIT License.
