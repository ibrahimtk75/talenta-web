import type { FinancialProduct } from './types';

export interface EligibilityInput {
  annualIncome: number;
  creditScore: number;
  employed: boolean;
}

export interface EligibilityResult {
  /** Estimated eligibility score 0–100. NOT a lending decision. */
  score: number;
  band: 'strong' | 'moderate' | 'weak';
  reasons: string[];
}

/**
 * Transparent, rule-based eligibility ESTIMATE. This is intentionally simple
 * and explainable — it is a guidance signal, never an approval decision.
 */
export function estimateEligibility(
  product: FinancialProduct,
  input: EligibilityInput,
): EligibilityResult {
  const reasons: string[] = [];
  let score = 60; // neutral baseline

  if (product.minIncome != null) {
    if (input.annualIncome >= product.minIncome) {
      score += 18;
      reasons.push('Income meets the typical minimum for this product.');
    } else {
      score -= 25;
      reasons.push('Income is below the typical minimum for this product.');
    }
  }

  if (product.minCreditScore != null) {
    const diff = input.creditScore - product.minCreditScore;
    if (diff >= 40) {
      score += 20;
      reasons.push('Credit score comfortably above the typical requirement.');
    } else if (diff >= 0) {
      score += 8;
      reasons.push('Credit score meets the typical requirement.');
    } else {
      score -= 22;
      reasons.push('Credit score is below the typical requirement.');
    }
  }

  if (input.employed) {
    score += 6;
    reasons.push('Stable employment strengthens the profile.');
  } else {
    score -= 6;
    reasons.push('Employment status may require extra documentation.');
  }

  if (product.flagged) {
    reasons.push('⚠️ This product is flagged for caution — review terms carefully.');
  }

  score = Math.max(3, Math.min(97, Math.round(score)));
  const band = score >= 75 ? 'strong' : score >= 50 ? 'moderate' : 'weak';
  return { score, band, reasons };
}
