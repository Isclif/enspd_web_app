import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-gray-700 font-semibold mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};