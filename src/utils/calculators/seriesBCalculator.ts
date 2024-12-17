import { TAX_CONSTANTS } from '../taxConstants';

export interface SeriesBResult {
  wealthValue: number;
  discountedWealthValue: number;
  totalTax: number;
  dividendRequired: number;
  exitTax: number;
  taxableGain: number;
  yearlyExitTax: number;
  standardDeduction: number;
}

export const calculateSeriesB = (
  marketValue: number,
  ownershipPercentage: number
): SeriesBResult => {
  // Calculate wealth value based on ownership
  const wealthValue = marketValue * (ownershipPercentage / 100);
  
  // Apply valuation discount
  const discountedWealthValue = wealthValue * TAX_CONSTANTS.VALUATION_DISCOUNT;
  
  // Calculate wealth tax using tiered rates
  let totalTax = 0;
  
  if (discountedWealthValue > TAX_CONSTANTS.WEALTH_TAX_THRESHOLD) {
    // First tier calculation (up to 20M)
    const tier1Amount = Math.min(
      TAX_CONSTANTS.WEALTH_TAX_TIER1_THRESHOLD - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD,
      Math.max(0, discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD)
    );
    totalTax += tier1Amount * TAX_CONSTANTS.WEALTH_TAX_RATE_TIER1;
    
    // Second tier calculation (above 20M)
    const tier2Amount = Math.max(0, discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_TIER1_THRESHOLD);
    totalTax += tier2Amount * TAX_CONSTANTS.WEALTH_TAX_RATE_TIER2;
  }
  
  // Calculate dividend required
  const dividendRequired = totalTax / (1 - TAX_CONSTANTS.DIVIDEND_TAX_RATE);
  
  // Calculate exit tax
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