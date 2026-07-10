import type { Provider } from '../lib/types';

export const PROVIDERS: Provider[] = [
  { id: 'p-atlas', name: 'Atlas Global Bank', logoText: 'AG', country: 'United States', trustScore: 94, verified: true, regulated: true },
  { id: 'p-meridian', name: 'Meridian Credit Union', logoText: 'MC', country: 'United Kingdom', trustScore: 91, verified: true, regulated: true },
  { id: 'p-sunrise', name: 'Sunrise Finance', logoText: 'SF', country: 'India', trustScore: 88, verified: true, regulated: true },
  { id: 'p-nova', name: 'Nova Insure', logoText: 'NI', country: 'Germany', trustScore: 90, verified: true, regulated: true },
  { id: 'p-cedar', name: 'Cedar Invest', logoText: 'CI', country: 'United States', trustScore: 86, verified: true, regulated: true },
  { id: 'p-harbor', name: 'Harbor Microcredit', logoText: 'HM', country: 'Nigeria', trustScore: 82, verified: true, regulated: true },
  { id: 'p-lumen', name: 'Lumen Wallet', logoText: 'LW', country: 'UAE', trustScore: 79, verified: true, regulated: false },
  { id: 'p-openfund', name: 'OpenFund Foundation', logoText: 'OF', country: 'Global', trustScore: 93, verified: true, regulated: true },
  { id: 'p-quick', name: 'QuickCash Now', logoText: 'QC', country: 'Unknown', trustScore: 41, verified: false, regulated: false },
];

export const providerById = (id: string) => PROVIDERS.find((p) => p.id === id);
