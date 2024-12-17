import { TAX_CONSTANTS } from '../taxConstants';

export interface SeriesAResult {
  wealthValue: number;
  discountedWealthValue: number;
  totalTax: number;
  dividendRequired: number;
  exitTax: number;
  taxableGain: number;
  yearlyExitTax: number;
  standardDeduction: number;
}

export const calculateSeriesA = (
  investmentAmount: number,
  marketValue: number,
  ownershipPercentage: number
): SeriesAResult => {
  // Calculate wealth value based on investment amount and ownership
  const wealthValue = investmentAmount * (ownershipPercentage / 100);
  
  // Apply valuation discount for wealth tax calculation
  const discountedWealthValue = wealthValue * TAX_CONSTANTS.VALUATION_DISCOUNT;
  
  // Calculate wealth tax using tiered rates
  let totalTax = 0;
  
  // Calculate tax for amount up to 20M
  const taxableAmountTier1 = Math.min(
    TAX_CONSTANTS.WEALTH_TAX_TIER1_THRESHOLD - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD,
    Math.max(0, discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD)
  );
  totalTax += taxableAmountTier1 * TAX_CONSTANTS.WEALTH_TAX_RATE_TIER1; // 1% for first tier
  
  // Calculate tax for amount above 20M
  const taxableAmountTier2 = Math.max(0, discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_TIER1_THRESHOLD);
  totalTax += taxableAmountTier2 * TAX_CONSTANTS.WEALTH_TAX_RATE_TIER2; // 1.1% for second tier
  
  // Calculate dividend required to cover tax
  const dividendRequired = totalTax / (1 - TAX_CONSTANTS.DIVIDEND_TAX_RATE);
  
  // Calculate exit tax based on market value
  const standardDeduction = TAX_CONSTANTS.STANDARD_DEDUCTION;
  const adjustedMarketValue = marketValue * (ownershipPercentage / 100);
  const taxableGain = Math.max(0, adjustedMarketValue - standardDeduction);
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