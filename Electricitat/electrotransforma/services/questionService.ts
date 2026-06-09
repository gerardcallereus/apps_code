import { Question } from "../types";
import { QUESTIONS_DB } from "../constants";

/**
 * Retrieves random questions from the local database.
 * Executes entirely locally without any external API or AI.
 */
export const getRandomQuestions = async (count: number = 10): Promise<Question[]> => {
  // Create a copy to avoid mutating the original constant
  const shuffledQuestions = [...QUESTIONS_DB];

  // 1. Shuffle the order of questions (Fisher-Yates algorithm)
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  // Select the requested number of questions
  // If count is larger than DB size, it returns all available questions
  const selectedQuestions = shuffledQuestions.slice(0, count);

  // 2. Shuffle the options within each question
  const questionsWithShuffledOptions = selectedQuestions.map(question => {
    const options = [...question.options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      ...question,
      options
    };
  });

  // Small delay to smooth out the UI transition (simulate loading)
  await new Promise(resolve => setTimeout(resolve, 400));

  return questionsWithShuffledOptions;
};