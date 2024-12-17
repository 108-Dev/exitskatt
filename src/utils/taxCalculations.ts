import { TAX_CONSTANTS } from './taxConstants';
import { SakornCalculationResult, CalculationPhase } from './types';

export const calculateSakornPhase = (
  investmentAmount: number,
  ownershipPercentage: number,
  marketValue?: number,
  phase?: CalculationPhase
): SakornCalculationResult => {
  let wealthValue;
  
  if (phase === 'pre-seed') {
    // For pre-seed phase, calculate based on investment amount and ownership
    wealthValue = investmentAmount * (ownershipPercentage / 100);
  } else if (marketValue !== undefined) {
    // For Series-A, Series-B, and Børsnotert, use market value to calculate wealth
    wealthValue = marketValue * (ownershipPercentage / 100);
  } else {
    // Seed phase - use investment amount
    wealthValue = investmentAmount * (ownershipPercentage / 100);
  }
  
  // Apply valuation discount (except for Børsnotert phase)
  const discountedWealthValue = phase === 'borsnotert' 
    ? wealthValue 
    : wealthValue * TAX_CONSTANTS.VALUATION_DISCOUNT;
  
  // Calculate tax based on thresholds
  let municipalTax = 0;
  let stateTax = 0;
  let totalTax = 0;
  
  if (discountedWealthValue > TAX_CONSTANTS.WEALTH_TAX_THRESHOLD) {
    const taxableAmount = discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD;
    
    // Calculate municipal tax (0.7%)
    municipalTax = taxableAmount * 0.007;
    
    // Calculate state tax (0.3%)
    stateTax = taxableAmount * 0.003;
    
    totalTax = municipalTax + stateTax;
  }

  // Calculate required dividend to cover tax (gross up for dividend tax)
  const dividendRequired = totalTax / (1 - TAX_CONSTANTS.DIVIDEND_TAX_RATE);

  // Calculate exit tax if market value is provided (except for pre-seed)
  let exitTax;
  let taxableGain;
  let yearlyExitTax;
  let standardDeduction;
  
  if (marketValue !== undefined && phase !== 'pre-seed') {
    const adjustedMarketValue = marketValue * (ownershipPercentage / 100);
    standardDeduction = TAX_CONSTANTS.STANDARD_DEDUCTION;
    taxableGain = Math.max(0, adjustedMarketValue - standardDeduction);
    exitTax = taxableGain * TAX_CONSTANTS.DIVIDEND_TAX_RATE;
    yearlyExitTax = exitTax / 12;
  }
  
  return {
    wealthValue,
    discountedWealthValue,
    municipalTax,
    stateTax,
    totalTax,
    dividendRequired,
    ...(exitTax !== undefined && { 
      exitTax,
      taxableGain,
      yearlyExitTax,
      standardDeduction
    })
  };
};