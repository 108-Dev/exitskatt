import { TAX_CONSTANTS } from '../taxConstants';

export interface BorsnotertResult {
  wealthValue: number;
  totalTax: number;
  exitTax: number;
  yearlyExitTax: number;
}

export const calculateBorsnotert = (wealthValue: number): BorsnotertResult => {
  // Calculate wealth tax
  // First tier: 1% on amount between 1.7M and 20M
  const tier1Amount = Math.min(
    TAX_CONSTANTS.WEALTH_TAX_TIER1_THRESHOLD - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD,
    Math.max(0, wealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD)
  );
  const tier1Tax = tier1Amount * TAX_CONSTANTS.WEALTH_TAX_RATE_TIER1;
  
  // Second tier: 1.1% on amount above 20M
  const tier2Amount = Math.max(0, wealthValue - TAX_CONSTANTS.WEALTH_TAX_TIER1_THRESHOLD);
  const tier2Tax = tier2Amount * TAX_CONSTANTS.WEALTH_TAX_RATE_TIER2;
  
  const totalTax = tier1Tax + tier2Tax;
  
  // Exit tax is the full wealth value
  const exitTax = wealthValue;
  const yearlyExitTax = exitTax / 12;
  
  return {
    wealthValue,
    totalTax,
    exitTax,
    yearlyExitTax
  };
};