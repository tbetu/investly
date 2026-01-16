/**
 * Lesson detail screen with content and quiz
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { getLessonById, getQuestionsByLessonId } from '../data';
import { Card, Button } from '../components';

const ageLevelLabels = {
  elementary: 'Elementary School',
  middle: 'Middle School',
  high: 'High School',
  university: 'University',
};

type LessonDetailScreenProps = NativeStackScreenProps<any, 'LessonDetail'>;

export default function LessonDetailScreen({ navigation, route }: LessonDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { state, completeLesson, recordQuizResult, addXP } = useApp();
  const { lessonId } = route.params as { lessonId: number };
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lesson = getLessonById(lessonId);
  const questions = getQuestionsByLessonId(lessonId);

  if (!lesson) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer !== null && currentQuestion?.choices[selectedAnswer]?.correct;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    if (currentQuestion?.choices[index]?.correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      const score = Math.round(((correctAnswers + (isCorrect ? 1 : 0)) / questions.length) * 100);
      recordQuizResult(lessonId, score);
      completeLesson(lessonId);
      addXP(10);
    }
  };

  const handleBackToLearn = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{lesson.title}</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showQuiz && !quizCompleted ? (
          // Lesson content
          <>
            <Card variant="elevated" style={styles.contentCard}>
              {lesson.content.map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </Card>

            {/* Level-specific info box */}
            <View style={styles.infoBox}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="bulb" size={16} color="#2563eb" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  For your level ({ageLevelLabels[state.ageGroup]})
                </Text>
                <Text style={styles.infoText}>{lesson.levelNote}</Text>
              </View>
            </View>

            {questions.length > 0 && (
              <Button onPress={() => setShowQuiz(true)} fullWidth size="lg">
                Take Quiz
              </Button>
            )}
          </>
        ) : quizCompleted ? (
          // Quiz results
          <View style={styles.resultsContainer}>
            <View style={styles.resultsIcon}>
              <Ionicons
                name={correctAnswers >= questions.length / 2 ? 'trophy' : 'refresh'}
                size={48}
                color={correctAnswers >= questions.length / 2 ? '#ca8a04' : '#2563eb'}
              />
            </View>
            <Text style={styles.resultsTitle}>Quiz Complete!</Text>
            <Text style={styles.resultsScore}>
              You answered {correctAnswers + (isCorrect ? 1 : 0)}/{questions.length} correctly
            </Text>
            <Text style={styles.xpGained}>+10 XP earned!</Text>
            
            <View style={styles.resultsActions}>
              <Button onPress={handleBackToLearn} fullWidth size="lg">
                Return to Learn
              </Button>
              <Button
                onPress={() => navigation.navigate('Home')}
                variant="outline"
                fullWidth
                size="lg"
              >
                Back to Home
              </Button>
            </View>
          </View>
        ) : currentQuestion ? (
          // Quiz question
          <>
            <Card variant="elevated" style={styles.questionCard}>
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Text>
              </View>
              
              <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

              <View style={styles.optionsContainer}>
                {currentQuestion.choices.map((option, index) => (
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
            {showFeedback && (
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
                    {isCorrect ? 'Correct!' : 'Not quite.'}
                  </Text>
                </View>
                <Text style={[
                  styles.feedbackText,
                  isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect,
                ]}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}

            {showFeedback && (
              <Button onPress={handleNextQuestion} fullWidth size="lg">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </>
        ) : null}
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#374151',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  contentCard: {
    padding: 20,
    gap: 16,
  },
  paragraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1d4ed8',
    lineHeight: 20,
  },
  questionCard: {
    padding: 20,
  },
  questionBadge: {
    backgroundColor: '#f3e8ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 16,
  },
  questionBadgeText: {
    fontSize: 12,
    color: '#9333ea',
    fontWeight: '500',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
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
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  resultsIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#fef9c3',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  xpGained: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 32,
  },
  resultsActions: {
    width: '100%',
    gap: 12,
  },
});
