/**
 * Onboarding carousel explaining app features
 * Shows 3 slides before directing user to age selection
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    emoji: '📚',
    title: 'Learn money the fun way',
    subtitle: 'Short lessons and quizzes help you understand how the economy works.',
    bgColorFrom: '#eff6ff',
    bgColorTo: '#dbeafe',
    accentColor: '#2563eb',
  },
  {
    id: 2,
    emoji: '📱',
    title: 'Invest with virtual money',
    subtitle: 'Use your virtual balance to practice investing in BIST, NYSE and NASDAQ.',
    bgColorFrom: '#f0fdf4',
    bgColorTo: '#dcfce7',
    accentColor: '#16a34a',
  },
  {
    id: 3,
    emoji: '🎯',
    title: 'Age-friendly learning',
    subtitle: 'Content adapts to elementary, middle, high school and university levels.',
    bgColorFrom: '#faf5ff',
    bgColorTo: '#f3e8ff',
    accentColor: '#9333ea',
  },
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace('AgeSelection');
    }
  };

  const handleSkip = () => {
    navigation.replace('AgeSelection');
  };

  return (
    <View style={[styles.container, { backgroundColor: slide.bgColorFrom }]}>
      {/* Skip button */}
      <View style={styles.header}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
          </View>
        </View>

        {/* Text content */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide
                  ? [styles.dotActive, { backgroundColor: slide.accentColor, width: 32 }]
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: slide.accentColor },
            pressed && styles.buttonPressed,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 24,
    paddingTop: 60,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    marginBottom: 32,
  },
  emojiCircle: {
    width: 192,
    height: 192,
    backgroundColor: '#ffffff',
    borderRadius: 96,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  emoji: {
    fontSize: 96,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  bottomSection: {
    padding: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 32,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#d1d5db',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});
