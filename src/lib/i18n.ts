export type Lang = 'en' | 'es' | 'hi' | 'ar';

export const LANGS: { code: Lang; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

type Dict = Record<string, string>;

const en: Dict = {
  'nav.marketplace': 'Marketplace',
  'nav.recommend': 'AI Advisor',
  'nav.learn': 'Learn',
  'nav.providers': 'For Providers',
  'nav.about': 'How it works',
  'nav.signin': 'Sign in',
  'nav.getstarted': 'Get started',
  'hero.title': 'One marketplace for the world’s money',
  'hero.subtitle':
    'Compare loans, cards, insurance, savings, investments, grants and more from verified providers — with transparent trust scores and AI guidance.',
  'hero.cta': 'Explore the marketplace',
  'hero.cta2': 'Get AI recommendations',
  'search.placeholder': 'Search loans, cards, insurance, scholarships…',
};

const es: Dict = {
  'nav.marketplace': 'Mercado',
  'nav.recommend': 'Asesor IA',
  'nav.learn': 'Aprender',
  'nav.providers': 'Para proveedores',
  'nav.about': 'Cómo funciona',
  'nav.signin': 'Iniciar sesión',
  'nav.getstarted': 'Empezar',
  'hero.title': 'Un mercado para el dinero del mundo',
  'hero.subtitle':
    'Compara préstamos, tarjetas, seguros, ahorros, inversiones, subvenciones y más de proveedores verificados, con puntuaciones de confianza transparentes.',
  'hero.cta': 'Explorar el mercado',
  'hero.cta2': 'Obtener recomendaciones IA',
  'search.placeholder': 'Busca préstamos, tarjetas, seguros, becas…',
};

const hi: Dict = {
  'nav.marketplace': 'मार्केटप्लेस',
  'nav.recommend': 'AI सलाहकार',
  'nav.learn': 'सीखें',
  'nav.providers': 'प्रदाताओं के लिए',
  'nav.about': 'यह कैसे काम करता है',
  'nav.signin': 'साइन इन',
  'nav.getstarted': 'शुरू करें',
  'hero.title': 'दुनिया के पैसे के लिए एक मार्केटप्लेस',
  'hero.subtitle':
    'सत्यापित प्रदाताओं से ऋण, कार्ड, बीमा, बचत, निवेश, अनुदान और अधिक की तुलना करें — पारदर्शी ट्रस्ट स्कोर के साथ।',
  'hero.cta': 'मार्केटप्लेस देखें',
  'hero.cta2': 'AI सिफारिशें पाएं',
  'search.placeholder': 'ऋण, कार्ड, बीमा, छात्रवृत्ति खोजें…',
};

const ar: Dict = {
  'nav.marketplace': 'السوق',
  'nav.recommend': 'مستشار الذكاء',
  'nav.learn': 'تعلّم',
  'nav.providers': 'لمزوّدي الخدمة',
  'nav.about': 'كيف يعمل',
  'nav.signin': 'تسجيل الدخول',
  'nav.getstarted': 'ابدأ الآن',
  'hero.title': 'سوق واحد لأموال العالم',
  'hero.subtitle':
    'قارن القروض والبطاقات والتأمين والمدخرات والاستثمارات والمنح والمزيد من مزوّدين موثوقين، مع درجات ثقة شفافة.',
  'hero.cta': 'استكشف السوق',
  'hero.cta2': 'احصل على توصيات الذكاء',
  'search.placeholder': 'ابحث عن قروض، بطاقات، تأمين، منح…',
};

const DICTS: Record<Lang, Dict> = { en, es, hi, ar };

export function translator(lang: Lang) {
  return (key: string): string => DICTS[lang][key] ?? en[key] ?? key;
}
