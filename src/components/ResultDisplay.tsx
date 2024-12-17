import React from 'react';
import { SakornCalculationResult, CalculationPhase } from '../utils/types';
import { BorsnotertResult } from '../utils/calculators/borsnotertCalculator';
import { formatCurrency } from '../utils/formatters';

interface ResultDisplayProps {
  results: SakornCalculationResult | BorsnotertResult;
  phase: CalculationPhase;
}

const ResultRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ 
  label, 
  value, 
  highlight 
}) => (
  <div className={`grid grid-cols-2 gap-4 p-3 ${highlight ? 'bg-blue-50 rounded-lg' : ''}`}>
    <span className={`text-gray-600 ${highlight ? 'font-semibold' : ''}`}>{label}</span>
    <span className={`text-right ${highlight ? 'font-bold text-blue-900' : 'font-medium'}`}>
      {value}
    </span>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, phase }) => {
  if (!results) return null;

  const useNOK = phase === 'pre-seed';

  if (phase === 'borsnotert') {
    const borsnotertResults = results as BorsnotertResult;
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Beregningsresultater</h2>
        <div className="space-y-2">
          <ResultRow 
            label="Formuesverdi" 
            value={formatCurrency(borsnotertResults.wealthValue)} 
          />
          <div className="my-4 border-t border-gray-200" />
          <ResultRow 
            label="Total formuesskatt" 
            value={formatCurrency(borsnotertResults.totalTax)} 
            highlight 
          />
          <div className="my-4 border-t border-gray-200" />
          <ResultRow 
            label="Exit-skatt" 
            value={formatCurrency(borsnotertResults.exitTax)} 
            highlight 
          />
          <ResultRow 
            label="Årlig exit-skatt" 
            value={formatCurrency(borsnotertResults.yearlyExitTax)} 
            highlight 
          />
          <p className="mt-4 text-sm text-gray-600">
            * Exit-skatten kan betales over 12 år
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'pre-seed') {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Beregningsresultater</h2>
        <div className="space-y-2">
          <ResultRow 
            label="Formuesverdi" 
            value={formatCurrency(results.wealthValue, useNOK)} 
          />
          <ResultRow 
            label="Verdi etter rabatt" 
            value={formatCurrency(results.discountedWealthValue, useNOK)} 
          />
          <div className="my-4 border-t border-gray-200" />
          <ResultRow 
            label="Kommunal skatt (0.7%)" 
            value={formatCurrency(results.municipalTax, useNOK)} 
          />
          <ResultRow 
            label="Statlig skatt (0.3%)" 
            value={formatCurrency(results.stateTax, useNOK)} 
          />
          <div className="my-4 border-t border-gray-200" />
          <ResultRow 
            label="Total formuesskatt" 
            value={formatCurrency(results.totalTax, useNOK)} 
            highlight 
          />
          <ResultRow 
            label="Nødvendig utbytte" 
            value={formatCurrency(results.dividendRequired, useNOK)} 
            highlight 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Beregningsresultater</h2>
      <div className="space-y-2">
        <ResultRow 
          label="Formuesverdi" 
          value={formatCurrency(results.wealthValue)} 
        />
        <ResultRow 
          label="Verdi etter rabatt" 
          value={formatCurrency(results.discountedWealthValue)} 
        />
        <div className="my-4 border-t border-gray-200" />
        <ResultRow 
          label="Total formuesskatt" 
          value={formatCurrency(results.totalTax)} 
          highlight 
        />
        <ResultRow 
          label="Nødvendig utbytte" 
          value={formatCurrency(results.dividendRequired)} 
          highlight 
        />
        {'exitTax' in results && results.exitTax !== undefined && (
          <>
            <div className="my-4 border-t border-gray-200" />
            <h3 className="text-lg font-semibold mb-2">Exit-skatt Beregning</h3>
            <ResultRow 
              label="Markedsverdi før standardfradrag" 
              value={formatCurrency(results.taxableGain! + (results.standardDeduction || 0))} 
            />
            <ResultRow 
              label="Standardfradrag (2025)" 
              value={formatCurrency(results.standardDeduction || 0)} 
            />
            <ResultRow 
              label="Skattbar gevinst" 
              value={formatCurrency(results.taxableGain!)} 
            />
            <div className="my-4 border-t border-gray-200" />
            <ResultRow 
              label="Total exit-skatt" 
              value={formatCurrency(results.exitTax)} 
              highlight 
            />
            <ResultRow 
              label="Årlig exit-skatt" 
              value={formatCurrency(results.yearlyExitTax || 0)} 
              highlight 
            />
            <p className="mt-4 text-sm text-gray-600">
              * Exit-skatten kan betales over 12 år
            </p>
          </>
        )}
      </div>
    </div>
  );
};