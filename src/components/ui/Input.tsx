import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({ label, helper, className, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className={clsx(
          "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
          "transition-colors duration-200",
          className
        )}
      />
      {helper && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};