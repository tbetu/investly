/**
 * Scenario detail screen with story and question
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { getScenarioById } from '../data';
import { Card, Button, Badge } from '../components';

type ScenarioDetailScreenProps = NativeStackScreenProps<any, 'ScenarioDetail'>;

export default function ScenarioDetailScreen({ navigation, route }: ScenarioDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { completeScenario, addXP } = useApp();
  const { scenarioId } = route.params as { scenarioId: number };
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = getScenarioById(scenarioId);

  if (!scenario) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Scenario not found</Text>
      </View>
    );
  }

  const isCorrect = selectedAnswer !== null && scenario.choices[selectedAnswer]?.correct;
  const selectedOption = selectedAnswer !== null ? scenario.choices[selectedAnswer] : null;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    completeScenario(scenarioId);
    addXP(5);
  };

  const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'trending-up': 'trending-up',
      'briefcase': 'briefcase',
      'globe': 'globe',
      'building': 'business',
    };
    return iconMap[iconName] || 'flag';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="rgba(255, 255, 255, 0.9)" />
          <Text style={styles.backText}>Back to Scenarios</Text>
        </Pressable>

        {/* Hero section */}
        <View style={styles.heroContent}>
          <View style={styles.heroIcon}>
            <Ionicons name={getIconName(scenario.iconName)} size={32} color="#ffffff" />
          </View>
          <Text style={styles.heroTitle}>{scenario.title}</Text>
        </View>

        <View style={styles.tagRow}>
          <Badge label="Scenario" style={styles.heroBadge} textStyle={styles.heroBadgeText} />
          <Badge label={scenario.category} style={styles.heroBadge} textStyle={styles.heroBadgeText} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Story */}
        <Card variant="elevated" style={styles.storyCard}>
          <Text style={styles.storyTitle}>What happened?</Text>
          <Text style={styles.storyText}>{scenario.story}</Text>
        </Card>

        {/* Question */}
        <Card variant="elevated" style={styles.questionCard}>
          <Text style={styles.questionTitle}>{scenario.questionText}</Text>

          <View style={styles.optionsContainer}>
            {scenario.choices.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.optionButton,
                  showFeedback && selectedAnswer === index && (
                    option.correct ? styles.optionCorrect : styles.optionIncorrect
                  ),
                  showFeedback && selectedAnswer !== index && styles.optionDisabled,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showFeedback}
              >
                <View style={[
                  styles.optionCircle,
                  showFeedback && selectedAnswer === index && (
                    option.correct ? styles.circleCorrect : styles.circleIncorrect
                  ),
                ]}>
                  {showFeedback && selectedAnswer === index && (
                    <Ionicons
                      name={option.correct ? 'checkmark' : 'close'}
                      size={16}
                      color="#ffffff"
                    />
                  )}
                </View>
                <Text style={styles.optionText}>{option.text}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Feedback */}
        {showFeedback && selectedOption && (
          <>
            <View style={[
              styles.feedbackBox,
              isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
            ]}>
              <View style={styles.feedbackHeader}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={isCorrect ? '#16a34a' : '#dc2626'}
                />
                <Text style={[
                  styles.feedbackTitle,
                  isCorrect ? styles.feedbackTitleCorrect : styles.feedbackTitleIncorrect,
                ]}>
                  {isCorrect ? 'You chose correctly!' : 'Not quite right.'}
                </Text>
              </View>
              <Text style={[
                styles.feedbackText,
                isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect,
              ]}>
                {selectedOption.explanation}
              </Text>
            </View>

            {/* Stock impact info */}
            <View style={styles.stockImpactBox}>
              <View style={styles.stockImpactIcon}>
                <Ionicons name="trending-down" size={16} color="#2563eb" />
              </View>
              <View style={styles.stockImpactContent}>
                <Text style={styles.stockImpactTitle}>How does this affect stocks?</Text>
                <Text style={styles.stockImpactText}>{scenario.stockImpact}</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actions}>
              <Button onPress={() => navigation.navigate('Home')} fullWidth size="lg">
                Return to Home
              </Button>
              <Button
                onPress={() => navigation.goBack()}
                variant="outline"
                fullWidth
                size="lg"
              >
                Try Another Scenario
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  heroIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 32,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroBadgeText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  storyCard: {
    padding: 20,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  storyText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  questionCard: {
    padding: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  optionCorrect: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  optionIncorrect: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  optionDisabled: {
    backgroundColor: '#f9fafb',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCorrect: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  circleIncorrect: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  feedbackBox: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  feedbackCorrect: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  feedbackIncorrect: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  feedbackTitleCorrect: {
    color: '#166534',
  },
  feedbackTitleIncorrect: {
    color: '#991b1b',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackTextCorrect: {
    color: '#15803d',
  },
  feedbackTextIncorrect: {
    color: '#b91c1c',
  },
  stockImpactBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  stockImpactIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockImpactContent: {
    flex: 1,
  },
  stockImpactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  stockImpactText: {
    fontSize: 14,
    color: '#1d4ed8',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    paddingBottom: 24,
  },
});
