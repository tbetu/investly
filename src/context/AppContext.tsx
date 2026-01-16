/**
 * Global app state management using React Context
 * Handles user preferences, portfolio state, and progress tracking
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AgeLevel, Holding, UserProgress, Badge, AppState } from '../types';
import {
  initialHoldings,
  initialBalance,
  initialBadges,
  calculatePortfolioValue,
} from '../data/demoHoldings';
import { GAME_ASSETS } from '../data/gameData';

// Initial user progress
const initialProgress: UserProgress = {
  lessonsCompleted: [],
  quizResults: {},
  scenariosCompleted: [],
  xp: 0,
  level: 1,
};

// Initial app state
const initialState: AppState = {
  ageGroup: 'high',
  userName: 'Ahmet Rasim',
  balance: initialBalance,
  holdings: initialHoldings,
  progress: initialProgress,
  badges: initialBadges,
  hasCompletedOnboarding: false,
};

// Context type definition
interface AppContextType {
  state: AppState;
  // Age group
  setAgeGroup: (ageGroup: AgeLevel) => void;
  // Onboarding
  completeOnboarding: () => void;
  // Portfolio actions
  buyInstrument: (symbol: string, quantity: number) => boolean;
  sellInstrument: (symbol: string, quantity: number) => boolean;
  getPortfolioValue: () => number;
  getTotalValue: () => number;
  // Progress actions
  completeLesson: (lessonId: number) => void;
  recordQuizResult: (lessonId: number, score: number) => void;
  completeScenario: (scenarioId: number) => void;
  addXP: (amount: number) => void;
  // Badge management
  unlockBadge: (badgeId: number) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Set age group
  const setAgeGroup = useCallback((ageGroup: AgeLevel) => {
    setState((prev) => ({ ...prev, ageGroup }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  // Buy instrument (practice)
  const buyInstrument = useCallback((symbol: string, quantity: number): boolean => {
    const instrument = GAME_ASSETS.find((i) => i.symbol === symbol);
    if (!instrument) return false;

    const cost = instrument.currentPrice * quantity;
    
    setState((prev) => {
      if (prev.balance < cost) return prev;

      const existingHolding = prev.holdings.find((h) => h.symbol === symbol);
      
      let newHoldings: Holding[];
      if (existingHolding) {
        // Update existing holding
        const totalQuantity = existingHolding.quantity + quantity;
        const totalCost = existingHolding.avgPrice * existingHolding.quantity + cost;
        const newAvgPrice = totalCost / totalQuantity;
        
        newHoldings = prev.holdings.map((h) =>
          h.symbol === symbol
            ? { ...h, quantity: totalQuantity, avgPrice: newAvgPrice }
            : h
        );
      } else {
        // Add new holding
        const newHolding: Holding = {
          id: prev.holdings.length + 1,
          symbol: instrument.symbol,
          name: instrument.name,
          quantity,
          avgPrice: instrument.currentPrice,
          currentPrice: instrument.currentPrice,
        };
        newHoldings = [...prev.holdings, newHolding];
      }

      return {
        ...prev,
        balance: prev.balance - cost,
        holdings: newHoldings,
      };
    });

    return true;
  }, []);

  // Sell instrument (practice)
  const sellInstrument = useCallback((symbol: string, quantity: number): boolean => {
    setState((prev) => {
      const holding = prev.holdings.find((h) => h.symbol === symbol);
      if (!holding || holding.quantity < quantity) return prev;

      const proceeds = holding.currentPrice * quantity;
      const newQuantity = holding.quantity - quantity;

      let newHoldings: Holding[];
      if (newQuantity === 0) {
        newHoldings = prev.holdings.filter((h) => h.symbol !== symbol);
      } else {
        newHoldings = prev.holdings.map((h) =>
          h.symbol === symbol ? { ...h, quantity: newQuantity } : h
        );
      }

      return {
        ...prev,
        balance: prev.balance + proceeds,
        holdings: newHoldings,
      };
    });

    return true;
  }, []);

  // Get portfolio value (holdings only)
  const getPortfolioValue = useCallback((): number => {
    return calculatePortfolioValue(state.holdings);
  }, [state.holdings]);

  // Get total value (balance + portfolio)
  const getTotalValue = useCallback((): number => {
    return state.balance + calculatePortfolioValue(state.holdings);
  }, [state.balance, state.holdings]);

  // Complete a lesson
  const completeLesson = useCallback((lessonId: number) => {
    setState((prev) => {
      if (prev.progress.lessonsCompleted.includes(lessonId)) return prev;
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          lessonsCompleted: [...prev.progress.lessonsCompleted, lessonId],
        },
      };
    });
  }, []);

  // Record quiz result
  const recordQuizResult = useCallback((lessonId: number, score: number) => {
    setState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        quizResults: {
          ...prev.progress.quizResults,
          [lessonId]: score,
        },
      },
    }));
  }, []);

  // Complete a scenario
  const completeScenario = useCallback((scenarioId: number) => {
    setState((prev) => {
      if (prev.progress.scenariosCompleted.includes(scenarioId)) return prev;
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          scenariosCompleted: [...prev.progress.scenariosCompleted, scenarioId],
        },
      };
    });
  }, []);

  // Add XP
  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const newXP = prev.progress.xp + amount;
      const newLevel = Math.floor(newXP / 200) + 1;
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          xp: newXP,
          level: newLevel,
        },
      };
    });
  }, []);

  // Unlock a badge
  const unlockBadge = useCallback((badgeId: number) => {
    setState((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true } : b
      ),
    }));
  }, []);

  const value: AppContextType = {
    state,
    setAgeGroup,
    completeOnboarding,
    buyInstrument,
    sellInstrument,
    getPortfolioValue,
    getTotalValue,
    completeLesson,
    recordQuizResult,
    completeScenario,
    addXP,
    unlockBadge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
