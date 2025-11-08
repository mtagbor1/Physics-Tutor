
import React, { useState } from 'react';
import { AutoCompleteInput } from './common/AutoCompleteInput';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Select } from './common/Select';
import { Spinner } from './common/Spinner';
import { AudioPlayer } from './common/AudioPlayer';
import { ActionToolbar } from './common/ActionToolbar';
import { Difficulty, PHYSICS_TOPICS, Persona } from '../constants';
import { createPracticeProblem } from '../services/geminiService';
import { PracticeProblem } from '../types';
import ReactMarkdown from 'react-markdown';

interface ProblemCreatorProps {
  persona: Persona; // Note: persona is passed for consistency but not used in createPracticeProblem
}

export const ProblemCreator: React.FC<ProblemCreatorProps> = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setProblem(null);
    setShowSolution(false);
    try {
      const result = await createPracticeProblem(topic, difficulty);
      setProblem(result);
    } catch (err) {
      setError('Failed to create problem. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AutoCompleteInput
            suggestions={PHYSICS_TOPICS}
            value={topic}
            onChange={setTopic}
            placeholder="e.g., Projectile Motion"
            aria-label="Physics Topic"
          />
          <div>
            <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <Select
              id="difficulty-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button onClick={handleGenerate} disabled={isLoading || !topic}>
            {isLoading ? 'Creating...' : 'Create Problem'}
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner />}
      {error && <Card><p className="text-red-400 text-center">{error}</p></Card>}
      
      {problem && (
        <Card>
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-indigo-400">
            <div className="flex justify-between items-center not-prose">
              <h2 className="text-2xl font-bold text-indigo-400">Practice Problem</h2>
              <AudioPlayer textToSpeak={problem.problemStatement} />
            </div>
            <ReactMarkdown>{problem.problemStatement}</ReactMarkdown>
          </div>
          
          <ActionToolbar content={problem} topic={topic} type="Problem" />

          <div className="not-prose mt-6">
            <Button onClick={() => setShowSolution(!showSolution)}>
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </div>

          {showSolution && (
            <div className="mt-4 pt-4 border-t border-gray-700 prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-indigo-400">
               <div className="flex justify-between items-center not-prose mb-4">
                <h3 className="text-xl font-bold text-indigo-400">Solution</h3>
                <AudioPlayer textToSpeak={problem.stepByStepSolution} />
              </div>
              <ReactMarkdown>{problem.stepByStepSolution}</ReactMarkdown>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
