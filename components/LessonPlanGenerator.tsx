
import React, { useState } from 'react';
import { AutoCompleteInput } from './common/AutoCompleteInput';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { Input } from './common/Input';
import { ActionToolbar } from './common/ActionToolbar';
import { PHYSICS_TOPICS, Persona } from '../constants';
import { createLessonPlan } from '../services/geminiService';
import { LessonPlan } from '../types';

interface LessonPlanGeneratorProps {
    persona: Persona; // Note: persona is passed for consistency but not used in createLessonPlan
}

export const LessonPlanGenerator: React.FC<LessonPlanGeneratorProps> = () => {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(50);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setLessonPlan(null);
    try {
      const result = await createLessonPlan(topic, duration);
      setLessonPlan(result);
    } catch (err) {
      setError('Failed to create lesson plan. Please try again.');
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
            placeholder="e.g., Quantum Entanglement"
            aria-label="Physics Topic"
          />
          <div>
            <label htmlFor="duration-input" className="block text-sm font-medium text-gray-300 mb-2">
              Class Duration (minutes)
            </label>
            <Input
              id="duration-input"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
              min="10"
              max="180"
            />
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button onClick={handleGenerate} disabled={isLoading || !topic}>
            {isLoading ? 'Creating...' : 'Create Lesson Plan'}
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner />}
      {error && <Card><p className="text-red-400 text-center">{error}</p></Card>}
      
      {lessonPlan && (
        <Card>
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-indigo-400 prose-li:text-gray-300">
                <h2 className="text-2xl font-bold text-indigo-400">{lessonPlan.title}</h2>
                
                <h3 className="text-xl font-semibold mt-6">Learning Objectives</h3>
                <ul>
                    {lessonPlan.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>

                <h3 className="text-xl font-semibold mt-6">Materials</h3>
                <ul>
                    {lessonPlan.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                </ul>
                
                <h3 className="text-xl font-semibold mt-6">Lesson Activities</h3>
                <div className="space-y-4">
                    {lessonPlan.lessonActivities.map((act, i) => (
                    <div key={i} className="p-4 bg-gray-700/50 rounded-lg not-prose">
                        <p className="font-bold text-indigo-300">{act.activityName} ({act.durationMinutes} mins)</p>
                        <p className="text-gray-300">{act.description}</p>
                    </div>
                    ))}
                </div>

                <h3 className="text-xl font-semibold mt-6">Assessment</h3>
                <p>{lessonPlan.assessment}</p>
                
                <h3 className="text-xl font-semibold mt-6">Homework</h3>
                <p>{lessonPlan.homework}</p>
            </div>
            <ActionToolbar content={lessonPlan} topic={topic} type="Lesson Plan" />
        </Card>
      )}
    </div>
  );
};
