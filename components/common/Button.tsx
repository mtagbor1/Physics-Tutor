
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors";
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-gray-700 hover:bg-gray-600',
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
};
