import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, GitCompare } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES, categoryById } from '../data/categories';
import { providerById } from '../data/providers';
import ProductCard from '../components/ProductCard';
import CompareTray from '../components/CompareTray';

type SortKey = 'featured' | 'rate-asc' | 'rating-desc' | 'trust-desc';

export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') ?? '';
  const q = params.get('q') ?? '';

  const [search, setSearch] = useState(q);
  const [sort, setSort] = useState<SortKey>('featured');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hideFlagged, setHideFlagged] = useState(true);
  const [compare, setCompare] = useState<string[]>([]);

  const toggleCompare = (id: string) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));

  const setCat = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set('cat', id);
    else next.delete('cat');
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list = PRODUCTS.slice();
    if (cat) list = list.filter((p) => p.category === cat);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.summary.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s)) ||
          categoryById(p.category)?.name.toLowerCase().includes(s),
      );
    }
    if (verifiedOnly) list = list.filter((p) => providerById(p.providerId)?.verified);
    if (hideFlagged) list = list.filter((p) => !p.flagged);

    const trust = (id: string) => providerById(id)?.trustScore ?? 0;
    switch (sort) {
      case 'rate-asc':
        list.sort((a, b) => (a.rate ?? 1e9) - (b.rate ?? 1e9));
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'trust-desc':
        list.sort((a, b) => trust(b.providerId) - trust(a.providerId));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.sponsored) - Number(a.sponsored));
    }
    return list;
  }, [cat, search, sort, verifiedOnly, hideFlagged]);

  const activeCat = categoryById(cat);

  return (
    <div className="container-app py-10">
      <div className="mb-6">
        <h1 className="section-title">{activeCat ? activeCat.name : 'Marketplace'}</h1>
        <p className="mt-1 text-ink-500 dark:text-ink-400">
          {activeCat ? activeCat.tagline : 'Search and compare products across every category.'}
        </p>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCat('')}
          className={`chip px-3 py-1.5 ${!cat ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 shadow-card dark:bg-ink-800 dark:text-ink-300'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`chip px-3 py-1.5 ${cat === c.id ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 shadow-card dark:bg-ink-800 dark:text-ink-300'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 sm:flex-row sm:items-center dark:border-ink-800 dark:bg-ink-800">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-200 px-3 dark:border-ink-700">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ink-400" />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input !w-auto !py-2">
            <option value="featured">Featured</option>
            <option value="rate-asc">Lowest rate</option>
            <option value="rating-desc">Top rated</option>
            <option value="trust-desc">Most trusted</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="accent-brand-600" />
          Verified only
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
          <input type="checkbox" checked={hideFlagged} onChange={(e) => setHideFlagged(e.target.checked)} className="accent-brand-600" />
          Hide flagged
        </label>
      </div>

      <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
        {results.length} product{results.length === 1 ? '' : 's'} · tick{' '}
        <GitCompare className="inline h-4 w-4" /> to compare up to 3
      </p>

      {results.length === 0 ? (
        <div className="card p-12 text-center text-ink-500 dark:text-ink-400">
          No products match your filters. Try clearing search or showing flagged results.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <div key={p.id} className="flex flex-col">
              <label className="mb-2 flex w-fit cursor-pointer items-center gap-1.5 rounded-lg px-1 text-xs font-semibold text-ink-500 dark:text-ink-400">
                <input
                  type="checkbox"
                  checked={compare.includes(p.id)}
                  onChange={() => toggleCompare(p.id)}
                  className="accent-brand-600"
                />
                Compare
              </label>
              <div className="flex-1">
                <ProductCard product={p} />
              </div>
            </div>
          ))}
        </div>
      )}

      <CompareTray ids={compare} onClear={() => setCompare([])} onRemove={toggleCompare} />
    </div>
  );
}
