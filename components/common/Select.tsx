
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className="block w-full pl-4 pr-10 py-3 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-200"
    >
      {children}
    </select>
  );
};
