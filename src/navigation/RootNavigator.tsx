/**
 * Root navigator combining onboarding flow and main app
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import {
  SplashScreen,
  OnboardingScreen,
  AgeSelectionScreen,
  LessonDetailScreen,
  ScenarioDetailScreen,
  ProfileScreen,
  EndOfDaySummaryScreen,
  NewDayNewsIntroScreen,
} from '../screens';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Onboarding flow */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AgeSelection" component={AgeSelectionScreen} />

      {/* Main app with bottom tabs */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Detail screens accessible from tabs */}
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="ScenarioDetail"
        component={ScenarioDetailScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="EndOfDaySummary"
        component={EndOfDaySummaryScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="NewDayNewsIntro"
        component={NewDayNewsIntroScreen}
        options={{
          animation: 'fade_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
