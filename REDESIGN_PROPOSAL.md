# Farmly Market-Linkage Platform — Redesign Proposal

## Overview
Transform from a landing page into a role-based SaaS application (Farmer/FPO vs Buyer) with price discovery, lot management, and AI-powered matching, while extending the existing data-driven component pattern.

---

## Part 1: Component & File Structure

### New Folder Structure
```
src/
├── App.jsx                          # Router/role switcher
├── index.css                        # Extend with new component styles
├── main.jsx                         # (unchanged)
│
├── components/
│   ├── common/
│   │   ├── Reveal.jsx              # (extract from App.jsx)
│   │   ├── Header.jsx              # Shared nav/user profile
│   │   ├── LanguageToggle.jsx       # Language selector (EN/HI/MR labels)
│   │   ├── Button.jsx              # Reusable button component
│   │   └── LoadingSpinner.jsx       # Skeleton loaders
│   │
│   ├── onboarding/
│   │   ├── RoleSelection.jsx        # Farmer vs Buyer choice (with icons)
│   │   └── ProfileSetup.jsx         # Name, location, crop/buyer type
│   │
│   ├── farmer/
│   │   ├── FarmerDashboard.jsx      # Main dashboard layout
│   │   ├── PriceDiscovery.jsx       # Price chart + mandi data
│   │   ├── SaleWindowRecommendation.jsx  # AI suggestion card
│   │   ├── LotCreationFlow.jsx      # Multi-step form (quantity, quality, location, date)
│   │   ├── QualityGradingCard.jsx   # Photo upload + grade selector
│   │   ├── MyLotsPanel.jsx          # List of user's lots
│   │   ├── LotsIncomingOffers.jsx   # Offers per lot, buyer info, trust score
│   │   ├── LogisticsStorageCard.jsx # Storage options + transport cost
│   │   ├── PaymentTracking.jsx      # Timeline view of transaction status
│   │   └── DisputeFlow.jsx          # Grievance creation & tracking
│   │
│   ├── buyer/
│   │   ├── BuyerDashboard.jsx       # Main dashboard layout
│   │   ├── BrowseAndFilter.jsx      # Lot search (crop, quality, qty, radius, readiness)
│   │   ├── DemandMatching.jsx       # AI-ranked lot suggestions
│   │   ├── VerifiedBuyerProfile.jsx # Trust score, past transactions
│   │   ├── MakeOfferFlow.jsx        # Form to propose price + terms
│   │   ├── BulkAggregateView.jsx    # Multiple lots from same area
│   │   ├── BuyerLotsPanel.jsx       # Offers made + response status
│   │   └── BuyerPaymentTracking.jsx # Commitment tracking
│   │
│   └── ai/
│       ├── NLQueryAssistant.jsx      # Chat-like interface ("When should I sell?")
│       └── AIInsights.jsx             # Forecast + trend cards
│
├── hooks/
│   ├── useLanguage.js               # i18n hook (English/Hindi/Marathi strings)
│   ├── useMockData.js               # Generate/manage mock data
│   ├── useUser.js                   # Current user context (role, profile)
│   └── useResponsive.js             # Mobile/tablet/desktop detection
│
├── data/
│   ├── mockLots.js                  # Sample lots data
│   ├── mockOffers.js                # Sample offers data
│   ├── mockBuyers.js                # Sample buyer profiles
│   ├── mockPrices.js                # Mandi prices & trends per crop/region
│   ├── mockForecasts.js             # AI forecast mock (price trends, sale windows)
│   └── mockTransactions.js          # Sample payment/dispute data
│
├── utils/
│   ├── priceCalculations.js         # Net realization, cost breakdowns
│   ├── aiMocks.js                   # Mock AI functions (forecast, matching, NLP)
│   ├── distances.js                 # Simple distance/radius filtering
│   └── dateFormatting.js            # Locale-aware date display
│
└── styles/
    ├── variables.css                # (merged into index.css)
    └── animations.css               # (merged into index.css)
```

### Top-Level State Flow
```
App (role, user context)
├── Onboarding (if new)
│   └── RoleSelection → ProfileSetup
└── Dashboard (based on role)
    ├── FarmerDashboard (if farmer/FPO)
    │   ├── Header (user profile, language toggle, logout)
    │   ├── PriceDiscovery
    │   ├── SaleWindowRecommendation
    │   ├── LotCreationFlow (modal or stepper)
    │   ├── MyLotsPanel (interactive list)
    │   ├── LotsIncomingOffers
    │   ├── LogisticsStorageCard
    │   ├── PaymentTracking
    │   ├── DisputeFlow (modal)
    │   └── NLQueryAssistant (bottom-right chat bubble)
    │
    └── BuyerDashboard (if buyer)
        ├── Header (user profile, language toggle, logout)
        ├── DemandMatching
        ├── BrowseAndFilter
        ├── BulkAggregateView
        ├── BuyerLotsPanel
        ├── MakeOfferFlow (modal)
        ├── BuyerPaymentTracking
        ├── VerifiedBuyerProfile
        └── AIInsights
```

---

## Part 2: Mock Data Shapes

### Core Entity: Lot (Farmer/FPO aggregated produce)
```javascript
const mockLot = {
  id: "LOT-2025-0847",
  farmerId: "FARMER-001",
  fpoId: null,  // null if individual farmer, "FPO-123" if aggregated
  cropName: "Soybean",
  cropCode: "SOY",
  quantity: {
    value: 15,
    unit: "quintal"  // or "kg", "ton"
  },
  qualityGrade: "A",  // A, B, C (self-declared or photo-graded)
  photoUrl: "https://...",  // Quality verification photo
  location: {
    village: "Pimpalner",
    district: "Beed",
    state: "Maharashtra",
    lat: 19.1234,
    lng: 75.5678
  },
  harvestDate: "2025-09-08",
  readyDate: "2025-09-12",  // When produce is ready to sell
  currentStatus: "listed",  // "draft", "listed", "offer-received", "sold", "disputed"
  createdAt: "2025-09-06T10:30:00Z",
  
  // Multiple farmer aggregation (for FPOs)
  contributors: [
    {
      farmerId: "FARMER-001",
      quantity: { value: 5, unit: "quintal" },
      contactPerson: "Ramesh Kumar"
    },
    {
      farmerId: "FARMER-002",
      quantity: { value: 10, unit: "quintal" },
      contactPerson: "Savitri Devi"
    }
  ]
};
```

### Core Entity: Offer (Buyer's proposal to farmer)
```javascript
const mockOffer = {
  id: "OFFER-2025-1234",
  lotId: "LOT-2025-0847",
  buyerId: "BUYER-001",
  pricePerUnit: 2850,  // ₹/quintal
  currency: "INR",
  quantity: {
    value: 15,
    unit: "quintal"
  },
  pickupLocation: "Buyer warehouse, Parbhani",
  pickupDeadline: "2025-09-15",
  paymentTerms: {
    type: "immediate",  // "immediate", "7-days", "15-days", "advance-30"
    percentAdvance: 0
  },
  proposedAt: "2025-09-07T09:15:00Z",
  expiresAt: "2025-09-09T09:15:00Z",
  status: "pending",  // "pending", "accepted", "rejected", "expired", "completed"
  
  // Net realization breakdown for farmer
  expectedCosts: {
    transport: 120,
    qualityVerification: 50,
    aggregationIfFPO: 75,
    paymentDelay: 40
  }
};
```

### Core Entity: Buyer Profile
```javascript
const mockBuyer = {
  id: "BUYER-001",
  companyName: "AgroTrade Processors",
  registeredName: "Anil Kumar",
  profileType: "processor",  // "processor", "trader", "institutional", "exporter"
  location: {
    village: "Parbhani",
    district: "Parbhani",
    state: "Maharashtra"
  },
  
  // Trust metrics
  trustMetrics: {
    pastTransactions: 187,
    completedSuccessfully: 185,
    averageRating: 4.7,
    averagePaymentDays: 1.2,
    disputesResolved: 2,
    onTimeDelivery: 98.4  // %
  },
  
  // Buyer's typical purchase pattern
  purchasePattern: {
    preferredCrops: ["Soybean", "Jowar", "Cotton"],
    avgVolumePerMonth: 500,  // quintals
    qualityRequirements: "A-grade preferred, B acceptable",
    preferredDistricts: ["Beed", "Parbhani", "Aurangabad"]
  },
  
  credentials: {
    licenseNumber: "AGRO-MH-2024-001",
    verifiedAt: "2024-01-15",
    bankAccount: "XXXXXXXX9876"
  },
  
  profileStatus: "verified"
};
```

### Core Entity: Price Data (Mandi/Market Rates)
```javascript
const mockMarketPrice = {
  cropCode: "SOY",
  cropName: "Soybean",
  date: "2025-09-07",
  
  // Mandi prices across nearby markets
  mandiPrices: [
    {
      mandiCode: "BEED-MANDI",
      mandiName: "Beed Agricultural Mandi",
      district: "Beed",
      price: 2450,
      quantity: 450,  // quintals traded
      highPrice: 2480,
      lowPrice: 2420,
      timeUpdated: "2025-09-07T14:00:00Z"
    },
    {
      mandiCode: "PARBHANI-MANDI",
      mandiName: "Parbhani Market Yard",
      district: "Parbhani",
      price: 2480,
      quantity: 320,
      highPrice: 2520,
      lowPrice: 2450,
      timeUpdated: "2025-09-07T13:45:00Z"
    }
  ],
  
  // Direct digital offers (current live offers)
  digitalOffers: [
    { buyerId: "BUYER-001", price: 2650, quantity: 15 },
    { buyerId: "BUYER-003", price: 2580, quantity: 25 }
  ],
  
  // Processing/institutional buyer typical rates
  processorRates: {
    qualityA: 2700,
    qualityB: 2500,
    qualityC: 2300
  },
  
  // Price trend (past 7 days)
  trend7Days: [
    { date: "2025-09-01", avgPrice: 2350 },
    { date: "2025-09-02", avgPrice: 2380 },
    { date: "2025-09-03", avgPrice: 2410 },
    { date: "2025-09-04", avgPrice: 2390 },
    { date: "2025-09-05", avgPrice: 2420 },
    { date: "2025-09-06", avgPrice: 2440 },
    { date: "2025-09-07", avgPrice: 2450 }
  ]
};
```

### AI Feature: Forecast & Recommendation
```javascript
const mockAIForecast = {
  cropCode: "SOY",
  district: "Beed",
  generatedAt: "2025-09-07T15:00:00Z",
  
  // 14-day price forecast (mock; would be from ML model)
  forecast14Days: [
    { date: "2025-09-08", predictedPrice: 2465, confidence: 0.82 },
    { date: "2025-09-09", predictedPrice: 2480, confidence: 0.78 },
    { date: "2025-09-10", predictedPrice: 2510, confidence: 0.75 },
    { date: "2025-09-11", predictedPrice: 2540, confidence: 0.72 },
    { date: "2025-09-12", predictedPrice: 2550, confidence: 0.70 },
    { date: "2025-09-13", predictedPrice: 2520, confidence: 0.68 },
    { date: "2025-09-14", predictedPrice: 2480, confidence: 0.65 }
  ],
  
  // Farmer sale-window recommendation
  recommendation: {
    action: "hold",  // "sell-now", "hold", "sell-in-3-days"
    rationale: "Price expected to peak on Sept 12. Your storage permits holding 5 more days.",
    bestsellDate: "2025-09-12",
    expectedPriceAtBestDate: 2550,
    currentPrice: 2450,
    potentialGain: "₹1,500 per quintal for 15 quintals",
    storageConstraint: "5 days max before quality degrades"
  },
  
  // Buyer demand matching (surfaces high-match lots)
  buyerDemandMatches: [
    {
      buyerId: "BUYER-001",
      relevanceScore: 0.94,  // 0-1
      reason: "Typically buys A-grade soybean, 500+ qtl/month, Beed district focus"
    },
    {
      buyerId: "BUYER-003",
      relevanceScore: 0.72,
      reason: "Seasonal buyer, prefers B-grade, good payment terms"
    }
  ]
};
```

### Core Entity: Transaction & Payment Tracking
```javascript
const mockTransaction = {
  id: "TXN-2025-5678",
  offerId: "OFFER-2025-1234",
  lotId: "LOT-2025-0847",
  farmerId: "FARMER-001",
  buyerId: "BUYER-001",
  transactionDate: "2025-09-10T10:00:00Z",
  
  // Timeline of status updates
  timeline: [
    {
      event: "offer_accepted",
      timestamp: "2025-09-10T10:00:00Z",
      description: "Farmer accepted buyer's offer"
    },
    {
      event: "advance_paid",
      timestamp: "2025-09-10T14:30:00Z",
      amount: 42750,  // 30% advance
      status: "completed",
      description: "30% advance received"
    },
    {
      event: "pickup_scheduled",
      timestamp: "2025-09-12T08:00:00Z",
      description: "Buyer scheduled pickup"
    },
    {
      event: "delivery_completed",
      timestamp: "2025-09-13T16:45:00Z",
      actualQuantity: 14.8,  // Minor loss to wastage
      description: "Produce delivered, inspected, accepted"
    },
    {
      event: "final_payment_pending",
      timestamp: "2025-09-13T17:00:00Z",
      remainingAmount: 99450,  // 70% balance
      dueDate: "2025-09-15",
      status: "pending",
      description: "Awaiting final payment"
    }
  ],
  
  // Overall transaction status
  status: "in-progress",  // "pending", "in-progress", "completed", "disputed"
  totalAmount: 142200,  // ₹2850 × 14.8 + adjustments
  advancePaid: 42750,
  balanceDue: 99450,
  disputeId: null
};
```

### Core Entity: Dispute/Grievance
```javascript
const mockDispute = {
  id: "DISPUTE-2025-0001",
  transactionId: "TXN-2025-5678",
  createdBy: "FARMER-001",  // farmerId or buyerId
  createdAt: "2025-09-14T10:00:00Z",
  issueType: "quality_mismatch",  // "quality_mismatch", "payment_delay", "weight_discrepancy", "other"
  description: "Buyer rejected 200kg claiming quality degradation. My photo shows it was A-grade on delivery.",
  attachments: [
    { type: "image", url: "https://.../dispute-photo-1.jpg", timestamp: "2025-09-13T16:45:00Z" },
    { type: "image", url: "https://.../dispute-photo-2.jpg", timestamp: "2025-09-13T16:46:00Z" }
  ],
  
  // Resolution timeline
  resolutionTimeline: [
    { event: "dispute_filed", timestamp: "2025-09-14T10:00:00Z", actor: "farmer", note: "Initial complaint" },
    { event: "buyer_response", timestamp: "2025-09-14T15:30:00Z", actor: "buyer", note: "Buyer's counter-evidence and explanation" },
    { event: "resolution_proposed", timestamp: "2025-09-15T10:00:00Z", actor: "admin", note: "Mediation suggested: buyer accepts 50% of disputed quantity" },
    { event: "farmer_accepted", timestamp: "2025-09-15T11:15:00Z", actor: "farmer", note: "Settlement agreed" }
  ],
  
  status: "resolved",  // "filed", "awaiting-response", "mediation", "resolved", "escalated"
  resolution: {
    action: "partial_refund",
    amount: 7410,  // ₹2850 × 2.6 (50% of disputed 5.2 qtl)
    description: "Buyer refunding 50% of disputed quantity value"
  }
};
```

---

## Part 3: Styling Extensions

The existing color palette (`--green-deep`, `--gold`, `--mist`, etc.) will be retained and extended with:

### New CSS Variables
```css
:root {
  /* Existing */
  --green-deep: #143528;
  --green: #1f4d3a;
  --green-mid: #2f6b4f;
  --gold: #e6b84a;
  --gold-soft: #f0d48a;
  --mist: #eef3ef;
  --paper: #f7f8f4;
  --ink: #14201a;
  --ink-soft: #3d4f45;
  --line: rgba(20, 53, 40, 0.14);
  
  /* New dashboard-specific */
  --success: #2d7d5a;      /* Approval, accepted status */
  --warning: #d97706;      /* Attention, pending status */
  --alert: #b42e1a;        /* Error, rejected status */
  --info: #0369a1;         /* Neutral, info status */
  --shadow-md: 0 10px 25px rgba(20, 53, 40, 0.08);
  --shadow-lg: 0 20px 40px rgba(20, 53, 40, 0.1);
  --transition-smooth: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### New Component Styles (to be added to index.css)
- Dashboard layout (sidebar/top nav for mobile)
- Card components (layered, with real depth)
- Form inputs (accessible, large tap targets, mobile-friendly)
- Status badges (color-coded)
- Timeline UI (payment/dispute tracking)
- Modal overlays
- Chat bubble for AI assistant
- Responsive grid for lot/offer listings

---

## Part 4: Implementation Roadmap

### Stage 1: Farmer Side (Foundation)
1. Onboarding (role selection + profile setup)
2. FarmerDashboard layout + Header
3. PriceDiscovery (mandi rates + 7-day trend chart)
4. SaleWindowRecommendation (static AI card)
5. LotCreationFlow (form stepper)
6. MyLotsPanel (list view)
7. LotsIncomingOffers (buyer list per lot)
8. Mock data wiring

**Deliverable:** Full farmer flow end-to-end (create lot → see offers → view prices)

### Stage 2: Buyer Side (Parallel Complexity)
1. BuyerDashboard layout + Header
2. BrowseAndFilter (crop, quality, quantity, radius, date filters)
3. VerifiedBuyerProfile (trust metrics + past transactions)
4. MakeOfferFlow (form to propose price + terms)
5. BuyerLotsPanel (active offers)
6. BulkAggregateView (multiple lots grouped by area)

**Deliverable:** Full buyer flow (search lots → make offer → track)

### Stage 3: AI & Advanced Features (Polish)
1. AIInsights (14-day forecast + recommendation cards)
2. NLQueryAssistant (chat interface, mock NLP responses)
3. PaymentTracking (timeline UI for both roles)
4. DisputeFlow (grievance modal + timeline)
5. LogisticsStorageCard (optional: storage facility integration)
6. Language toggle (UI strings for EN/HI/MR)

**Deliverable:** Full platform with AI, disputes, and multilingual UI placeholders

---

## Questions for Your Approval

1. **Data scale for mocks:** Should initial mocks show ~10 lots, ~50 buyers, ~5 crops? (Can start small and scale up.)
2. **AI confidence:** Should forecasts show confidence intervals (0–1) and caveats for user education?
3. **Dispute resolution:** Should resolution be farmer + buyer + admin mediation, or simpler?
4. **Mobile-first nav:** Hamburger menu + bottom tab bar, or sticky top nav with collapsible sections?
5. **Language toggle:** Just labels (EN/HI/MR strings in JSON), or full i18n setup?

---

## Next Steps (Awaiting Your Go-Ahead)

Once you approve:
1. We lock in this structure and data shapes.
2. Create mock data files (`mockLots.js`, `mockBuyers.js`, etc.).
3. Begin **Stage 1: Farmer Side** implementation.
4. You review each stage before moving to the next.

**Ready to proceed?**
