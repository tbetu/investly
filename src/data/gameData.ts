// Game loop data structures and starter data
// This file adapts the web game's "source of truth" to React Native

export type AgeGroupKey = 'LOW' | 'MID' | 'HIGH';

export interface User {
  name: string;
  ageGroup: AgeGroupKey;
  currentDay: number;
}

export type Market = 'BIST' | 'NASDAQ' | 'NYSE' | 'GLOBAL' | 'OTHER';

export interface Instrument {
  symbol: string;
  name: string;
  market: Market;
  sector: string;
  basePrice: number;
  currentPrice: number;
  changePercent: number; // decimal form (0.02 = 2%)
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  explanation: string;
  impact: Record<string, number>; // symbol -> decimal impact
}

export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  explanation?: string;
  options: QuestionOption[];
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
}

export interface Portfolio {
  cashBalance: number;
  holdings: Holding[];
}

// Seed instruments before exporting shared asset list
export const INITIAL_INSTRUMENTS: Instrument[] = [
  { symbol: 'KOC', name: 'Koc Holding', market: 'BIST', sector: 'Conglomerate', basePrice: 150.0, currentPrice: 150.0, changePercent: 0 },
  { symbol: 'THYAO', name: 'Turkish Airlines', market: 'BIST', sector: 'Airlines', basePrice: 240.0, currentPrice: 240.0, changePercent: 0 },
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ', sector: 'Technology', basePrice: 180.0, currentPrice: 180.0, changePercent: 0 },
  { symbol: 'MSFT', name: 'Microsoft', market: 'NASDAQ', sector: 'Technology', basePrice: 400.0, currentPrice: 400.0, changePercent: 0 },
  { symbol: 'KO', name: 'Coca-Cola', market: 'NYSE', sector: 'Consumer Staples', basePrice: 60.0, currentPrice: 60.0, changePercent: 0 },
  { symbol: 'DIS', name: 'Disney', market: 'NYSE', sector: 'Entertainment', basePrice: 90.0, currentPrice: 90.0, changePercent: 0 },
  // Daily Hotshots universe
  { symbol: 'PGSUS', name: 'Pegasus Airlines', market: 'BIST', sector: 'Airlines', basePrice: 100, currentPrice: 100, changePercent: 0 },
  { symbol: 'TREN', name: 'Trendyol', market: 'BIST', sector: 'E-commerce', basePrice: 80, currentPrice: 80, changePercent: 0 },
  { symbol: 'INSA', name: 'Limak Insaat', market: 'BIST', sector: 'Construction', basePrice: 60, currentPrice: 60, changePercent: 0 },
  { symbol: 'INSD', name: 'Insider', market: 'GLOBAL', sector: 'SaaS / Tech', basePrice: 120, currentPrice: 120, changePercent: 0 },
  { symbol: 'ETST', name: 'Etstur', market: 'BIST', sector: 'Tourism', basePrice: 70, currentPrice: 70, changePercent: 0 },
  { symbol: 'MEDIA', name: 'MediaMarkt', market: 'BIST', sector: 'Electronics Retail', basePrice: 50, currentPrice: 50, changePercent: 0 },
  { symbol: 'ODL', name: 'OdeAl / Iyzico', market: 'BIST', sector: 'Fintech / Payment Systems', basePrice: 90, currentPrice: 90, changePercent: 0 },
  { symbol: 'KCS', name: 'KocSistem', market: 'BIST', sector: 'Cybersecurity / IT', basePrice: 85, currentPrice: 85, changePercent: 0 },
];

// Single source of truth for assets used across dashboard + portfolio
export type GameAsset = Instrument;
export const GAME_ASSETS: GameAsset[] = INITIAL_INSTRUMENTS;

// Simple market index snapshot reused by legacy Home screen and summaries
export const MARKET_INDICES = [
  {
    id: 'bist',
    name: 'BIST Index',
    fullName: 'Borsa Istanbul',
    value: 8742.35,
    change: 2.34,
  },
  {
    id: 'nyse',
    name: 'NYSE Index',
    fullName: 'New York Stock Exchange',
    value: 17234.82,
    change: 0.87,
  },
  {
    id: 'nasdaq',
    name: 'NASDAQ Index',
    fullName: 'NASDAQ Composite',
    value: 15892.44,
    change: -0.42,
  },
];

// Placeholder scenarios keyed by age group.
// Impacts are expressed as decimal percentages (0.01 = +1%).
export const SCENARIOS: Record<AgeGroupKey, Scenario[]> = {
  LOW: [
    {
      id: 'low-1',
      title: 'Theme Park Weekend',
      description: 'Families flock to the park for a special event.',
      explanation: 'Entertainment spending jumps when parks are busy, lifting related stocks.',
      impact: { DIS: 0.015, KO: 0.006 },
    },
    {
      id: 'low-2',
      title: 'Rainy School Days',
      description: 'Bad weather reduces travel demand for a few days.',
      explanation: 'Rain dampens travel demand, which can hurt airlines while staples hold steady.',
      impact: { THYAO: -0.012, KO: 0.003 },
    },
  ],
  MID: [
    {
      id: 'mid-1',
      title: 'Tech Product Launch',
      description: 'A major phone launch boosts chip demand and app downloads.',
      explanation: 'Successful launches increase device and software demand, boosting big tech.',
      impact: { AAPL: 0.018, MSFT: 0.01 },
    },
    {
      id: 'mid-2',
      title: 'Fuel Prices Dip',
      description: 'Lower jet fuel prices help airlines improve margins.',
      explanation: 'Cheaper fuel cuts airline costs, helping carriers and industrials tied to them.',
      impact: { THYAO: 0.012, KOC: 0.004 },
    },
  ],
  HIGH: [
    {
      id: 'high-1',
      title: 'Interest Rate Cut',
      description: 'Central bank announces a surprise rate cut to spur growth.',
      explanation: 'Rate cuts lower borrowing costs and often lift equities, especially growth names.',
      impact: { KOC: 0.01, AAPL: 0.008, MSFT: 0.008 },
    },
    {
      id: 'high-2',
      title: 'Streaming Slowdown',
      description: 'Entertainment spending cools as budgets tighten.',
      explanation: 'Tighter budgets trim entertainment spend, pressuring media while staples hold value.',
      impact: { DIS: -0.01, KO: -0.004 },
    },
  ],
};

// Simple quiz placeholders for compilation; replace with real content as needed.
export const QUIZZES: Record<AgeGroupKey, Question[]> = {
  LOW: [
    {
      id: 'low-q1',
      prompt: 'What does a stock price represent?',
      explanation: 'Stock prices reflect what buyers are willing to pay now.',
      options: [
        { id: 'low-q1-a', text: 'Today’s cost to buy one share', correct: true },
        { id: 'low-q1-b', text: 'Guaranteed future value', correct: false },
        { id: 'low-q1-c', text: 'Company profit for the year', correct: false },
      ],
    },
  ],
  MID: [
    {
      id: 'mid-q1',
      prompt: 'Why do companies issue stock?',
      explanation: 'They raise capital without taking on debt.',
      options: [
        { id: 'mid-q1-a', text: 'To borrow money with interest', correct: false },
        { id: 'mid-q1-b', text: 'To raise money by selling ownership', correct: true },
        { id: 'mid-q1-c', text: 'To increase product prices', correct: false },
      ],
    },
  ],
  HIGH: [
    {
      id: 'high-q1',
      prompt: 'What can cause daily price swings?',
      explanation: 'News, earnings, and investor sentiment drive volatility.',
      options: [
        { id: 'high-q1-a', text: 'Random volatility and news', correct: true },
        { id: 'high-q1-b', text: 'Prices never change intraday', correct: false },
        { id: 'high-q1-c', text: 'Only earnings reports', correct: false },
      ],
    },
  ],
};

export const INITIAL_PORTFOLIO: Portfolio = {
  cashBalance: 10000,
  holdings: [],
};
