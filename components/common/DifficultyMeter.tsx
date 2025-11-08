import React from 'react';
import { Difficulty } from '../../constants';

interface DifficultyMeterProps {
  difficulty: Difficulty;
}

const difficultyConfig = {
  [Difficulty.Easy]: { level: 1, color: 'bg-green-500', label: 'Easy' },
  [Difficulty.Medium]: { level: 2, color: 'bg-yellow-500', label: 'Medium' },
  [Difficulty.Hard]: { level: 3, color: 'bg-red-500', label: 'Hard' },
};

export const DifficultyMeter: React.FC<DifficultyMeterProps> = ({ difficulty }) => {
  const config = difficultyConfig[difficulty];

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-300 w-16">{config.label}</span>
      <div className="flex items-center gap-1.5 h-5">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`w-8 h-2 rounded-full ${level <= config.level ? config.color : 'bg-gray-600'}`}
            title={`${config.label} Difficulty`}
          ></div>
        ))}
      </div>
    </div>
  );
};
