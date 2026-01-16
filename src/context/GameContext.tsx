import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  AgeGroupKey,
  Instrument,
  Portfolio,
  Scenario,
  User,
  INITIAL_INSTRUMENTS,
  SCENARIOS,
  INITIAL_PORTFOLIO,
} from '../data/gameData';
import { DayResult } from '../types';
import { getProfile, updateProfile } from '../data/profileStore';
import { DailyHotshotEvent, pickTodayHotshot } from '../data/dailyHotshots';

type TradeType = 'buy' | 'sell';

interface GameContextValue {
  user: User;
  market: Instrument[];
  currentScenario: Scenario | null;
  todayHotshot: DailyHotshotEvent | null;
  portfolio: Portfolio;
  nextTurn: () => Scenario | null;
  trade: (symbol: string, quantity: number, type: TradeType) => boolean;
  getHoldingsValue: () => number;
  getNetWorth: () => number;
  endDayWithResult: () => DayResult | null;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

const initialUser: User = {
  name: 'Student',
  ageGroup: 'HIGH',
  currentDay: 1,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);
  const [market, setMarket] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [todayHotshot, setTodayHotshot] = useState<DailyHotshotEvent | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    const profile = getProfile();
    return {
      ...INITIAL_PORTFOLIO,
      cashBalance: profile.cash ?? INITIAL_PORTFOLIO.cashBalance,
    };
  });

  useEffect(() => {
    setTodayHotshot(pickTodayHotshot(new Date()));
  }, [user.currentDay]);

  const calculateHoldingsValueForMarket = useCallback(
    (marketSnapshot: Instrument[], holdings: Portfolio['holdings']): number => {
      return holdings.reduce((total, holding) => {
        const instrument = marketSnapshot.find((inst) => inst.symbol === holding.symbol);
        const price = instrument ? instrument.currentPrice : 0;
        return total + holding.quantity * price;
      }, 0);
    },
    []
  );

  const ensureHotshotForDay = useCallback((): DailyHotshotEvent => {
    if (todayHotshot) return todayHotshot;
    const picked = pickTodayHotshot(new Date());
    setTodayHotshot(picked);
    return picked;
  }, [todayHotshot]);

  const applyHotshotToMarket = useCallback(
    (marketSnapshot: Instrument[], hotshot: DailyHotshotEvent) => {
      const symbols = new Set(marketSnapshot.map((inst) => inst.symbol));
      const unknownKeys = Object.keys(hotshot.impact).filter((key) => !symbols.has(key));
      if (unknownKeys.length > 0) {
        console.warn(
          '[GameContext] Hotshot impact contains unknown symbols:',
          unknownKeys.join(', ')
        );
      }

      return marketSnapshot.map((inst) => {
        const delta = hotshot.impact[inst.symbol] ?? 0;
        const newPrice = inst.currentPrice * (1 + delta);

        return {
          ...inst,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          changePercent: delta,
        };
      });
    },
    []
  );

  const applyScenarioToMarket = useCallback((marketSnapshot: Instrument[], scenario: Scenario) => {
    return marketSnapshot.map((inst) => {
      // Base volatility (+/- 2%)
      const volatility = (Math.random() - 0.5) * 0.04;
      // Scenario impact for this instrument
      const scenarioImpact = scenario.impact[inst.symbol] || 0;
      // Total change (decimal form)
      const totalChangePercent = volatility + scenarioImpact;
      // New price after applying change
      const newPrice = inst.currentPrice * (1 + totalChangePercent);

      return {
        ...inst,
        currentPrice: parseFloat(newPrice.toFixed(2)),
        changePercent: totalChangePercent,
      };
    });
  }, []);

  const pickScenario = useCallback(
    (ageGroup: AgeGroupKey): Scenario => {
      const scenariosByAge = SCENARIOS[ageGroup] || SCENARIOS.HIGH;
      // Equal probability for all scenarios (no weighting yet for MVP)
      return scenariosByAge[Math.floor(Math.random() * scenariosByAge.length)];
    },
    []
  );

  const nextTurn = useCallback((): Scenario | null => {
    const scenarioForTurn = pickScenario(user.ageGroup);

    setUser((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1,
    }));

    setCurrentScenario(scenarioForTurn);
    setMarket((prevMarket) => applyScenarioToMarket(prevMarket, scenarioForTurn));

    return scenarioForTurn;
  }, [applyScenarioToMarket, pickScenario, user.ageGroup]);

  const endDayWithResult = useCallback((): DayResult | null => {
    const hotshotForDay = ensureHotshotForDay();
    const beforeMarket = market;
    const holdingsSnapshot = portfolio.holdings;

    const holdingsValueBefore = calculateHoldingsValueForMarket(beforeMarket, holdingsSnapshot);
    const netBefore = portfolio.cashBalance + holdingsValueBefore;

    const updatedMarket = applyHotshotToMarket(beforeMarket, hotshotForDay);
    const holdingsValueAfter = calculateHoldingsValueForMarket(updatedMarket, holdingsSnapshot);
    const netAfter = portfolio.cashBalance + holdingsValueAfter;

    const affectedHoldings = holdingsSnapshot.map((holding) => {
      const beforePrice =
        beforeMarket.find((inst) => inst.symbol === holding.symbol)?.currentPrice ?? holding.avgPrice;
      const afterPrice =
        updatedMarket.find((inst) => inst.symbol === holding.symbol)?.currentPrice ?? beforePrice;
      const changeAmount = (afterPrice - beforePrice) * holding.quantity;
      const changePercent = beforePrice === 0 ? 0 : ((afterPrice - beforePrice) / beforePrice) * 100;

      return {
        symbol: holding.symbol,
        name: holding.name,
        changePercent: parseFloat(changePercent.toFixed(2)),
        changeAmount: parseFloat(changeAmount.toFixed(2)),
      };
    });

    setUser((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1,
    }));
    setCurrentScenario({
      id: hotshotForDay.id,
      title: hotshotForDay.title,
      description: hotshotForDay.description,
      explanation: hotshotForDay.explanation,
      impact: hotshotForDay.impact,
    });
    setMarket(updatedMarket);

    updateProfile({
      cash: portfolio.cashBalance,
      invested: parseFloat(holdingsValueAfter.toFixed(2)),
    });

    return {
      date: new Date().toISOString(),
      scenarioId: hotshotForDay.id,
      scenarioTitle: hotshotForDay.title,
      scenarioDescription: hotshotForDay.description,
      scenarioExplanation: hotshotForDay.explanation,
      portfolioValueBefore: parseFloat(netBefore.toFixed(2)),
      portfolioValueAfter: parseFloat(netAfter.toFixed(2)),
      totalChange: parseFloat((netAfter - netBefore).toFixed(2)),
      affectedHoldings,
    };
  }, [
    applyHotshotToMarket,
    calculateHoldingsValueForMarket,
    ensureHotshotForDay,
    market,
    portfolio.cashBalance,
    portfolio.holdings,
  ]);

  const trade = useCallback(
    (symbol: string, quantity: number, type: TradeType): boolean => {
      if (quantity <= 0) return false;
      const instrument = market.find((item) => item.symbol === symbol);
      if (!instrument) return false;

      let didSucceed = false;

      setPortfolio((prev) => {
        const currentHolding = prev.holdings.find((h) => h.symbol === symbol);

        if (type === 'buy') {
          const cost = instrument.currentPrice * quantity;
          if (cost > prev.cashBalance) return prev;

          const updatedHoldings = currentHolding
            ? prev.holdings.map((h) => {
                if (h.symbol !== symbol) return h;
                const totalQuantity = h.quantity + quantity;
                const totalCost = h.avgPrice * h.quantity + cost;
                const newAvgPrice = totalCost / totalQuantity;
                return {
                  ...h,
                  quantity: totalQuantity,
                  avgPrice: parseFloat(newAvgPrice.toFixed(2)),
                };
              })
            : [
                ...prev.holdings,
                {
                  symbol,
                  name: instrument.name,
                  quantity,
                  avgPrice: instrument.currentPrice,
                },
              ];

          didSucceed = true;
          return {
            ...prev,
            cashBalance: parseFloat((prev.cashBalance - cost).toFixed(2)),
            holdings: updatedHoldings,
          };
        }

        // Sell
        if (!currentHolding || currentHolding.quantity < quantity) return prev;

        const proceeds = instrument.currentPrice * quantity;
        const remainingQty = currentHolding.quantity - quantity;

        const updatedHoldings =
          remainingQty === 0
            ? prev.holdings.filter((h) => h.symbol !== symbol)
            : prev.holdings.map((h) =>
                h.symbol === symbol ? { ...h, quantity: remainingQty } : h
              );

        didSucceed = true;
        return {
          ...prev,
          cashBalance: parseFloat((prev.cashBalance + proceeds).toFixed(2)),
          holdings: updatedHoldings,
        };
      });

      return didSucceed;
    },
    [market]
  );

  const getHoldingsValue = useCallback((): number => {
    return calculateHoldingsValueForMarket(market, portfolio.holdings);
  }, [calculateHoldingsValueForMarket, market, portfolio.holdings]);

  const getNetWorth = useCallback((): number => {
    return portfolio.cashBalance + calculateHoldingsValueForMarket(market, portfolio.holdings);
  }, [calculateHoldingsValueForMarket, market, portfolio.cashBalance, portfolio.holdings]);

  useEffect(() => {
    const invested = calculateHoldingsValueForMarket(market, portfolio.holdings);
    updateProfile({
      cash: portfolio.cashBalance,
      invested: parseFloat(invested.toFixed(2)),
    });
  }, [calculateHoldingsValueForMarket, market, portfolio.cashBalance, portfolio.holdings]);

  const value: GameContextValue = useMemo(
    () => ({
      user,
      market,
      currentScenario,
      todayHotshot,
      portfolio,
      nextTurn,
      endDayWithResult,
      trade,
      getHoldingsValue,
      getNetWorth,
    }),
    [
      user,
      market,
      currentScenario,
      todayHotshot,
      portfolio,
      nextTurn,
      endDayWithResult,
      trade,
      getHoldingsValue,
      getNetWorth,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
