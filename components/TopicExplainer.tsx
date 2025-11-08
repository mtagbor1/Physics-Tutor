
import React, { useState } from 'react';
import { AutoCompleteInput } from './common/AutoCompleteInput';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { AudioPlayer } from './common/AudioPlayer';
import { ActionToolbar } from './common/ActionToolbar';
import { Persona, PHYSICS_TOPICS } from '../constants';
import { explainTopic } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface TopicExplainerProps {
  persona: Persona;
}

export const TopicExplainer: React.FC<TopicExplainerProps> = ({ persona }) => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
      const result = await explainTopic(topic, persona);
      setExplanation(result);
    } catch (err) {
      setError('Failed to generate explanation. Please try again.');
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
          placeholder="e.g., Newton's First Law"
          aria-label="Physics Topic"
        />
        <div className="mt-6 text-center">
          <Button onClick={handleGenerate} disabled={isLoading || !topic}>
            {isLoading ? 'Generating...' : 'Generate Explanation'}
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner />}
      {error && <Card><p className="text-red-400 text-center">{error}</p></Card>}
      
      {explanation && (
        <Card>
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-indigo-400">
            <div className="flex justify-between items-center not-prose">
              <h2 className="text-2xl font-bold text-indigo-400">Explanation</h2>
              <AudioPlayer textToSpeak={explanation} />
            </div>
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
          <ActionToolbar content={explanation} topic={topic} type="Explanation" />
        </Card>
      )}
    </div>
  );
};
