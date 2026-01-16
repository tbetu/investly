/**
 * Navigation type definitions
 */
import { DayResult } from '../types';

export type ScenarioCategoryId = 'daily-hotshots' | 'all' | 'economy' | 'company' | 'global';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AgeSelection: undefined;
  MainTabs:
    | undefined
    | {
        screen?: keyof BottomTabParamList;
        params?: BottomTabParamList[keyof BottomTabParamList];
      };
  LessonDetail: { lessonId: number };
  ScenarioDetail: { scenarioId: number };
  Profile: undefined;
  EndOfDaySummary: { dayResult: DayResult };
  NewDayNewsIntro: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Learn: undefined;
  Portfolio: undefined;
  Scenarios: { initialCategory?: ScenarioCategoryId } | undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
