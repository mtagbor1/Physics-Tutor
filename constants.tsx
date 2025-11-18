// FIX: Implemented constants file.
import React from 'react';

// Tabs
export enum Tab {
  Define = 'define',
  Explain = 'explain',
  Analogy = 'analogy',
  Problem = 'problem',
  Quiz = 'quiz',
  LessonPlan = 'lesson_plan',
  Saved = 'saved',
}

// Icons for Tabs
export const DefineIcon = () => <span className="mr-2">📖</span>;
export const ExplainIcon = () => <span className="mr-2">📚</span>;
export const AnalogyIcon = () => <span className="mr-2">💡</span>;
export const ProblemIcon = () => <span className="mr-2">✍️</span>;
export const QuizIcon = () => <span className="mr-2">❓</span>;
export const LessonPlanIcon = () => <span className="mr-2">📅</span>;
export const SavedIcon = () => <span className="mr-2">💾</span>;

// Difficulty Levels
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

// Personas for AI
export enum Persona {
  Tutor = 'a friendly and encouraging physics tutor for high school students',
  Expert = 'a world-renowned expert physicist explaining a concept to a colleague',
  Kid = 'someone explaining a complex physics topic to a curious 5-year-old',
  Storyteller = 'a captivating storyteller weaving a narrative around a physics concept',
}

// Speaker Icons for AudioPlayer
export const SpeakerWaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

export const StopCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.253 9.253 9 9.563 9h4.874c.31 0 .563.253.563.563v4.874c0 .31-.253.563-.563.563H9.563C9.253 14.437 9 14.184 9 13.874V9.563z" />
    </svg>
);

export const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
      <path d="M6 10.5a.75.75 0 01.75.75v.75a4.5 4.5 0 009 0v-.75a.75.75 0 011.5 0v.75a6 6 0 11-12 0v-.75A.75.75 0 016 10.5z" />
    </svg>
);


// Sample physics topics for autocomplete
export const PHYSICS_TOPICS = [
  'Newton\'s Laws of Motion',
  'Kinematics',
  'Dynamics',
  'Work, Energy, and Power',
  'Momentum and Collisions',
  'Rotational Motion',
  'Gravitation',
  'Oscillations and Waves',
  'Thermodynamics',
  'Electromagnetism',
  'Ohm\'s Law',
  'Circuit Analysis',
  'Magnetism',
  'Electromagnetic Induction',
  'Maxwell\'s Equations',
  'Optics',
  'Reflection and Refraction',
  'Lenses and Mirrors',
  'Wave Nature of Light',
  'Quantum Mechanics',
  'Special Relativity',
  'General Relativity',
  'Nuclear Physics',
  'Particle Physics',
  'String Theory',
  'Black Holes',
  'Dark Matter and Dark Energy',
  'The Big Bang Theory',
];