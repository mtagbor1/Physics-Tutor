
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { DefineTerm } from './components/DefineTerm';
import { TopicExplainer } from './components/TopicExplainer';
import { AnalogyGenerator } from './components/AnalogyGenerator';
import { ProblemCreator } from './components/ProblemCreator';
import { QuizGenerator } from './components/QuizGenerator';
import { LessonPlanGenerator } from './components/LessonPlanGenerator';
import { SavedItemsViewer } from './components/SavedItemsViewer';
import { PersonaSelector } from './components/common/PersonaSelector';
import { Tab, Persona } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Define);
  const [persona, setPersona] = useState<Persona>(Persona.Tutor);

  const renderContent = () => {
    const props = { persona };
    switch (activeTab) {
      case Tab.Define:
        return <DefineTerm {...props} />;
      case Tab.Explain:
        return <TopicExplainer {...props} />;
      case Tab.Analogy:
        return <AnalogyGenerator {...props} />;
      case Tab.Problem:
        return <ProblemCreator {...props} />;
      case Tab.Quiz:
        return <QuizGenerator {...props} />;
      case Tab.LessonPlan:
        return <LessonPlanGenerator {...props} />;
      case Tab.Saved:
        return <SavedItemsViewer />;
      default:
        return <DefineTerm {...props} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <main>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-8">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="w-full sm:w-auto sm:max-w-xs">
              <PersonaSelector selectedPersona={persona} onChange={setPersona} />
            </div>
          </div>
          {renderContent()}
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini API. For educational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
