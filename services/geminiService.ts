
// FIX: Implemented the Gemini API service.
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, PracticeProblem, LessonPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const defineTerm = async (term: string, persona: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Define the physics term: "${term}". Provide a concise and easy-to-understand definition.`,
    config: {
        systemInstruction: `You are an AI assistant. ${persona}. Your definitions should be clear, accurate, and straight to the point. Use markdown for formatting.`
    }
  });
  return response.text;
};

export const explainTopic = async (topic: string, persona: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: `Explain the physics topic "${topic}" to me.`,
    config: {
        systemInstruction: `You are an AI assistant. ${persona}. Explain concepts clearly and concisely. Use markdown for formatting.`
    }
  });
  return response.text;
};

export const generateAnalogy = async (topic: string, persona: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a simple and creative analogy for the physics topic: "${topic}".`,
        config: {
            systemInstruction: `You are an AI assistant. ${persona}. Your analogies should be easy to understand and relevant. Use markdown for formatting.`
        }
    });
    return response.text;
};

const practiceProblemSchema = {
    type: Type.OBJECT,
    properties: {
        problemStatement: { type: Type.STRING, description: "The full statement of the physics problem." },
        stepByStepSolution: { type: Type.STRING, description: "A detailed, step-by-step solution to the problem, formatted in Markdown." },
    },
    required: ['problemStatement', 'stepByStepSolution'],
};

export const createPracticeProblem = async (topic: string, difficulty: string): Promise<PracticeProblem> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Create a ${difficulty}-level practice problem about "${topic}". The problem statement should be clear, and the solution should be broken down into easy-to-follow steps.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: practiceProblemSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};


const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING, description: "The text of the multiple-choice question." },
            options: {
                type: Type.ARRAY,
                description: "An array of 4 strings representing the possible answers.",
                items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING, description: "The correct answer, which must exactly match one of the strings in the 'options' array." },
            explanation: { type: Type.STRING, description: "A detailed explanation for why the correct answer is correct." },
        },
        required: ['question', 'options', 'correctAnswer', 'explanation'],
    },
};


export const generateQuiz = async (topic: string, numQuestions: number, difficulty: string): Promise<QuizQuestion[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate a quiz with ${numQuestions} multiple-choice questions about "${topic}". The difficulty should be ${difficulty}. Each question should have 4 options. Ensure one option is clearly the correct answer. For each question, also provide a clear and concise explanation for why the correct answer is correct.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: quizSchema,
        }
    });

    const jsonText = response.text.trim();
    const quiz = JSON.parse(jsonText);
    return quiz.slice(0, numQuestions);
};


const lessonPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A creative and relevant title for the lesson plan." },
        learningObjectives: { type: Type.ARRAY, description: "A list of clear and measurable learning objectives.", items: { type: Type.STRING } },
        materials: { type: Type.ARRAY, description: "A list of materials needed for the lesson.", items: { type: Type.STRING } },
        lessonActivities: {
            type: Type.ARRAY,
            description: "A sequence of activities for the lesson.",
            items: {
                type: Type.OBJECT,
                properties: {
                    activityName: { type: Type.STRING, description: "The name of the activity." },
                    description: { type: Type.STRING, description: "A description of the activity." },
                    durationMinutes: { type: Type.NUMBER, description: "The duration of the activity in minutes." },
                },
                required: ['activityName', 'description', 'durationMinutes'],
            },
        },
        assessment: { type: Type.STRING, description: "How students' understanding will be assessed." },
        homework: { type: Type.STRING, description: "A homework assignment for students." },
    },
    required: ['title', 'learningObjectives', 'materials', 'lessonActivities', 'assessment', 'homework'],
};

export const createLessonPlan = async (topic: string, duration: number): Promise<LessonPlan> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Create a detailed lesson plan for a ${duration}-minute class on the physics topic: "${topic}".`,
        config: {
            systemInstruction: "You are an expert curriculum developer creating a lesson plan for a high school physics class.",
            responseMimeType: "application/json",
            responseSchema: lessonPlanSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateSpeech = async (textToSpeak: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with a clear and helpful tone: ${textToSpeak}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API.");
    }
    return base64Audio;
};
