export default function LandingFooter({ footerText, onRegister }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#071611] text-farm-mist">
      <div className="relative mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <a href="#top" className="inline-block">
            <span className="text-2xl font-bold tracking-tight text-white">Farmly</span>
            <small className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-farm-gold/90">
              Market linkages
            </small>
          </a>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{footerText}</p>
          <button
            type="button"
            onClick={onRegister}
            className="mt-4 rounded-full bg-farm-gold px-4 py-2 text-sm font-semibold text-farm-ink transition hover:-translate-y-0.5"
          >
            Start selling smarter ↗
          </button>
        </div>

        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/40">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><a className="transition hover:text-farm-gold" href="#market-pulse">Price discovery</a></li>
            <li><a className="transition hover:text-farm-gold" href="#features">For farmers & buyers</a></li>
            <li><a className="transition hover:text-farm-gold" href="#how-it-works">How it works</a></li>
            <li><a className="transition hover:text-farm-gold" href="#ai-coach">AI coach</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/40">Maharashtra first</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>ENR net realisation</li>
            <li>Verified buyer matching</li>
            <li>FPO lot aggregation</li>
            <li>EN · हिं · मर</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/8">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-3 text-[0.7rem] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Farmly · SIH26132 prototype</span>
          <span>Transparent farm-gate to buyer trade</span>
        </div>
      </div>
    </footer>
  )
}
