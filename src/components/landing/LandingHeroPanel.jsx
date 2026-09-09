/** Compact hero market board */
export default function LandingHeroPanel() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#0d241c]/92 p-4 shadow-xl backdrop-blur-md ml-auto">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#d4a017]">Live market board</p>
          <h3 className="mt-0.5 text-base font-semibold text-white">Soybean · Beed</h3>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-300">● Live</span>
      </div>

      <div className="space-y-1.5">
        {[
          { name: 'Beed Mandi', price: '₹2,450', change: '+1.8%', tone: 'normal' },
          { name: 'Parbhani Yard', price: '₹2,480', change: '+2.1%', tone: 'normal' },
          { name: 'AgroTrade Processor', price: '₹2,680', change: '+4.2%', tone: 'best' },
          { name: 'Digital trade', price: '₹2,615', change: '+3.5%', tone: 'normal' },
        ].map((row) => (
          <div
            key={row.name}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
              row.tone === 'best'
                ? 'border-[#d4a017]/45 bg-[#d4a017]/15'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div>
              <p className="text-[0.8rem] font-medium text-white">{row.name}</p>
              <p className="text-[0.65rem] text-white/45">{row.tone === 'best' ? 'Best net path' : 'Market rate'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{row.price}</p>
              <p className={`text-[0.65rem] font-semibold ${row.tone === 'best' ? 'text-[#d4a017]' : 'text-emerald-300'}`}>{row.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-[0.58rem] uppercase tracking-wide text-white/45">ENR winner</p>
          <p className="mt-0.5 text-sm font-semibold text-[#d4a017]">₹2,470/qtl</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-[0.58rem] uppercase tracking-wide text-white/45">Sale window</p>
          <p className="mt-0.5 text-sm font-semibold text-white">Hold 4 days</p>
        </div>
      </div>
    </div>
  )
}
