import type { ProductInfo } from "./types";

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="row">
      <span className="k">{label}</span>
      <span className="v">{value}</span>
    </div>
  );
}

function List({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  if (!items?.length) return null;
  return (
    <section className="block">
      <h3>{icon} {title}</h3>
      <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </section>
  );
}

export default function ProductCard({ info, photo }: { info: ProductInfo; photo?: string }) {
  const p = info.packaging;

  function share() {
    const text = `${info.product_name} (${info.brand})\n${info.summary}`;
    if (navigator.share) navigator.share({ title: info.product_name, text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  }

  if (!info.is_product) {
    return (
      <section className="panel">
        <h2>Not a product?</h2>
        <p>{info.summary}</p>
      </section>
    );
  }

  return (
    <article className="panel result">
      <div className="hero">
        {photo && <img src={photo} alt="" />}
        <div>
          <span className={`badge ${info.confidence}`}>{info.confidence} confidence</span>
          <h2>{info.product_name || "Unknown product"}</h2>
          <p className="muted">{[info.brand, info.category].filter(Boolean).join(" · ")}</p>
        </div>
      </div>

      <p className="summary">{info.summary}</p>

      <section className="block">
        <h3>📋 Basic details</h3>
        <Row label="Brand" value={info.brand} />
        <Row label="Manufacturer" value={info.manufacturer} />
        <Row label="Made in" value={info.country_of_origin} />
        <Row label="Net quantity" value={info.net_quantity} />
        <Row label="Price / MRP" value={info.price_mrp} />
        <Row label="Barcode" value={info.barcode} />
        <Row label="Mfg date" value={info.dates.manufactured} />
        <Row label="Expiry / Best before" value={info.dates.expiry} />
        <Row label="Batch" value={info.dates.batch} />
      </section>

      <section className="block">
        <h3>📦 Packing details</h3>
        <Row label="Pack type" value={p.type} />
        <Row label="Material" value={p.material} />
        <Row label="Recyclable" value={p.recyclable} />
        <Row label="Size (approx.)" value={p.size_estimate} />
        {!!p.symbols.length && <Row label="Symbols" value={p.symbols.join(", ")} />}
      </section>

      <List icon="✨" title="Key features" items={info.key_features} />
      <List icon="🧪" title="Ingredients / materials" items={info.ingredients_or_materials} />

      {!!info.nutrition.length && (
        <section className="block">
          <h3>🍎 Nutrition</h3>
          {info.nutrition.map((n, i) => <Row key={i} label={n.name} value={n.value} />)}
        </section>
      )}

      {(info.usage_instructions || info.storage) && (
        <section className="block">
          <h3>🧭 How to use & store</h3>
          {info.usage_instructions && <p>{info.usage_instructions}</p>}
          {info.storage && <p className="muted">Storage: {info.storage}</p>}
        </section>
      )}

      <List icon="⚠️" title="Warnings" items={info.warnings} />
      <List icon="🏅" title="Certifications" items={info.certifications} />
      <List icon="💡" title="Tips" items={info.tips} />

      {info.text_on_pack && (
        <details className="block">
          <summary>🔤 Text read from the pack</summary>
          <p className="mono">{info.text_on_pack}</p>
        </details>
      )}

      <button className="link" onClick={share}>📤 Share</button>
      <p className="disclaimer">AI-generated — double-check important details (allergens, expiry, medicine dosage) on the actual label.</p>
    </article>
  );
}
