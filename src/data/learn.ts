export interface Guide {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  excerpt: string;
  icon: string;
  /** Simple paragraph + heading content. */
  body: { heading?: string; text: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'understanding-apr',
    title: 'APR explained: the number that really matters',
    category: 'Borrowing',
    minutes: 4,
    excerpt: 'Interest rate isn’t the whole story. Learn how APR bundles fees so you can compare loans fairly.',
    icon: 'Percent',
    body: [
      { text: 'When you compare loans or credit cards, the Annual Percentage Rate (APR) is the single most useful number — because it folds the interest rate and most mandatory fees into one figure.' },
      { heading: 'Rate vs. APR', text: 'The interest rate is the cost of borrowing the principal. The APR adds fees like origination charges, so two loans with the same rate can have very different APRs. Always compare APR to APR.' },
      { heading: 'Fixed vs. variable', text: 'A fixed APR stays the same for the term. A variable APR can rise or fall with a benchmark rate — cheaper today, but riskier if rates climb.' },
      { heading: 'Red flag', text: 'An APR far above the market (think triple digits) is a sign of predatory lending. GlobalFundConnect flags these listings with a caution badge.' },
    ],
  },
  {
    slug: 'build-credit-score',
    title: 'How to build (or rebuild) your credit score',
    category: 'Credit',
    minutes: 5,
    excerpt: 'Five habits that move your score in the right direction — and the myths that don’t.',
    icon: 'TrendingUp',
    body: [
      { text: 'Your credit score is a snapshot of how reliably you repay. It influences the rates and products you’re offered.' },
      { heading: '1. Pay on time, every time', text: 'Payment history is the single biggest factor. Automate at least the minimum payment to never miss one.' },
      { heading: '2. Keep utilisation low', text: 'Using less than ~30% of your available credit signals control. Paying balances before the statement date helps.' },
      { heading: '3. Let accounts age', text: 'Length of history matters. Keep older accounts open where sensible.' },
      { heading: 'Myth', text: 'Checking your own score does NOT hurt it — that’s a “soft” inquiry. Only lender “hard” inquiries have a small, temporary effect.' },
    ],
  },
  {
    slug: 'spot-financial-scams',
    title: 'Spotting financial scams before they cost you',
    category: 'Safety',
    minutes: 4,
    excerpt: 'The warning signs of loan fraud, fake grants and phishing — and how to protect yourself.',
    icon: 'ShieldAlert',
    body: [
      { text: 'Scammers target people looking for money — for loans, grants or “guaranteed” approvals. The signs are consistent once you know them.' },
      { heading: 'Never pay to borrow', text: 'A legitimate lender does not ask for an upfront fee to “release” or “guarantee” a loan. This is the #1 loan scam.' },
      { heading: 'Guaranteed approval is a myth', text: 'No responsible provider guarantees approval before assessing you. Real grants and scholarships never ask for a processing fee.' },
      { heading: 'Check the provider', text: 'On GlobalFundConnect, every provider shows a transparent trust score and regulatory status. Low scores and “Caution” flags are there to protect you.' },
    ],
  },
  {
    slug: 'emergency-fund-basics',
    title: 'Emergency funds: how much and where to keep it',
    category: 'Saving',
    minutes: 3,
    excerpt: 'The buffer that turns a crisis into an inconvenience — and how high-yield savings help.',
    icon: 'PiggyBank',
    body: [
      { text: 'An emergency fund is cash set aside for the unexpected — a job loss, a medical bill, a broken boiler.' },
      { heading: 'How much?', text: 'A common target is 3–6 months of essential expenses. Start with one month; consistency beats perfection.' },
      { heading: 'Where?', text: 'Keep it liquid and safe — a high-yield savings account earns interest while staying instantly accessible. Compare yields in the Savings category.' },
    ],
  },
  {
    slug: 'diversification-101',
    title: 'Investing 101: why diversification wins',
    category: 'Investing',
    minutes: 5,
    excerpt: 'Don’t put all your eggs in one basket — the single most reliable idea in investing.',
    icon: 'BarChart3',
    body: [
      { text: 'Diversification means spreading money across many investments so no single loss sinks you.' },
      { heading: 'Index funds & ETFs', text: 'A low-cost global index fund holds hundreds or thousands of companies in one purchase — instant diversification for a tiny fee.' },
      { heading: 'Time in the market', text: 'Consistent long-term investing tends to beat trying to time the market. Automate contributions and let compounding work.' },
      { heading: 'Know the risk', text: 'All investments can lose value. Only invest money you won’t need in the short term, and match risk to your goals.' },
    ],
  },
  {
    slug: 'grants-vs-loans',
    title: 'Grants, scholarships & loans: what’s the difference?',
    category: 'Funding',
    minutes: 3,
    excerpt: 'Free money vs. borrowed money — and how to stack them the smart way.',
    icon: 'Gift',
    body: [
      { text: 'Not all funding is the same. Knowing the difference helps you fund goals at the lowest cost.' },
      { heading: 'Grants & scholarships', text: 'These are typically non-repayable — “free money” awarded on need or merit. Always exhaust these before borrowing.' },
      { heading: 'Loans', text: 'Borrowed money you repay with interest. Useful and often necessary, but compare APR and terms carefully.' },
      { heading: 'Stack smart', text: 'Combine grants/scholarships first, then a well-chosen loan for the gap. Government schemes may subsidise the rate.' },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
