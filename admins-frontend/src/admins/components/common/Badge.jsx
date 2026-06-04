import React from 'react';

const Badge = ({ label, variant = 'default', className = '' }) => {
  const variantStyles = {
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-400 text-gray-900',
    info: 'bg-blue-500 text-white',
    default: 'bg-gray-200 text-gray-800'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
