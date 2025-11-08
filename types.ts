
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PracticeProblem {
  problemStatement: string;
  stepByStepSolution: string;
}

export interface LessonPlanActivity {
  activityName: string;
  description: string;
  durationMinutes: number;
}

export interface LessonPlan {
  title: string;
  learningObjectives: string[];
  materials: string[];
  lessonActivities: LessonPlanActivity[];
  assessment: string;
  homework: string;
}

export interface SavedItem {
  id: string;
  type: 'Definition' | 'Explanation' | 'Analogy' | 'Problem' | 'Quiz' | 'Lesson Plan';
  topic: string;
  content: any;
  timestamp: string;
}
