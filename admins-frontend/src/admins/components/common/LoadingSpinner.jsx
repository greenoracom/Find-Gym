import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', color = 'text-primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className={`${sizes[size]} ${color} animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
