import React from 'react';

const FormInput = ({ 
  label, 
  error, 
  required, 
  id, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
