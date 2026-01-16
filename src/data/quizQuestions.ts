/**
 * Static quiz questions linked to lessons
 */

import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  // Lesson 1: What is Money?
  {
    id: 1,
    lessonId: 1,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    questionText: 'Which of the following is NOT a main purpose of money?',
    choices: [
      { text: 'Medium of exchange', correct: false },
      { text: 'Entertainment value', correct: true },
      { text: 'Store of value', correct: false },
    ],
    explanation:
      'Correct! While money enables many things including entertainment purchases, "entertainment value" is not one of the core functions of money. The three main purposes are: medium of exchange, store of value, and unit of account.',
  },
  {
    id: 2,
    lessonId: 1,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    questionText: 'What does "store of value" mean?',
    choices: [
      { text: 'Money can be used to buy things', correct: false },
      { text: 'Money can be saved for later', correct: true },
      { text: 'Money is kept in a store', correct: false },
    ],
    explanation:
      'Correct! "Store of value" means money holds its worth over time and can be saved for future use.',
  },
  // Lesson 2: Central Banks and Interest Rates
  {
    id: 3,
    lessonId: 2,
    ageGroup: ['middle', 'high', 'university'],
    questionText:
      'If the central bank increases interest rates, what usually happens in the short term?',
    choices: [
      { text: 'Borrowing becomes more expensive and people might spend less', correct: true },
      { text: 'Borrowing becomes cheaper and people rush to take loans', correct: false },
      { text: 'Nothing changes at all', correct: false },
    ],
    explanation:
      'Exactly right! When interest rates increase, the cost of borrowing money goes up. This makes loans more expensive, so people and businesses tend to borrow less and spend less.',
  },
  {
    id: 4,
    lessonId: 2,
    ageGroup: ['middle', 'high', 'university'],
    questionText: 'What is one reason a central bank might lower interest rates?',
    choices: [
      { text: 'To slow down economic growth', correct: false },
      { text: 'To encourage spending and investment', correct: true },
      { text: 'To make saving more attractive', correct: false },
    ],
    explanation:
      'Correct! Lower interest rates make borrowing cheaper, which encourages people and businesses to spend and invest, potentially boosting economic growth.',
  },
  // Lesson 3: Why do prices change?
  {
    id: 5,
    lessonId: 3,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    questionText: 'What is inflation?',
    choices: [
      { text: 'When prices generally rise over time', correct: true },
      { text: 'When prices generally fall over time', correct: false },
      { text: 'When prices stay the same', correct: false },
    ],
    explanation:
      'Correct! Inflation is when the general level of prices rises over time, meaning your money can buy less than before.',
  },
  {
    id: 6,
    lessonId: 3,
    ageGroup: ['middle', 'high', 'university'],
    questionText: 'Which of these can cause prices to increase?',
    choices: [
      { text: 'More supply than demand', correct: false },
      { text: 'More demand than supply', correct: true },
      { text: 'Prices never change', correct: false },
    ],
    explanation:
      'Correct! When demand exceeds supply, prices tend to go up. If many people want something but there is not much of it available, sellers can charge more.',
  },
  // Lesson 4: What is a Stock?
  {
    id: 7,
    lessonId: 4,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    questionText: 'What does owning a stock mean?',
    choices: [
      { text: 'You own a small piece of a company', correct: true },
      { text: 'You owe money to a company', correct: false },
      { text: 'You work for the company', correct: false },
    ],
    explanation:
      'Correct! When you buy a stock, you become a shareholder, which means you own a small piece of that company.',
  },
  {
    id: 8,
    lessonId: 4,
    ageGroup: ['middle', 'high', 'university'],
    questionText: 'What are dividends?',
    choices: [
      { text: 'Fees you pay to buy stocks', correct: false },
      { text: 'Profits shared with shareholders', correct: true },
      { text: 'The price of a stock', correct: false },
    ],
    explanation:
      'Correct! Dividends are portions of a company\'s profits that are distributed to shareholders as regular payments.',
  },
  // Lesson 5: Supply and Demand
  {
    id: 9,
    lessonId: 5,
    ageGroup: ['middle', 'high', 'university'],
    questionText: 'What happens to prices when demand is high and supply is low?',
    choices: [
      { text: 'Prices go down', correct: false },
      { text: 'Prices stay the same', correct: false },
      { text: 'Prices go up', correct: true },
    ],
    explanation:
      'Correct! When many people want something (high demand) but there is not much available (low supply), sellers can charge higher prices.',
  },
  // Lesson 6: How Saving Works
  {
    id: 10,
    lessonId: 6,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    questionText: 'What is a good reason to save money?',
    choices: [
      { text: 'To be prepared for emergencies', correct: true },
      { text: 'Money becomes worthless over time', correct: false },
      { text: 'Saving is not important', correct: false },
    ],
    explanation:
      'Correct! Having an emergency fund is one of the key benefits of saving. It helps you handle unexpected expenses without going into debt.',
  },
];

// Helper function to get quiz questions by lesson ID
export const getQuestionsByLessonId = (lessonId: number): QuizQuestion[] => {
  return quizQuestions.filter((q) => q.lessonId === lessonId);
};

// Helper function to get quiz questions by age group
export const getQuestionsByAgeGroup = (ageGroup: string): QuizQuestion[] => {
  return quizQuestions.filter((q) => q.ageGroup.includes(ageGroup as any));
};
