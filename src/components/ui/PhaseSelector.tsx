import React from 'react';
import { clsx } from 'clsx';
import { CalculationPhase } from '../../utils/types';

interface PhaseSelectorProps {
  selectedPhase: CalculationPhase;
  onPhaseChange: (phase: CalculationPhase) => void;
}

const PHASES: { value: CalculationPhase; label: string }[] = [
  { value: 'pre-seed', label: 'Såkorn-fasen' },
  { value: 'seed', label: 'Etter Såkorn-fasen' },
  { value: 'series-a-b', label: 'Series A-B' },
  { value: 'borsnotert', label: 'Børsnotert' }
];

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  selectedPhase,
  onPhaseChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
      {PHASES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onPhaseChange(value)}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
            'border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            selectedPhase === value
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};