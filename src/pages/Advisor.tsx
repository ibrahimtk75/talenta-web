import { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { providerById } from '../data/providers';
import type { CategoryId, FinancialProduct } from '../lib/types';
import ProductCard from '../components/ProductCard';

interface Answers {
  goal: CategoryId | '';
  income: number;
  creditScore: number;
  priority: 'cost' | 'trust' | 'rating';
}

interface Scored { product: FinancialProduct; score: number; why: string[] }

function rank(a: Answers): Scored[] {
  const pool = PRODUCTS.filter((p) => (a.goal ? p.category === a.goal : true) && !p.flagged);
  return pool
    .map((product) => {
      const provider = providerById(product.providerId);
      const why: string[] = [];
      let score = 50;

      if (a.priority === 'cost' && product.rate != null) {
        score += Math.max(0, 30 - product.rate);
        why.push('Prioritised for lower cost.');
      }
      if (a.priority === 'trust' && provider) {
        score += (provider.trustScore - 60) * 0.6;
        why.push(`High provider trust (${provider.trustScore}/100).`);
      }
      if (a.priority === 'rating') {
        score += product.rating * 6;
        why.push(`Strongly rated by users (${product.rating.toFixed(1)}★).`);
      }
      if (product.minIncome == null || a.income >= product.minIncome) {
        score += 10;
        why.push('Your income fits the typical profile.');
      } else {
        score -= 15;
        why.push('Income may be below the typical minimum.');
      }
      if (product.minCreditScore == null || a.creditScore >= product.minCreditScore) {
        score += 8;
      } else {
        score -= 12;
        why.push('Credit score may be below requirement.');
      }
      if (provider?.verified) { score += 6; }

      return { product, score: Math.round(score), why: why.slice(0, 2) };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 3);
}

export default function Advisor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ goal: '', income: 40000, creditScore: 700, priority: 'trust' });
  const [results, setResults] = useState<Scored[] | null>(null);

  const steps = ['Your goal', 'Your profile', 'Your priority'];

  const finish = () => setResults(rank(answers));
  const reset = () => { setResults(null); setStep(0); };

  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip mx-auto mb-4 bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-brand-400">
          <Sparkles className="h-3.5 w-3.5" /> AI Advisor
        </span>
        <h1 className="section-title">Get matched in under a minute</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          Answer three quick questions. Every recommendation comes with plain-English reasons — and it's guidance, not a decision.
        </p>
      </div>

      {!results ? (
        <div className="mx-auto mt-10 max-w-xl">
          {/* progress */}
          <div className="mb-6 flex gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-ink-200 dark:bg-ink-700'}`} />
                <p className={`mt-1.5 text-xs ${i === step ? 'font-semibold text-brand-700 dark:text-brand-400' : 'text-ink-400'}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            {step === 0 && (
              <>
                <h3 className="mb-4 font-semibold text-ink-900 dark:text-white">What are you looking for?</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAnswers({ ...answers, goal: c.id })}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        answers.goal === c.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400'
                          : 'border-ink-200 text-ink-600 hover:border-brand-300 dark:border-ink-700 dark:text-ink-300'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="mb-4 font-semibold text-ink-900 dark:text-white">Tell us about you</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Annual income (USD)</label>
                    <input type="number" value={answers.income} onChange={(e) => setAnswers({ ...answers, income: Number(e.target.value) })} className="input" />
                  </div>
                  <div>
                    <label className="label">Credit score: <span className="font-bold text-brand-700 dark:text-brand-400">{answers.creditScore}</span></label>
                    <input type="range" min={300} max={850} value={answers.creditScore} onChange={(e) => setAnswers({ ...answers, creditScore: Number(e.target.value) })} className="w-full accent-brand-600" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="mb-4 font-semibold text-ink-900 dark:text-white">What matters most?</h3>
                <div className="space-y-2">
                  {([
                    { k: 'cost', label: 'Lowest cost', desc: 'Best rate / lowest fees' },
                    { k: 'trust', label: 'Most trusted provider', desc: 'Verification & track record' },
                    { k: 'rating', label: 'Best reviewed', desc: 'Highest user ratings' },
                  ] as const).map((o) => (
                    <button
                      key={o.k}
                      onClick={() => setAnswers({ ...answers, priority: o.k })}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                        answers.priority === o.k
                          ? 'border-brand-500 bg-brand-50 dark:bg-ink-900'
                          : 'border-ink-200 hover:border-brand-300 dark:border-ink-700'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink-900 dark:text-white">{o.label}</p>
                        <p className="text-xs text-ink-400">{o.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-ghost">Back</button>
              {step < 2 ? (
                <button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !answers.goal} className="btn-primary">Next</button>
              ) : (
                <button onClick={finish} className="btn-primary"><Sparkles className="h-4 w-4" /> See matches</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="section-title !text-2xl">Your top matches</h2>
            <button onClick={reset} className="btn-ghost"><RotateCcw className="h-4 w-4" /> Start over</button>
          </div>
          {results.length === 0 ? (
            <div className="card p-10 text-center text-ink-500">No suitable matches — try widening your goal.</div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {results.map(({ product, score, why }, i) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="chip bg-brand-600 text-white">#{i + 1} · {score} match</span>
                  </div>
                  <ProductCard product={product} />
                  <div className="rounded-xl bg-brand-50 p-3 text-xs text-brand-800 dark:bg-ink-800 dark:text-brand-300">
                    <p className="mb-1 font-semibold">Why we matched this:</p>
                    {why.map((w, j) => <p key={j}>• {w}</p>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
