import { TAX_CONSTANTS } from '../taxConstants';

export interface PreSeedResult {
  wealthValue: number;
  discountedWealthValue: number;
  municipalTax: number;
  stateTax: number;
  totalTax: number;
  dividendRequired: number;
}

export const calculatePreSeed = (
  investmentAmount: number,
  ownershipPercentage: number
): PreSeedResult => {
  // Calculate wealth value based on ownership
  const wealthValue = investmentAmount * (ownershipPercentage / 100);
  
  // Apply valuation discount
  const discountedWealthValue = wealthValue * TAX_CONSTANTS.VALUATION_DISCOUNT;
  
  // Calculate tax based on thresholds
  let municipalTax = 0;
  let stateTax = 0;
  
  if (discountedWealthValue > TAX_CONSTANTS.WEALTH_TAX_THRESHOLD) {
    const taxableAmount = discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD;
    municipalTax = taxableAmount * TAX_CONSTANTS.MUNICIPAL_TAX_RATE;
    stateTax = taxableAmount * TAX_CONSTANTS.STATE_TAX_RATE;
  }
  
  const totalTax = municipalTax + stateTax;
  const dividendRequired = totalTax / (1 - TAX_CONSTANTS.DIVIDEND_TAX_RATE);
  
  return {
    wealthValue,
    discountedWealthValue,
    municipalTax,
    stateTax,
    totalTax,
    dividendRequired
  };
};