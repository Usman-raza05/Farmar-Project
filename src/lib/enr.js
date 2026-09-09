/** Expected Net Realisation helpers — see AI_CONTEXT.md */

export function calcEnr({
  price = 0,
  transport = 0,
  storage = 0,
  commission = 0,
  qualityPenalty = 0,
  paymentRisk = 0,
} = {}) {
  return Math.round(price - transport - storage - commission - qualityPenalty - paymentRisk)
}

export const CHANNEL_COMPARE = [
  {
    id: 'beed',
    label: 'Beed Mandi',
    channel: 'Mandi',
    price: 2450,
    transport: 40,
    storage: 0,
    commission: 60,
    qualityPenalty: 20,
    paymentRisk: 45,
  },
  {
    id: 'parbhani',
    label: 'Parbhani Yard',
    channel: 'Mandi',
    price: 2480,
    transport: 95,
    storage: 0,
    commission: 55,
    qualityPenalty: 15,
    paymentRisk: 40,
  },
  {
    id: 'processor',
    label: 'AgroTrade Processor',
    channel: 'Processor',
    price: 2680,
    transport: 120,
    storage: 75,
    commission: 0,
    qualityPenalty: 0,
    paymentRisk: 15,
  },
  {
    id: 'digital',
    label: 'Digital trade desk',
    channel: 'Digital',
    price: 2615,
    transport: 110,
    storage: 50,
    commission: 25,
    qualityPenalty: 10,
    paymentRisk: 25,
  },
  {
    id: 'institutional',
    label: 'Institutional buyer',
    channel: 'Institutional',
    price: 2590,
    transport: 130,
    storage: 40,
    commission: 0,
    qualityPenalty: 5,
    paymentRisk: 10,
  },
]

export function rankChannels(channels = CHANNEL_COMPARE) {
  return channels
    .map((row) => {
      const enr = calcEnr(row)
      return {
        ...row,
        enr,
        costs: row.transport + row.storage + row.commission + row.qualityPenalty + row.paymentRisk,
      }
    })
    .sort((a, b) => b.enr - a.enr)
    .map((row, index) => ({ ...row, rank: index + 1 }))
}

/** Mandi × day × modal price (₹/qtl) for 3D surface — Soybean MH sample */
export const MARKET_SURFACE = {
  crop: 'Soybean',
  unit: '₹/qtl',
  mandis: ['Beed', 'Parbhani', 'Nanded', 'Latur', 'Nashik'],
  days: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Today'],
  // rows = mandis, cols = days
  grid: [
    [2380, 2395, 2410, 2420, 2435, 2440, 2450],
    [2400, 2415, 2430, 2445, 2460, 2470, 2480],
    [2360, 2370, 2385, 2390, 2395, 2400, 2405],
    [2410, 2425, 2440, 2455, 2470, 2485, 2495],
    [2350, 2365, 2380, 2395, 2410, 2425, 2440],
  ],
}
