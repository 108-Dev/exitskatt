import { useState, useEffect } from 'react';
import { calculateSakornPhase } from '../utils/taxCalculations';
import { calculateBorsnotert } from '../utils/calculators/borsnotertCalculator';
import { calculateSeriesA } from '../utils/calculators/seriesACalculator';
import { calculatePostEmissionOwnership } from '../utils/ownershipCalculations';
import { ResultDisplay } from './ResultDisplay';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PhaseSelector } from './ui/PhaseSelector';
import { Title } from './ui/Title';
import { CalculationPhase } from '../utils/types';
import { parseMNOK } from '../utils/formatters';
import type { SakornCalculationResult } from '../utils/types';
import type { BorsnotertResult } from '../utils/calculators/borsnotertCalculator';

type CalculationResult = SakornCalculationResult | BorsnotertResult | null;

export const Calculator: React.FC = () => {
  const [phase, setPhase] = useState<CalculationPhase>('pre-seed');
  const [investment, setInvestment] = useState<string>('');
  const [marketValue, setMarketValue] = useState<string>('');
  const [wealthValue, setWealthValue] = useState<string>('');
  const [ownership, setOwnership] = useState<string>('');
  const [preEmissionOwnership, setPreEmissionOwnership] = useState<string>('');
  const [postEmissionOwnership, setPostEmissionOwnership] = useState<string>('');
  const [seriesAInvestment, setSeriesAInvestment] = useState<string>('');
  const [results, setResults] = useState<CalculationResult>(null);

  useEffect(() => {
    if (preEmissionOwnership) {
      const preOwnership = parseFloat(preEmissionOwnership);
      if (!isNaN(preOwnership)) {
        const postOwnership = calculatePostEmissionOwnership(preOwnership);
        setPostEmissionOwnership(postOwnership.toString());
      }
    }
  }, [preEmissionOwnership]);

  const handlePhaseChange = (newPhase: CalculationPhase) => {
    setPhase(newPhase);
    setResults(null);
    // Reset form values
    setInvestment('');
    setMarketValue('');
    setWealthValue('');
    setOwnership('');
    setPreEmissionOwnership('');
    setPostEmissionOwnership('');
    setSeriesAInvestment('');
  };

  const handleCalculate = () => {
    if (phase === 'borsnotert') {
      const wealthValueAmount = parseMNOK(wealthValue);
      
      if (!isNaN(wealthValueAmount)) {
        const calculationResults = calculateBorsnotert(wealthValueAmount);
        setResults(calculationResults);
      }
    } else if (phase === 'pre-seed') {
      const investmentAmount = parseMNOK(investment);
      const ownershipPercentage = parseFloat(postEmissionOwnership);

      if (!isNaN(investmentAmount) && !isNaN(ownershipPercentage)) {
        const calculationResults = calculateSakornPhase(
          investmentAmount, 
          ownershipPercentage
        );
        setResults(calculationResults);
      }
    } else if (phase === 'series-a-b') {
      const marketValueAmount = parseMNOK(marketValue);
      const ownershipPercentage = parseFloat(ownership);
      const investmentAmount = parseMNOK(seriesAInvestment);
      
      if (!isNaN(marketValueAmount) && !isNaN(ownershipPercentage) && !isNaN(investmentAmount)) {
        const calculationResults = calculateSeriesA(
          investmentAmount,
          marketValueAmount,
          ownershipPercentage
        );
        setResults(calculationResults);
      }
    } else {
      const marketValueAmount = parseMNOK(marketValue);
      const ownershipPercentage = parseFloat(ownership);
      
      if (!isNaN(marketValueAmount) && !isNaN(ownershipPercentage)) {
        const calculationResults = calculateSakornPhase(
          0, 
          ownershipPercentage,
          marketValueAmount,
          phase
        );
        setResults(calculationResults);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <Title />

      <div className="space-y-6">
        <PhaseSelector
          selectedPhase={phase}
          onPhaseChange={handlePhaseChange}
        />

        <div className="grid grid-cols-1 gap-4">
          {phase === 'pre-seed' && (
            <>
              <Input
                label="Investeringsbeløp (mNOK)"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                placeholder="F.eks. 5"
              />
              <Input
                label="Eierandel før emisjon (%)"
                type="number"
                value={preEmissionOwnership}
                onChange={(e) => setPreEmissionOwnership(e.target.value)}
                placeholder="F.eks. 25"
              />
              <Input
                label="Eierandel etter emisjon (%)"
                type="number"
                value={postEmissionOwnership}
                disabled
                className="bg-gray-50"
              />
            </>
          )}

          {phase === 'series-a-b' && (
            <>
              <Input
                label="Investeringsbeløp (mNOK)"
                type="number"
                value={seriesAInvestment}
                onChange={(e) => setSeriesAInvestment(e.target.value)}
                placeholder="F.eks. 50"
              />
              <Input
                label="Markedsverdi (mNOK)"
                type="number"
                value={marketValue}
                onChange={(e) => setMarketValue(e.target.value)}
                placeholder="F.eks. 200"
              />
              <Input
                label="Eierandel (%)"
                type="number"
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                placeholder="F.eks. 56.25"
              />
            </>
          )}

          {phase === 'seed' && (
            <>
              <Input
                label="Markedsverdi (mNOK)"
                type="number"
                value={marketValue}
                onChange={(e) => setMarketValue(e.target.value)}
                placeholder="F.eks. 15"
              />
              <Input
                label="Eierandel (%)"
                type="number"
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                placeholder="F.eks. 75"
              />
            </>
          )}

          {phase === 'borsnotert' && (
            <Input
              label="Formuesverdi (mNOK)"
              type="number"
              value={wealthValue}
              onChange={(e) => setWealthValue(e.target.value)}
              placeholder="F.eks. 190"
            />
          )}

          <Button
            onClick={handleCalculate}
            className="w-full mt-4"
          >
            Beregn Skatt
          </Button>
        </div>

        {results && <ResultDisplay results={results} phase={phase} />}

        <div className="mt-6 text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
          Resultatene fra denne kalkulatoren er kun veiledende. Vi garanterer ikke nøyaktighet og anbefaler å bekrefte resultatene selv. Brukere har selv ansvar for hvordan resultatene anvendes. Kalkulatoren er oppdatert med informasjon fra 2025.
        </div>
      </div>
    </div>
  );
};