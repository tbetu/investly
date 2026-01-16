/**
 * Core type definitions for Investly
 */

// Age level categories
export type AgeLevel = 'elementary' | 'middle' | 'high' | 'university';

// Market data types
export interface MarketIndex {
  id: string;
  name: string;
  fullName: string;
  value: number;
  change: number; // percentage
}

// Lesson types
export interface Lesson {
  id: number;
  ageGroup: AgeLevel[];
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string[];
  levelNote: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
}

// Quiz types
export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: number;
  lessonId: number;
  ageGroup: AgeLevel[];
  questionText: string;
  choices: QuizOption[];
  explanation: string;
}

// Scenario types
export interface ScenarioOption {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Scenario {
  id: number;
  ageGroup: AgeLevel[];
  title: string;
  category: string;
  tag: string;
  teaser: string;
  story: string;
  questionText: string;
  choices: ScenarioOption[];
  stockImpact: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
}

// Portfolio types
export interface Holding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface DemoInstrument {
  symbol: string;
  name: string;
  currentPrice: number;
}

// User progress types
export interface UserProgress {
  lessonsCompleted: number[];
  quizResults: { [lessonId: number]: number }; // lessonId -> score percentage
  scenariosCompleted: number[];
  xp: number;
  level: number;
}

// Badge types
export interface Badge {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}

// App state
export interface AppState {
  ageGroup: AgeLevel;
  userName: string;
  balance: number;
  holdings: Holding[];
  progress: UserProgress;
  badges: Badge[];
  hasCompletedOnboarding: boolean;
}

// End-of-day result summary
export interface AffectedHolding {
  symbol: string;
  name: string;
  changePercent: number;
  changeAmount: number;
}

export interface DayResult {
  date: string;
  scenarioId: string;
  scenarioTitle: string;
  scenarioDescription: string;
  scenarioExplanation: string;
  portfolioValueBefore: number;
  portfolioValueAfter: number;
  totalChange: number;
  affectedHoldings: AffectedHolding[];
}
