// Thin GA4 wrapper. Safe no-op when GA isn't loaded (e.g. local/demo).
// GA is initialised in index.html (window.gtag + window.__GA_ID).

type Gtag = (...args: any[]) => void;
const g = (): Gtag | null => (typeof window !== 'undefined' ? ((window as any).gtag as Gtag) : null) || null;

/** Fire a GA4 event with optional params. */
export function track(event: string, params?: Record<string, any>) {
  const fn = g();
  if (fn) fn('event', event, params || {});
}

/**
 * Track an SPA page view. HashRouter route changes don't auto-fire page_view,
 * so GA would otherwise only ever see the landing page.
 */
export function trackPage(path: string) {
  const fn = g();
  if (fn && (window as any).__GA_ID) {
    fn('event', 'page_view', {
      page_path: path,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }
}
