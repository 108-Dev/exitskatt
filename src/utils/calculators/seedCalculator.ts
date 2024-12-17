import { TAX_CONSTANTS } from '../taxConstants';

export interface SeedResult {
  wealthValue: number;
  discountedWealthValue: number;
  totalTax: number;
  dividendRequired: number;
  exitTax: number;
  taxableGain: number;
  yearlyExitTax: number;
  standardDeduction: number;
}

export const calculateSeed = (
  marketValue: number,
  ownershipPercentage: number
): SeedResult => {
  // Calculate wealth value based on ownership
  const wealthValue = marketValue * (ownershipPercentage / 100);
  
  // Apply valuation discount for wealth tax calculation
  const discountedWealthValue = wealthValue * TAX_CONSTANTS.VALUATION_DISCOUNT;
  
  // Calculate wealth tax
  let totalTax = 0;
  
  if (discountedWealthValue > TAX_CONSTANTS.WEALTH_TAX_THRESHOLD) {
    const taxableAmount = discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD;
    totalTax = taxableAmount * (TAX_CONSTANTS.MUNICIPAL_TAX_RATE + TAX_CONSTANTS.STATE_TAX_RATE);
  }
  
  // Calculate dividend required
  const dividendRequired = totalTax / (1 - TAX_CONSTANTS.DIVIDEND_TAX_RATE);
  
  // Calculate exit tax
  // For exit tax, we use the full market value (not discounted)
  const standardDeduction = TAX_CONSTANTS.STANDARD_DEDUCTION;
  const taxableGain = Math.max(0, wealthValue - standardDeduction);
  const exitTax = taxableGain * TAX_CONSTANTS.EXIT_TAX_RATE;
  const yearlyExitTax = exitTax / 12;
  
  return {
    wealthValue,
    discountedWealthValue,
    totalTax,
    dividendRequired,
    exitTax,
    taxableGain,
    yearlyExitTax,
    standardDeduction
  };
};