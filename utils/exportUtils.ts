
import { LessonPlan, PracticeProblem, QuizQuestion, SavedItem } from "../types";

const formatQuiz = (content: { questions: QuizQuestion[], score?: number }): string => {
    let text = `Quiz on ${content.questions[0]?.question ? 'various topics' : 'Unknown Topic'}\n`;
    if (content.score !== undefined) {
        text += `Final Score: ${Math.round(content.score)}%\n`;
    }
    text += "====================================\n\n";

    content.questions.forEach((q, index) => {
        text += `Question ${index + 1}: ${q.question}\n`;
        q.options.forEach((opt, i) => {
            text += `  ${String.fromCharCode(65 + i)}. ${opt}\n`;
        });
        text += `Correct Answer: ${q.correctAnswer}\n\n`;
    });
    return text;
};

const formatProblem = (problem: PracticeProblem): string => {
    return `Problem Statement:\n${problem.problemStatement}\n\n====================================\n\nStep-by-Step Solution:\n${problem.stepByStepSolution}`;
};

const formatLessonPlan = (plan: LessonPlan): string => {
    let text = `Lesson Plan: ${plan.title}\n\n`;
    text += "Learning Objectives:\n" + plan.learningObjectives.map(o => `- ${o}`).join('\n') + '\n\n';
    text += "Materials:\n" + plan.materials.map(m => `- ${m}`).join('\n') + '\n\n';
    text += "Lesson Activities:\n";
    plan.lessonActivities.forEach(act => {
        text += `- ${act.activityName} (${act.durationMinutes} mins): ${act.description}\n`;
    });
    text += `\nAssessment:\n${plan.assessment}\n\n`;
    text += `Homework:\n${plan.homework}\n`;
    return text;
};

export const formatContentForExport = (item: SavedItem | { type: SavedItem['type'], content: any }): string => {
    switch (item.type) {
        case 'Definition':
        case 'Explanation':
        case 'Analogy':
            return typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2);
        case 'Problem':
            return formatProblem(item.content);
        case 'Quiz':
            // The content could be just the questions, or questions + score
            const quizContent = Array.isArray(item.content) 
                ? { questions: item.content } 
                : item.content;
            return formatQuiz(quizContent);
        case 'Lesson Plan':
            return formatLessonPlan(item.content);
        default:
            return JSON.stringify(item.content, null, 2);
    }
};


export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        return false;
    }
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
};

export const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/ /g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
