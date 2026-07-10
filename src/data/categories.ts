import type { Category } from '../lib/types';

export const CATEGORIES: Category[] = [
  { id: 'loans', name: 'Loans', tagline: 'Personal, home, business & auto', icon: 'Landmark', accent: 'brand' },
  { id: 'credit-cards', name: 'Credit Cards', tagline: 'Rewards, cashback & travel', icon: 'CreditCard', accent: 'info' },
  { id: 'insurance', name: 'Insurance', tagline: 'Health, life, auto & travel', icon: 'ShieldCheck', accent: 'brand' },
  { id: 'savings', name: 'Savings', tagline: 'High-yield & fixed deposits', icon: 'PiggyBank', accent: 'gold' },
  { id: 'investments', name: 'Investments', tagline: 'Funds, ETFs & robo-advisors', icon: 'TrendingUp', accent: 'brand' },
  { id: 'grants', name: 'Grants', tagline: 'Business & community funding', icon: 'Gift', accent: 'info' },
  { id: 'scholarships', name: 'Scholarships', tagline: 'Study funding worldwide', icon: 'GraduationCap', accent: 'gold' },
  { id: 'microfinance', name: 'Microfinance', tagline: 'Small loans for big ideas', icon: 'HandCoins', accent: 'brand' },
  { id: 'fintech-apps', name: 'Fintech Apps', tagline: 'Neobanks, wallets & tools', icon: 'Smartphone', accent: 'info' },
  { id: 'government-schemes', name: 'Government Schemes', tagline: 'Subsidies & welfare programs', icon: 'Building2', accent: 'gold' },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
