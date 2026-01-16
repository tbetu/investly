/**
 * Investly - Main Entry Point
 * 
 * A stock market simulator and financial education app for students.
 * This is a React Native + Expo app that works with Expo Go.
 * 
 * All market data is STATIC (no API calls, no real-time data).
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { GameProvider } from './src/context/GameContext';
import RootNavigator from './src/navigation/RootNavigator';


export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <GameProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </GameProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
