
import React, { useState } from 'react';
import { AutoCompleteInput } from './common/AutoCompleteInput';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { AudioPlayer } from './common/AudioPlayer';
import { ActionToolbar } from './common/ActionToolbar';
import { Persona, PHYSICS_TOPICS } from '../constants';
import { defineTerm } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface DefineTermProps {
  persona: Persona;
}

export const DefineTerm: React.FC<DefineTermProps> = ({ persona }) => {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!term) {
      setError('Please enter a term.');
      return;
    }
    setIsLoading(true);
    setError('');
    setDefinition('');
    try {
      const result = await defineTerm(term, persona);
      setDefinition(result);
    } catch (err) {
      setError('Failed to generate definition. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <AutoCompleteInput
          suggestions={PHYSICS_TOPICS}
          value={term}
          onChange={setTerm}
          placeholder="e.g., Entropy"
          aria-label="Physics Term"
        />
        <div className="mt-6 text-center">
          <Button onClick={handleGenerate} disabled={isLoading || !term}>
            {isLoading ? 'Defining...' : 'Define Term'}
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner />}
      {error && <Card><p className="text-red-400 text-center">{error}</p></Card>}
      
      {definition && (
        <Card>
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-indigo-400">
            <div className="flex justify-between items-center not-prose">
              <h2 className="text-2xl font-bold text-indigo-400">Definition</h2>
              <AudioPlayer textToSpeak={definition} />
            </div>
            <ReactMarkdown>{definition}</ReactMarkdown>
          </div>
          <ActionToolbar content={definition} topic={term} type="Definition" />
        </Card>
      )}
    </div>
  );
};
