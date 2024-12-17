export type CalculationPhase = 'pre-seed' | 'seed' | 'series-a-b' | 'borsnotert';

export interface SakornCalculationResult {
  wealthValue: number;
  discountedWealthValue: number;
  municipalTax: number;
  stateTax: number;
  totalTax: number;
  dividendRequired: number;
  exitTax?: number;
  taxableGain?: number;
  yearlyExitTax?: number;
  standardDeduction?: number;
}

export type CalculationResult = SakornCalculationResult;