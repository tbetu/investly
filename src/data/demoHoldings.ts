/**
 * Initial demo holdings and portfolio data
 */

import { Holding, Badge } from '../types';

export const initialHoldings: Holding[] = [
  {
    id: 1,
    symbol: 'BIST_BANK',
    name: 'Turkish Bank ETF (Demo)',
    quantity: 50,
    avgPrice: 185.4,
    currentPrice: 192.3,
  },
  {
    id: 2,
    symbol: 'NYSE_TECH',
    name: 'US Tech Bundle (Demo)',
    quantity: 10,
    avgPrice: 450.0,
    currentPrice: 468.75,
  },
  {
    id: 3,
    symbol: 'NASDAQ_GROWTH',
    name: 'Growth Stocks (Demo)',
    quantity: 25,
    avgPrice: 210.0,
    currentPrice: 205.5,
  },
];

export const initialBalance = 10000;

export const initialBadges: Badge[] = [
  {
    id: 1,
    name: 'Interest Rate Explorer',
    icon: '🔍',
    unlocked: true,
    requirement: 'Complete the interest rates lesson',
  },
  {
    id: 2,
    name: 'Inflation Detective',
    icon: '🕵️',
    unlocked: true,
    requirement: 'Complete the inflation lesson',
  },
  {
    id: 3,
    name: 'Stock Market Starter',
    icon: '📈',
    unlocked: true,
    requirement: 'Complete your first stock lesson',
  },
  {
    id: 4,
    name: 'Savings Champion',
    icon: '💰',
    unlocked: false,
    requirement: 'Complete all saving-related lessons',
  },
  {
    id: 5,
    name: 'Portfolio Builder',
    icon: '📊',
    unlocked: false,
    requirement: 'Make 10 practice trades',
  },
  {
    id: 6,
    name: 'Economics Master',
    icon: '🎓',
    unlocked: false,
    requirement: 'Complete all lessons with 90%+ quiz scores',
  },
];

// Calculate total value for a holding
export const calculateHoldingValue = (holding: Holding): number => {
  return holding.quantity * holding.currentPrice;
};

// Calculate percentage change for a holding
export const calculateHoldingChange = (holding: Holding): number => {
  return ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
};

// Calculate total portfolio value
export const calculatePortfolioValue = (holdings: Holding[]): number => {
  return holdings.reduce((total, holding) => total + calculateHoldingValue(holding), 0);
};
