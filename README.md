# Farmly

Farmly is a premium market-linkage prototype for farmers, FPOs, and produce buyers. It combines nearby price discovery, transparent offers, lot matching, logistics, settlement tracking, and mock AI guidance in one workflow.

The app supports Supabase authentication and marketplace persistence when environment variables are configured. Without Supabase credentials it remains usable in demo mode with local mock data.

## Prerequisites

- [Node.js](https://nodejs.org/) **v18 or newer** (v20 recommended)
- **npm** (comes with Node.js)

Check your versions:

```bash
node -v
npm -v
```

## Setup

1. **Clone or open the project**

   ```bash
   cd Farmar-Project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   Visit the URL Vite prints in the terminal (usually [http://localhost:5173](http://localhost:5173)).

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy [`.env.example`](.env.example) to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project settings.
5. Restart the Vite server.

The database stores profiles, farmer lots, buyer offers, and market prices. The browser only uses the public Supabase anon key; row-level security policies in the schema protect writes by user role.

## Other commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start local development server with hot reload |
| `npm run build` | Build production assets into `dist/` |
| `npm run preview` | Preview the production build locally |

## Product flows

Choose a role from the opening screen:

- **Farmer / FPO:** compare mandi and buyer prices, create produce lots, review offers, view logistics and settlement status, and ask the market assistant for sale-window guidance.
- **Buyer:** filter available lots by crop, grade, volume, radius, and readiness; review demand-ranked matches; create digital offers; combine nearby supply; and track payment commitments.
- **Supabase layer:** persists profiles and farmer lots, with tables ready for offers and market prices.
- **Mock AI layer:** provides deterministic sale-window forecasts, demand-match scoring, and natural-language answers from local mock data. These functions are ready to be replaced with backend or model APIs.

## Project structure

```
Farmar-Project/
├── SIH_PLAN.md      # SIH26132 build plan, demo script, phases
├── AI_CONTEXT.md    # Architecture + ENR + API map for builders/agents
├── guide.md         # Product purpose (short)
├── public/
├── src/
│   ├── App.jsx
│   ├── components/charts/   # ENR compare + 3D market surface
│   ├── lib/                 # API + ENR helpers
│   ├── index.css
│   └── main.jsx
├── supabase/        # Legacy optional persistence (migrating to own FastAPI)
├── package.json
└── vite.config.js
```

## Stack notes

- **Tailwind CSS v4** via `@tailwindcss/vite` (`src/tailwind.css`)
- Fonts: **Outfit** (clean UI type)
- Existing CSS (`index.css`, `ui-refresh.css`) still powers dashboards

## Planning docs

- [`SIH_PLAN.md`](SIH_PLAN.md) — hackathon plan and prototype checklist  
- [`AI_CONTEXT.md`](AI_CONTEXT.md) — system architecture for AI/backend work  
- [`guide.md`](guide.md) — simple product narrative  

## Current implementation notes

- Demo mode is local to the browser session when Supabase is not configured.
- Farmer dashboard includes **ENR price compare** and a **3D mandi surface** chart.
- Target stack is **React + FastAPI + PostgreSQL** (own backend); Supabase is transitional.
- `npm run build` is the quickest production validation command.
