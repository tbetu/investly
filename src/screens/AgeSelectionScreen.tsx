/**
 * Age/Level selection screen
 * User chooses their education level for personalized content
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { AgeLevel } from '../types';
import { Button } from '../components';

type AgeSelectionScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface LevelOption {
  id: AgeLevel;
  emoji: string;
  title: string;
  age: string;
  description: string;
  colors: {
    from: string;
    to: string;
    border: string;
  };
}

const levels: LevelOption[] = [
  {
    id: 'elementary',
    emoji: '🎈',
    title: 'Elementary School',
    age: '8–11',
    description: 'Simple stories and basic money concepts',
    colors: {
      from: '#fef9c3',
      to: '#fef08a',
      border: '#fde047',
    },
  },
  {
    id: 'middle',
    emoji: '🎮',
    title: 'Middle School',
    age: '12–14',
    description: 'Real-world examples and fun challenges',
    colors: {
      from: '#dbeafe',
      to: '#bfdbfe',
      border: '#93c5fd',
    },
  },
  {
    id: 'high',
    emoji: '🚀',
    title: 'High School',
    age: '15–18',
    description: 'Advanced concepts and market insights',
    colors: {
      from: '#f3e8ff',
      to: '#e9d5ff',
      border: '#d8b4fe',
    },
  },
  {
    id: 'university',
    emoji: '🎓',
    title: 'University',
    age: '18–22',
    description: 'Deep dives into economics and investing',
    colors: {
      from: '#dcfce7',
      to: '#bbf7d0',
      border: '#86efac',
    },
  },
];

export default function AgeSelectionScreen({ navigation }: AgeSelectionScreenProps) {
  const { setAgeGroup, completeOnboarding } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<AgeLevel | null>(null);

  const handleContinue = () => {
    if (selectedLevel) {
      setAgeGroup(selectedLevel);
      completeOnboarding();
      navigation.replace('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose your level</Text>
        <Text style={styles.subtitle}>
          We'll personalize lessons and questions for you.
        </Text>
      </View>

      {/* Level cards */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {levels.map((level) => {
          const isSelected = selectedLevel === level.id;
          
          return (
            <Pressable
              key={level.id}
              style={({ pressed }) => [
                styles.levelCard,
                {
                  backgroundColor: level.colors.from,
                  borderColor: level.colors.border,
                },
                isSelected && styles.levelCardSelected,
                pressed && styles.levelCardPressed,
              ]}
              onPress={() => setSelectedLevel(level.id)}
            >
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                </View>
              )}
              
              <View style={styles.cardContent}>
                <Text style={styles.emoji}>{level.emoji}</Text>
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.levelTitle}>{level.title}</Text>
                    <Text style={styles.ageText}>({level.age})</Text>
                  </View>
                  <Text style={styles.description}>{level.description}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <Button
          onPress={handleContinue}
          disabled={!selectedLevel}
          fullWidth
          size="lg"
        >
          Continue
        </Button>
        <Text style={styles.hint}>You can change this later in Settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  levelCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    position: 'relative',
  },
  levelCardSelected: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  levelCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  emoji: {
    fontSize: 40,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  ageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bottomSection: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  hint: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
  },
});
