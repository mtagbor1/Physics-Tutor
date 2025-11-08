import React from 'react';

const PhysicsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.87_9.13a9_9_0_0114.26_0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12_21a9_9_0_01-7.13-3.87" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12_3a9_9_0_017.13_3.87" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5_12a7_7_0_017-7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19_12a7_7_0_01-7_7" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-4">
        <PhysicsIcon />
        <h1 className="text-3xl sm:text-4xl font-bold text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          ABUGISS Physics Tutor AI Assistant
        </h1>
      </div>
    </header>
  );
};