/**
 * Splash screen shown on app launch
 * Displays app branding before navigation to onboarding
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const { state } = useApp();
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation for loading indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      if (state.hasCompletedOnboarding) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, state.hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      {/* Logo area */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <View style={styles.iconContainer}>
            <Ionicons name="trending-up" size={48} color="#2563eb" />
            <View style={styles.graduationIcon}>
              <Ionicons name="school" size={32} color="#22c55e" />
            </View>
          </View>
        </View>
        <View style={styles.sparkle}>
          <Ionicons name="sparkles" size={24} color="#fde047" />
        </View>
      </View>

      {/* Brand name */}
      <View style={styles.textContainer}>
        <Text style={styles.title}> Investly </Text>
        <Text style={styles.subtitle}>Learn investing, one quiz at a time.</Text>
      </View>

      {/* Illustration emojis */}
      <View style={styles.illustrationContainer}>
        <View style={[styles.emojiCircle, styles.moneyCircle]}>
          <Text style={styles.emoji}>💰</Text>
        </View>
        <View style={[styles.emojiCircle, styles.chartCircle]}>
          <Text style={styles.emoji}>📈</Text>
        </View>
        <View style={[styles.emojiCircle, styles.graduationCircle]}>
          <Text style={styles.emoji}>🎓</Text>
        </View>
      </View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingFill,
              { opacity: pulseAnim },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logoContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  logoBackground: {
    width: 96,
    height: 96,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    position: 'relative',
  },
  graduationIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  illustrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 48,
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moneyCircle: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  chartCircle: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  graduationCircle: {
    backgroundColor: 'rgba(250, 204, 21, 0.3)',
  },
  emoji: {
    fontSize: 28,
  },
  loadingContainer: {
    marginTop: 64,
  },
  loadingTrack: {
    width: 128,
    height: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  loadingFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
});
