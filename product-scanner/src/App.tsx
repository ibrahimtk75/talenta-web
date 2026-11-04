import { useEffect, useRef, useState } from "react";
import type { HistoryItem, ProductInfo, Shot } from "./types";
import { fileToShot, makeThumb } from "./image";
import ProductCard from "./ProductCard";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
];
const HISTORY_KEY = "product-lens-history";

function loadHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("product-lens-lang") || "en"; } catch { return "en"; }
  });
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ProductInfo | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);
  const [tab, setTab] = useState<"scan" | "history">("scan");
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { localStorage.setItem("product-lens-lang", lang); } catch {}
  }, [lang]);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    try {
      const room = 4 - shots.length;
      const picked = Array.from(files).slice(0, room);
      const next = await Promise.all(picked.map((f) => fileToShot(f)));
      setShots((s) => [...s, ...next].slice(0, 4));
      setResult(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function analyze() {
    if (!shots.length) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: shots.map(({ mediaType, data }) => ({ mediaType, data })),
          language: lang,
          note,
        }),
      });
      const json = await res.json().catch(() => ({ error: "Server error" }));
      if (!res.ok) throw new Error(json.error || "Scan failed");
      const info = json as ProductInfo;
      setResult(info);
      const item: HistoryItem = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        at: Date.now(),
        thumb: await makeThumb(shots[0].preview),
        info,
      };
      const nextHistory = [item, ...history].slice(0, 30);
      setHistory(nextHistory);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory)); } catch {}
    } catch (e) {
      setError((e as Error).message || "Network error — check your internet.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setShots([]);
    setResult(null);
    setError("");
    setNote("");
  }

  return (
    <div className="app">
      <header className="top">
        <div className="logo">
          <img src="/icon.svg" alt="" width={28} height={28} />
          <span>Product Lens</span>
        </div>
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Result language">
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </header>

      <main>
        {tab === "scan" && (
          <>
            {!result && (
              <section className="panel">
                <h1>Scan any product</h1>
                <p className="muted">
                  Take a photo of the product or its pack — front, back label, barcode. Add up to 4 photos for best details.
                </p>

                <div className="shots">
                  {shots.map((s, i) => (
                    <div key={i} className="shot">
                      <img src={s.preview} alt={`Photo ${i + 1}`} />
                      <button
                        className="x"
                        aria-label="Remove photo"
                        onClick={() => setShots((all) => all.filter((_, j) => j !== i))}
                      >×</button>
                    </div>
                  ))}
                  {shots.length < 4 && (
                    <button className="shot add" onClick={() => cameraRef.current?.click()}>
                      <span className="big">📷</span>
                      <span>{shots.length ? "Add side" : "Take photo"}</span>
                    </button>
                  )}
                </div>

                <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden
                  onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                <input ref={galleryRef} type="file" accept="image/*" multiple hidden
                  onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

                <button className="link" onClick={() => galleryRef.current?.click()} disabled={shots.length >= 4}>
                  🖼️ Choose from gallery
                </button>

                <input className="note" placeholder="Optional note (e.g. “is this halal?”, “is it safe for kids?”)"
                  value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} />

                <button className="primary" disabled={!shots.length || loading} onClick={analyze}>
                  {loading ? <><span className="spinner" /> Analysing…</> : "🔍 Get full details"}
                </button>
                {error && <p className="error">{error}</p>}
              </section>
            )}

            {result && (
              <>
                <ProductCard info={result} photo={shots[0]?.preview} />
                <button className="primary" onClick={reset}>📷 Scan another product</button>
              </>
            )}
          </>
        )}

        {tab === "history" && (
          <section className="panel">
            <h1>Recent scans</h1>
            {!history.length && <p className="muted">No scans yet.</p>}
            <ul className="history">
              {history.map((h) => (
                <li key={h.id}>
                  <button onClick={() => { setResult(h.info); setShots([{ mediaType: "image/jpeg", data: "", preview: h.thumb }]); setTab("scan"); }}>
                    <img src={h.thumb} alt="" />
                    <div>
                      <strong>{h.info.product_name || "Unknown product"}</strong>
                      <span className="muted">{h.info.brand} · {new Date(h.at).toLocaleDateString()}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {!!history.length && (
              <button className="link danger" onClick={() => { setHistory([]); try { localStorage.removeItem(HISTORY_KEY); } catch {} }}>
                Clear history
              </button>
            )}
          </section>
        )}
      </main>

      <nav className="tabs">
        <button className={tab === "scan" ? "on" : ""} onClick={() => setTab("scan")}>📷<span>Scan</span></button>
        <button className={tab === "history" ? "on" : ""} onClick={() => setTab("history")}>🕘<span>History</span></button>
      </nav>
    </div>
  );
}
