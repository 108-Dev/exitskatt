import { TAX_CONSTANTS } from './taxConstants';

export const calculateWealthValue = (investmentAmount: number, ownershipPercentage: number): number => {
  return investmentAmount * (ownershipPercentage / 100);
};

export const applyValuationDiscount = (wealthValue: number): number => {
  return wealthValue * TAX_CONSTANTS.VALUATION_DISCOUNT;
};

export const calculateTaxableAmount = (discountedWealthValue: number): number => {
  return Math.max(0, discountedWealthValue - TAX_CONSTANTS.WEALTH_TAX_THRESHOLD);
};