import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Lock, Sparkles, Globe2, HeartHandshake } from 'lucide-react';

export default function About() {
  const pillars = [
    { icon: ShieldCheck, title: 'Verified providers only', text: 'Every provider passes KYB checks and carries a transparent trust score built from verification, regulatory status, review volume and complaint history.' },
    { icon: Scale, title: 'Impartial by design', text: 'We surface all matching products and label sponsored placements clearly. How we earn — affiliate commissions, subscriptions, featured listings — is disclosed.' },
    { icon: Sparkles, title: 'Explainable AI', text: 'Recommendations and eligibility scores always come with plain-English reasons. Estimates are guidance, never automated decisions.' },
    { icon: Lock, title: 'Security & privacy', text: 'MFA, JWT, OAuth, encryption at rest and in transit, audit logs, rate limiting and fraud detection. GDPR & CCPA compliant with regional data handling.' },
    { icon: Globe2, title: 'Global, localised', text: 'Multi-language and multi-currency throughout, with country-specific products and regulatory support baked in.' },
    { icon: HeartHandshake, title: 'Consumer protection', text: 'Scam and fraud warning indicators, responsible-lending guidance and a financial education hub help you decide with confidence.' },
  ];

  const compliance = ['GDPR', 'CCPA', 'KYC / KYB', 'PSD2-ready', 'SOC 2 (roadmap)', 'ISO 27001 (roadmap)'];

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-ink-50 dark:from-ink-900 dark:to-ink-900">
        <div className="container-app py-16 text-center sm:py-20">
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold text-ink-900 sm:text-5xl dark:text-white">
            Trust is the product
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 dark:text-ink-300">
            GlobalFundConnect exists to make the world's financial products comparable, understandable and safe — for everyone, everywhere.
          </p>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-ink-900 dark:text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-white py-16 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-app text-center">
          <h2 className="section-title">Compliance & standards</h2>
          <p className="mx-auto mt-2 max-w-2xl text-ink-500 dark:text-ink-400">
            Built to meet regulatory expectations across the markets we serve.
          </p>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {compliance.map((c) => (
              <span key={c} className="chip bg-brand-50 px-4 py-2 text-brand-700 dark:bg-ink-800 dark:text-brand-400">
                <ShieldCheck className="h-4 w-4" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-16 text-center">
        <h2 className="section-title">Ready to find your best fit?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/marketplace" className="btn-primary">Explore the marketplace</Link>
          <Link to="/advisor" className="btn-outline">Try the AI Advisor</Link>
        </div>
      </section>
    </div>
  );
}
