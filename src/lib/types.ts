// GlobalFundConnect — core domain types

export type CategoryId =
  | 'loans'
  | 'credit-cards'
  | 'insurance'
  | 'savings'
  | 'investments'
  | 'grants'
  | 'scholarships'
  | 'microfinance'
  | 'fintech-apps'
  | 'government-schemes';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  icon: string; // lucide icon name
  accent: string; // tailwind color token e.g. 'brand'
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'NGN';

export interface Provider {
  id: string;
  name: string;
  logoText: string; // initials for avatar
  country: string;
  /** Transparent trust score 0–100 based on verification, reviews, complaints. */
  trustScore: number;
  verified: boolean;
  regulated: boolean;
}

export interface FinancialProduct {
  id: string;
  category: CategoryId;
  name: string;
  providerId: string;
  country: string; // ISO-ish label
  currency: CurrencyCode;
  summary: string;
  /** Headline rate — APR for loans/cards, yield for savings, etc. */
  rate: number | null;
  rateLabel: string; // e.g. 'APR', 'p.a. yield', 'Coverage'
  minAmount: number | null;
  maxAmount: number | null;
  termLabel: string; // e.g. '12–60 months'
  rating: number; // 0–5
  reviews: number;
  featured: boolean;
  sponsored: boolean;
  /** Scam/fraud warning indicator — true means flagged for caution. */
  flagged: boolean;
  tags: string[];
  /** Rough eligibility hints used by the estimator. */
  minIncome: number | null;
  minCreditScore: number | null;
}

export type UserRole = 'client' | 'provider' | 'admin';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'approved'
  | 'declined';

export interface Application {
  id: string;
  productId: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO date
  amount: number;
}
