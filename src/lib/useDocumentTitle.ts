import { useEffect } from 'react';

const SUFFIX = 'GlobalFundConnect';

/** Set the document title for the current page (basic per-page SEO). */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : `${SUFFIX} — Global Financial Marketplace`;
  }, [title]);
}
