# Farmly — SIH 2026 Build Plan

**Problem ID:** SIH26132 — Strengthening market linkages and price discovery for farmers  
**Organization:** Government of Maharashtra / MSInS  
**Product:** Farmly   

---

## 1. One-line pitch

Farmly helps farmers and FPOs answer: **“Based on my crop, quantity, quality, and location, where and to whom should I sell for the best expected net realisation?”**

Not just mandi rates — **price discovery + verified buyer match + logistics + payment trust + AI advice**.

---

## 2. Core problem (jury summary)

| Pain | Effect |
|------|--------|
| Fragmented prices across mandis, processors, institutional buyers | Weak bargaining power |
| Quality specs & demand scattered | Mismatch / rejection risk |
| Transport, storage, payment reliability ignored | Gross price looks good; **net** is poor |
| Distress sale after harvest | Liquidity + no sale-window guidance |
| FPOs struggle to aggregate consistent volume | Buyers cannot source reliably |

**Outcome goal:** higher farmer realisation, less information asymmetry, stronger FPO aggregation, transparent transaction trail.

---

## 3. Key requirements (mapped to SIH)

1. Aggregate mandi / channel prices + localised trends  
2. Sale-window recommendations  
3. Buyer demand + quality requirements  
4. Verified buyer matching  
5. Lot creation + quality grading  
6. Digital offers + **ENR (Expected Net Realisation) comparison**  
7. FPO lot aggregation  
8. Logistics / storage options  
9. Payment tracking  
10. Grievance / dispute support  
11. Multilingual (EN / HI / MR) for Maharashtra  

---

## 4. Target architecture (no Supabase dependency)

```text
React (Vite)  ──REST/WS──►  FastAPI (Python)
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
               PostgreSQL    ML layer    Chat + Voice
               (own DB)      forecast    Whisper / RAG
```

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React + Vite + Three.js | Already in repo |
| Backend | **Python FastAPI** | Own APIs, JWT auth |
| DB | PostgreSQL (Docker) | Replace Supabase |
| ML | sklearn / Prophet | Price trend + sale window |
| Chat | RAG over Farmly docs + live prices | Marathi/Hindi/English |
| Voice | Whisper STT + TTS | Mic → same chat brain |
| Charts | 2D bars + **3D market surface** | Demo wow |

See `AI_CONTEXT.md` for module-level detail.

---

## 5. Expected Net Realisation (product brain)

```text
ENR = OfferPrice − Transport − Storage − Commission − QualityPenalty − PaymentRiskCost
```

Always rank options by **ENR**, not gross ₹/qtl. This is the differentiator for SIH26132.

---

## 6. Prototype scope (what to demo)

### P0 — must work live
- [x] Landing + role select (Farmer/FPO, Buyer)  
- [x] Price discovery list (Maharashtra sample)  
- [x] Lot create + offers  
- [ ] **ENR compare table** (gross vs net)  
- [ ] **3D / visual market charts**  
- [ ] AI sale-window + chat (mock → later FastAPI)  
- [ ] Own FastAPI + Postgres (migrate off Supabase)  

### P1 — premium
- [ ] FPO aggregation flow  
- [ ] Voice ask (STT → chat)  
- [ ] Payment timeline + grievance  
- [ ] Buyer trust badges  

### P2 — if time
- [ ] Real ML forecast artifact (`.pkl`)  
- [ ] Admin verification console  
- [ ] Docker Compose one-command demo  

---

## 7. Build phases

### Phase A — Docs + UX polish (now)
1. `SIH_PLAN.md` + `AI_CONTEXT.md`  
2. Frontend charts (3D surface + ENR bars)  
3. Stronger dashboard visual hierarchy  

### Phase B — Own backend
1. Docker Postgres + FastAPI scaffold  
2. Auth JWT (farmer / fpo / buyer / admin)  
3. Tables: users, market_prices, lots, offers, payments, grievances  
4. Point React `marketplaceApi` to `http://localhost:8000`  
5. Remove Supabase client dependency  

### Phase C — Intelligence
1. ENR + matching service  
2. Price forecast job / endpoint  
3. Chatbot with grounded answers from DB  
4. Voice endpoint  

### Phase D — Jury pack
1. 8-slide deck + 3-min demo script  
2. Seed Nashik/Beed onion–soybean story  
3. Marathi UI pass + offline demo mode  

---

## 8. Demo script (3 minutes)

1. Farmer (Beed soybean / Nashik onion) opens dashboard → sees mandi vs buyer prices.  
2. Show **3D market surface** + ENR ranking → best net option highlighted.  
3. Create lot → receive offers → accept with payment timeline.  
4. FPO aggregates 4 small lots → one buyer-ready lot.  
5. Ask AI (text/voice): “Should I sell today?” → sale-window answer with numbers.  
6. Close: transparent trail + Maharashtra multilingual support.

---

## 9. Team split (suggested)

| Role | Owns |
|------|------|
| Frontend | Dashboards, charts, i18n |
| Backend | FastAPI, Postgres, auth |
| ML/AI | Forecast, ENR, chatbot, voice |
| Data | MH mandi CSV seed |
| Design/Pitch | Deck, demo video, Marathi copy |

---

## 10. Success metrics (claim carefully)

- Better **net** realisation vs nearest mandi (show sample math on stage)  
- Faster buyer discovery for FPOs  
- Reduced “sell blindly after harvest” via sale-window  
- Full transaction audit trail for trust  

---

## 11. Immediate next actions

1. Keep iterating UI + charts in this repo.  
2. Scaffold `backend/` FastAPI (Phase B).  
3. Freeze one crop story (Soybean Beed **or** Onion Nashik) for the pitch.  
4. Fill idea submission form before **20 Sep 2026**.  

**Reference docs:** `guide.md` (product purpose), `AI_CONTEXT.md` (architecture for builders/agents).
