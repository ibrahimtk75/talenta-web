import {
  Landmark, CreditCard, ShieldCheck, PiggyBank, TrendingUp, Gift, GraduationCap,
  HandCoins, Smartphone, Building2, Circle, Search, Sparkles, FileCheck, FileText,
  Bookmark, Eye, MousePointerClick, Users, Package, AlertTriangle, Star, CheckCircle2,
  Percent, ShieldAlert, BarChart3,
  type LucideProps,
} from 'lucide-react';

// Curated registry — only the icons referenced by string name. Keeps the
// bundle small by avoiding lucide's full icon barrel.
const REGISTRY: Record<string, React.ComponentType<LucideProps>> = {
  Landmark, CreditCard, ShieldCheck, PiggyBank, TrendingUp, Gift, GraduationCap,
  HandCoins, Smartphone, Building2, Circle, Search, Sparkles, FileCheck, FileText,
  Bookmark, Eye, MousePointerClick, Users, Package, AlertTriangle, Star, CheckCircle2,
  Percent, ShieldAlert, BarChart3,
};

interface IconProps extends LucideProps {
  name: string;
}

/** Render a lucide icon by name, falling back to a circle if unknown. */
export default function Icon({ name, ...props }: IconProps) {
  const Cmp = REGISTRY[name] ?? Circle;
  return <Cmp {...props} />;
}
