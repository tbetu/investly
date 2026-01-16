/**
 * Static scenario data for practice exercises
 */

import { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 1,
    ageGroup: ['middle', 'high', 'university'],
    title: 'Central bank raises interest rates',
    category: 'Economy',
    tag: 'Today',
    teaser: 'How might this affect your portfolio?',
    story:
      'Today, the central bank announced a 1% increase in interest rates to fight rising inflation. This is the third rate hike this year. Economists predict this move will slow down borrowing and spending in the short term.',
    questionText: 'What is most likely to happen in the short term?',
    choices: [
      {
        text: 'Borrowing becomes more expensive and people might spend less',
        correct: true,
        explanation:
          'Exactly right! When interest rates increase, loans become more expensive. This means people and businesses are less likely to borrow money, which usually leads to reduced spending. The central bank does this intentionally to cool down an overheating economy and control inflation.',
      },
      {
        text: 'Borrowing becomes cheaper and people rush to take loans',
        correct: false,
        explanation:
          'Not quite. When interest rates increase, borrowing actually becomes MORE expensive, not cheaper. This means fewer people take out loans.',
      },
      {
        text: 'Nothing changes at all',
        correct: false,
        explanation:
          'Interest rate changes have significant effects on the economy. They influence borrowing costs, savings rates, and overall economic activity.',
      },
    ],
    stockImpact:
      'Higher interest rates typically lead to lower stock valuations in the short term, especially for growth companies. However, bank stocks might benefit as they can charge more for loans.',
    iconName: 'trending-up',
    iconColor: '#2563eb',
    bgColor: '#dbeafe',
  },
  {
    id: 2,
    ageGroup: ['middle', 'high', 'university'],
    title: 'Tech company announces record profits',
    category: 'Company News',
    tag: 'Yesterday',
    teaser: 'What does this mean for tech stocks?',
    story:
      'A major technology company just released its quarterly earnings report, showing profits that exceeded analyst expectations by 25%. The company also announced plans to expand into new markets.',
    questionText: 'How might the stock price react?',
    choices: [
      {
        text: 'The stock price will likely increase as investors see strong performance',
        correct: true,
        explanation:
          'Correct! When a company exceeds profit expectations, it typically signals strong business performance and growth potential. This positive news usually drives increased investor demand, pushing the stock price up.',
      },
      {
        text: 'The stock price will drop because profits were too high',
        correct: false,
        explanation:
          'High profits are generally good news for a company and its investors. They rarely cause a stock price to drop.',
      },
      {
        text: 'The stock price will remain unchanged regardless of earnings',
        correct: false,
        explanation:
          'Earnings reports are major catalysts for stock price movements. Strong earnings typically lead to price increases.',
      },
    ],
    stockImpact:
      "Strong earnings often lead to stock price increases. The company's expansion plans might attract even more investors looking for growth opportunities.",
    iconName: 'briefcase',
    iconColor: '#16a34a',
    bgColor: '#dcfce7',
  },
  {
    id: 3,
    ageGroup: ['high', 'university'],
    title: 'Global oil prices surge',
    category: 'Global Events',
    tag: '2 days ago',
    teaser: 'How will energy stocks react?',
    story:
      'Due to geopolitical tensions in oil-producing regions, global oil prices have surged by 15% in the past week. Energy analysts predict prices could remain elevated for several months.',
    questionText: 'Which sector is most likely to benefit from this news?',
    choices: [
      {
        text: 'Energy and oil companies',
        correct: true,
        explanation:
          'Correct! When oil prices rise, companies that produce and sell oil typically see higher revenues and profits. Their stock prices often increase as a result.',
      },
      {
        text: 'Airlines and transportation companies',
        correct: false,
        explanation:
          'Actually, airlines and transportation companies are usually hurt by higher oil prices because fuel is a major cost for them.',
      },
      {
        text: 'Technology companies',
        correct: false,
        explanation:
          'While tech companies may be indirectly affected, they are not the primary beneficiaries of oil price increases.',
      },
    ],
    stockImpact:
      'Energy stocks typically rise with oil prices. However, industries that rely heavily on fuel (like airlines) may see their costs increase, potentially hurting their stock prices.',
    iconName: 'globe',
    iconColor: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    id: 4,
    ageGroup: ['middle', 'high', 'university'],
    title: 'Inflation rate drops unexpectedly',
    category: 'Economy',
    tag: '3 days ago',
    teaser: 'What opportunities does this create?',
    story:
      'The latest economic data shows that inflation has dropped more than expected, falling from 6% to 4%. This is welcome news for consumers and businesses dealing with rising costs.',
    questionText: 'How might the stock market react to lower inflation?',
    choices: [
      {
        text: 'Stock prices may rise as lower inflation reduces economic uncertainty',
        correct: true,
        explanation:
          'Correct! Lower inflation is generally positive for stocks. It reduces uncertainty, may lead to lower interest rates, and can boost consumer spending power.',
      },
      {
        text: 'Stock prices will definitely crash',
        correct: false,
        explanation:
          'Lower inflation is typically good news for the economy and stock market, not a cause for a crash.',
      },
      {
        text: 'Inflation has no effect on stock prices',
        correct: false,
        explanation:
          'Inflation has significant effects on stock prices through its impact on interest rates, consumer spending, and business costs.',
      },
    ],
    stockImpact:
      'Lower inflation can be positive for most stocks, especially growth stocks that benefit from lower interest rates. Consumer discretionary stocks may also benefit as people have more purchasing power.',
    iconName: 'trending-up',
    iconColor: '#9333ea',
    bgColor: '#f3e8ff',
  },
  {
    id: 5,
    ageGroup: ['high', 'university'],
    title: 'New environmental regulations announced',
    category: 'Global Events',
    tag: '1 week ago',
    teaser: 'Which sectors will be impacted?',
    story:
      'Governments around the world have announced stricter environmental regulations requiring companies to reduce carbon emissions by 40% over the next decade. This will require significant investments in clean technology.',
    questionText: 'Which type of company might benefit most from these regulations?',
    choices: [
      {
        text: 'Renewable energy and clean technology companies',
        correct: true,
        explanation:
          'Correct! Companies that provide clean energy solutions and environmental technology are likely to see increased demand as other businesses need to comply with new regulations.',
      },
      {
        text: 'Traditional coal mining companies',
        correct: false,
        explanation:
          'Coal companies are likely to be negatively affected by stricter environmental regulations, not benefit from them.',
      },
      {
        text: 'Fast food restaurants',
        correct: false,
        explanation:
          'While all businesses may be affected by environmental regulations, fast food restaurants are not the primary beneficiaries of clean energy policies.',
      },
    ],
    stockImpact:
      'Clean energy stocks often rise on news of stricter environmental regulations. Traditional energy companies may face challenges, while companies providing green solutions see increased opportunities.',
    iconName: 'globe',
    iconColor: '#0d9488',
    bgColor: '#ccfbf1',
  },
];

// Helper function to get scenarios by age group
export const getScenariosByAgeGroup = (ageGroup: string): Scenario[] => {
  return scenarios.filter((s) => s.ageGroup.includes(ageGroup as any));
};

// Helper function to get scenario by ID
export const getScenarioById = (id: number): Scenario | undefined => {
  return scenarios.find((s) => s.id === id);
};
