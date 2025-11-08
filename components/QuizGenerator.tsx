
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AutoCompleteInput } from './common/AutoCompleteInput';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Select } from './common/Select';
import { Spinner } from './common/Spinner';
import { Input } from './common/Input';
import { QuizResultsChart } from './common/QuizResultsChart';
import { ActionToolbar } from './common/ActionToolbar';
import { AudioPlayer } from './common/AudioPlayer';
import { Difficulty, PHYSICS_TOPICS, Persona } from '../constants';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

interface QuizGeneratorProps {
    persona: Persona; // Note: persona is passed for consistency but not used in generateQuiz
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setQuiz([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setShowReview(false);

    try {
      const result = await generateQuiz(topic, numQuestions, difficulty);
      if (result.length === 0) {
        setError('Could not generate a quiz for this topic. Please try another one.');
      } else {
        setQuiz(result);
      }
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setQuiz([]);
    setShowResults(false);
    setShowReview(false);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
  }

  const calculateScore = () => {
    if (quiz.length === 0) return 0;
    const correctAnswers = quiz.reduce((count, question, index) => {
      return userAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    return (correctAnswers / quiz.length) * 100;
  };

  if (isLoading) return <Spinner />;
  if (error) return <Card><p className="text-red-400 text-center">{error}</p></Card>;

  if (showReview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-400">Review Answers</h2>
            <Button onClick={() => setShowReview(false)} variant="secondary">Back to Results</Button>
        </div>
        {quiz.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          return (
            <Card key={index}>
              <div className="mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-400">Question {index + 1}</p>
                        <h3 className="text-lg mt-1 text-white">{question.question}</h3>
                    </div>
                    <span className={`text-2xl ml-4 pt-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? '✔' : '✖'}
                    </span>
                </div>
              </div>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isUserAnswer = userAnswer === option;
                  const isCorrectAnswer = question.correctAnswer === option;
                  
                  let optionClasses = 'w-full text-left p-4 rounded-lg border-2 ';

                  if (isCorrectAnswer) {
                    optionClasses += 'bg-green-900/50 border-green-500 text-white';
                  } else if (isUserAnswer) { // And therefore incorrect
                    optionClasses += 'bg-red-900/50 border-red-500 text-white line-through';
                  } else {
                    optionClasses += 'bg-gray-700 border-gray-600 text-gray-400';
                  }
                  
                  return (
                    <div key={optionIndex} className={optionClasses}>
                      {option}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700/50 prose prose-invert max-w-none prose-p:text-gray-300">
                <div className="flex justify-between items-center not-prose mb-2">
                    <h4 className="text-md font-semibold text-indigo-300">Explanation</h4>
                    <AudioPlayer textToSpeak={question.explanation} />
                </div>
                <ReactMarkdown>{question.explanation}</ReactMarkdown>
              </div>
            </Card>
          );
        })}
        <div className="text-center mt-8">
            <Button onClick={handleRestart}>Take a New Quiz</Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const resultData = {
        questions: quiz,
        userAnswers,
        score,
    };
    return (
      <Card className="text-center">
        <h2 className="text-3xl font-bold text-indigo-400 mb-4">Quiz Results</h2>
        <div className="flex justify-center my-8">
            <QuizResultsChart score={score} />
        </div>
        <p className="text-lg text-gray-300 mb-6">You answered {Math.round(score / 100 * quiz.length)} out of {quiz.length} questions correctly.</p>
        <div className="flex justify-center items-center gap-4">
          <Button onClick={handleRestart}>Try Another Quiz</Button>
          <Button onClick={() => setShowReview(true)} variant="secondary">Review Answers</Button>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-6 flex justify-center">
           <ActionToolbar content={{ questions: quiz, score }} topic={topic} type="Quiz" />
        </div>
      </Card>
    );
  }

  if (quiz.length > 0) {
    const question = quiz[currentQuestionIndex];
    const textToSpeak = `Question: ${question.question}. The options are: ${question.options.join('. ')}`;
    return (
      <Card>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {quiz.length}</p>
            <AudioPlayer textToSpeak={textToSpeak} />
          </div>
          <h2 className="text-xl mt-2 text-white">{question.question}</h2>
        </div>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                userAnswers[currentQuestionIndex] === option
                  ? 'bg-indigo-900 border-indigo-500'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Button onClick={handleNext} disabled={!userAnswers[currentQuestionIndex]}>
            {currentQuestionIndex < quiz.length - 1 ? 'Next' : 'Finish Quiz'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <AutoCompleteInput
            suggestions={PHYSICS_TOPICS}
            value={topic}
            onChange={setTopic}
            placeholder="e.g., Thermodynamics"
            aria-label="Physics Topic"
          />
        </div>
        <div>
          <label htmlFor="num-questions" className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
          <Input 
            id="num-questions"
            type="number" 
            value={numQuestions} 
            onChange={e => setNumQuestions(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            max="10"
          />
        </div>
        <div>
          <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
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
          {isLoading ? 'Generating...' : 'Generate Quiz'}
        </Button>
      </div>
    </Card>
  );
};