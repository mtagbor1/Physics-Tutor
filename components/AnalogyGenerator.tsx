
import React, { useState } from 'react';
import { AutoCompleteInput } from './common/AutoCompleteInput';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { AudioPlayer } from './common/AudioPlayer';
import { ActionToolbar } from './common/ActionToolbar';
import { Persona, PHYSICS_TOPICS } from '../constants';
import { generateAnalogy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AnalogyGeneratorProps {
  persona: Persona;
}

export const AnalogyGenerator: React.FC<AnalogyGeneratorProps> = ({ persona }) => {
  const [topic, setTopic] = useState('');
  const [analogy, setAnalogy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalogy('');
    try {
      const result = await generateAnalogy(topic, persona);
      setAnalogy(result);
    } catch (err) {
      setError('Failed to generate analogy. Please try again.');
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
          value={topic}
          onChange={setTopic}
          placeholder="e.g., Electric Current"
          aria-label="Physics Topic"
        />
        <div className="mt-6 text-center">
          <Button onClick={handleGenerate} disabled={isLoading || !topic}>
            {isLoading ? 'Generating...' : 'Generate Analogy'}
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner />}
      {error && <Card><p className="text-red-400 text-center">{error}</p></Card>}
      
      {analogy && (
        <Card>
           <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-indigo-400">
             <div className="flex justify-between items-center not-prose">
              <h2 className="text-2xl font-bold text-indigo-400">Analogy</h2>
              <AudioPlayer textToSpeak={analogy} />
            </div>
            <ReactMarkdown>{analogy}</ReactMarkdown>
          </div>
          <ActionToolbar content={analogy} topic={topic} type="Analogy" />
        </Card>
      )}
    </div>
  );
};
