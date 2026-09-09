# Farmly — AI Context (simple)

Short context for builders and agents. Keep this file light.

---

## What is Farmly?

A platform that helps farmers and FPOs decide:

> **Where and to whom should I sell my produce for a better net price?**

Not only mandi rates — compare options with transport, storage, buyers, and offers.

**Hackathon:** SIH26132 · Maharashtra · market linkages & price discovery

---

## Main product idea

| Idea | Meaning |
|------|---------|
| **Price discovery** | Nearby mandi + buyer + processor rates |
| **ENR** | Expected net after costs (not just board price) |
| **Lots & offers** | Farmer lists produce; buyers send digital offers |
| **FPO aggregation** | Small lots → one bigger lot for buyers |
| **AI coach** | Simple advice: sell now or wait (mock OK for demo) |

**ENR (keep this rule everywhere):**

```text
ENR = price − transport − storage − commission − quality penalty − payment risk
```

Always rank by **ENR**, not gross ₹/qtl.

---

## What exists in this repo now

- React + Vite frontend (`src/App.jsx`)
- Landing page + Farmer / Buyer dashboards
- ENR compare chart + 3D market chart
- Multilingual UI: English / Hindi / Marathi
- Demo mode works without backend

Optional Supabase is temporary. Long-term: **own backend** (details later — not required in this file).

---

## Important files

| File | Use |
|------|-----|
| `guide.md` | Simple product story |
| `SIH_PLAN.md` | Hackathon build plan |
| `AI_CONTEXT.md` | This file |
| `src/lib/enr.js` | ENR numbers for charts |
| `src/components/charts/` | Price compare + 3D charts |

---

## Demo story (use this)

**Crop:** Soybean · **Place:** Beed, Maharashtra  

1. Show nearby prices  
2. Show ENR winner (best net option)  
3. Create lot → receive offer  
4. AI coach: “hold a few days” or “sell now” with clear numbers  

---

## Rules for any AI feature

1. Use real numbers from the app / mock tables — do not invent mandi rates.  
2. Prefer **net realisation** over gross price in answers.  
3. Reply in the user’s language (`en` / `hi` / `mr`).  
4. Demo answers should stay stable for jury practice.  

---

## Do not overload this file

Do **not** dump full ML stacks, Python training pipelines, or long API catalogs here.  
Those belong in `SIH_PLAN.md` when the team starts backend work.
