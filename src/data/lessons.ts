/**
 * Static lesson data filtered by age group
 */

import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 1,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    title: 'What is Money?',
    category: 'Basics',
    difficulty: 'Beginner',
    content: [
      "Money is a tool we use to buy things we need or want. Instead of trading items directly (like swapping your toy for someone else's snack), we use money as a common way to exchange value.",
      'Money has three main purposes:',
      '• Medium of Exchange – You can use it to buy goods and services',
      '• Store of Value – You can save it for later',
      '• Unit of Account – It helps measure how much things are worth',
    ],
    levelNote:
      'Money also acts as a standard of deferred payment, meaning you can borrow and lend using money with the promise of repayment in the future.',
    iconName: 'piggy-bank',
    iconColor: '#ca8a04',
    bgColor: '#fef9c3',
  },
  {
    id: 2,
    ageGroup: ['middle', 'high', 'university'],
    title: 'Central Banks and Interest Rates',
    category: 'Basics',
    difficulty: 'Intermediate',
    content: [
      'A central bank is like the "bank of all banks" in a country. It controls how much money is available and sets important rates that affect the entire economy.',
      'One of its most important tools is the interest rate – the cost of borrowing money.',
      '• When the central bank RAISES interest rates:',
      '  - Borrowing becomes more expensive',
      '  - People and businesses tend to save more and spend less',
      '  - This helps control inflation (when prices rise too fast)',
      '• When the central bank LOWERS interest rates:',
      '  - Borrowing becomes cheaper',
      '  - People and businesses are encouraged to spend and invest',
      '  - This can help boost economic growth',
    ],
    levelNote:
      'Central banks also use other monetary policy tools like reserve requirements, open market operations, and quantitative easing to manage the money supply and economic stability.',
    iconName: 'trending-up',
    iconColor: '#2563eb',
    bgColor: '#dbeafe',
  },
  {
    id: 3,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    title: 'Why do prices change?',
    category: 'Inflation',
    difficulty: 'Beginner',
    content: [
      'Have you noticed that things sometimes cost more than they used to? This is called inflation.',
      "Inflation happens when the general level of prices rises over time. It means your money can buy less than before.",
      'There are several reasons why prices change:',
      '• More money in the economy – When there is more money available, people can spend more, which can push prices up.',
      '• Higher costs for businesses – If it costs more to make products (like raw materials or wages), businesses may raise prices.',
      '• More demand than supply – When many people want something but there is not much of it, the price goes up.',
    ],
    levelNote:
      'Central banks try to keep inflation at a moderate level (usually around 2%) because both high inflation and deflation (falling prices) can be harmful to the economy.',
    iconName: 'lightbulb',
    iconColor: '#9333ea',
    bgColor: '#f3e8ff',
  },
  {
    id: 4,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    title: 'What is a Stock?',
    category: 'Investing',
    difficulty: 'Beginner',
    content: [
      'A stock represents a small piece of ownership in a company. When you buy a stock, you become a shareholder.',
      "As a shareholder, you can benefit in two main ways:",
      '• Capital gains – If the company does well and more people want to buy its stock, the price may go up. You can sell your stock for more than you paid.',
      '• Dividends – Some companies share a portion of their profits with shareholders as regular payments.',
      'Stocks are traded on stock exchanges like BIST (Borsa Istanbul), NYSE (New York Stock Exchange), and NASDAQ.',
    ],
    levelNote:
      'Stock prices are influenced by many factors including company earnings, industry trends, economic conditions, and investor sentiment. Understanding these factors is key to making informed investment decisions.',
    iconName: 'trending-up',
    iconColor: '#16a34a',
    bgColor: '#dcfce7',
  },
  {
    id: 5,
    ageGroup: ['middle', 'high', 'university'],
    title: 'Supply and Demand',
    category: 'Basics',
    difficulty: 'Intermediate',
    content: [
      'Supply and demand is one of the most fundamental concepts in economics.',
      '• Supply is how much of something is available',
      '• Demand is how much people want to buy',
      'When demand is high and supply is low, prices go up. When supply is high and demand is low, prices go down.',
      'This applies to everything from groceries to stocks to houses!',
    ],
    levelNote:
      'The intersection of supply and demand curves determines the market equilibrium price. Understanding elasticity helps predict how much quantity demanded or supplied will change when prices change.',
    iconName: 'lightbulb',
    iconColor: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    id: 6,
    ageGroup: ['elementary', 'middle', 'high', 'university'],
    title: 'How Saving Works',
    category: 'Saving',
    difficulty: 'Beginner',
    content: [
      'Saving is when you keep some of your money instead of spending it all. It is an important habit!',
      "Here's why saving matters:",
      '• Emergency fund – Having money saved can help when unexpected things happen',
      '• Future goals – You can save for things you want, like a bike, a trip, or education',
      '• Financial security – Savings give you more choices and less worry',
      "A good rule is to 'pay yourself first' – save some money before spending on other things.",
    ],
    levelNote:
      'Consider the concept of compound interest – when your savings earn interest, and then that interest earns more interest. Starting to save early can make a big difference over time!',
    iconName: 'piggy-bank',
    iconColor: '#db2777',
    bgColor: '#fce7f3',
  },
];

// Helper function to get lessons by age group
export const getLessonsByAgeGroup = (ageGroup: string): Lesson[] => {
  return lessons.filter((lesson) => lesson.ageGroup.includes(ageGroup as any));
};

// Helper function to get lesson by ID
export const getLessonById = (id: number): Lesson | undefined => {
  return lessons.find((lesson) => lesson.id === id);
};
