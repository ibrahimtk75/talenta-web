import { useEffect } from 'react';

/**
 * Lightweight per-page SEO for the SPA: sets <title>, meta description and an
 * optional JSON-LD block while the page is mounted, then restores them on leave.
 * Google renders JS, so this gives each route real, crawlable metadata.
 */
export function useSEO(opts: { title?: string; description?: string; jsonLd?: object | null }) {
  const ld = opts.jsonLd ? JSON.stringify(opts.jsonLd) : '';
  useEffect(() => {
    const prevTitle = document.title;
    if (opts.title) document.title = opts.title;

    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = metaDesc?.content ?? null;
    if (metaDesc && opts.description) metaDesc.content = opts.description;

    let script: HTMLScriptElement | null = null;
    if (ld) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'route');
      script.text = ld;
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== null) metaDesc.content = prevDesc;
      script?.remove();
    };
  }, [opts.title, opts.description, ld]);
}
