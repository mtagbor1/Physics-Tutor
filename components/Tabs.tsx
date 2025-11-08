
import React from 'react';
import { Tab, DefineIcon, ExplainIcon, AnalogyIcon, ProblemIcon, QuizIcon, LessonPlanIcon, SavedIcon } from '../constants';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabOptions = [
    { id: Tab.Define, label: 'Define Term', icon: <DefineIcon /> },
    { id: Tab.Explain, label: 'Explain Topic', icon: <ExplainIcon /> },
    { id: Tab.Analogy, label: 'Get Analogy', icon: <AnalogyIcon /> },
    { id: Tab.Problem, label: 'Create Problem', icon: <ProblemIcon /> },
    { id: Tab.Quiz, label: 'Generate Quiz', icon: <QuizIcon /> },
    { id: Tab.LessonPlan, label: 'Create Lesson Plan', icon: <LessonPlanIcon /> },
    { id: Tab.Saved, label: 'Saved Items', icon: <SavedIcon /> },
];

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Tabs">
      {tabOptions.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
            px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200 flex items-center
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
