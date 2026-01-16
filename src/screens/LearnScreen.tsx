/**
 * Learn screen - Browse lessons filtered by age group
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { getLessonsByAgeGroup } from '../data';
import { Card, ProgressBar, Badge } from '../components';

const ageLevelLabels = {
  elementary: 'Elementary',
  middle: 'Middle School',
  high: 'High School',
  university: 'University',
};

const categories = ['All', 'Basics', 'Saving', 'Inflation', 'Investing'];

type LearnScreenProps = {
  navigation: any;
};

export default function LearnScreen({ navigation }: LearnScreenProps) {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const lessons = getLessonsByAgeGroup(state.ageGroup);
  const filteredLessons = selectedCategory === 'All'
    ? lessons
    : lessons.filter((lesson) => lesson.category === selectedCategory);

  // Calculate progress for each lesson (demo data)
  const getProgress = (lessonId: number) => {
    if (state.progress.lessonsCompleted.includes(lessonId)) return 100;
    if (state.progress.quizResults[lessonId]) return state.progress.quizResults[lessonId];
    // Demo: some lessons have partial progress
    const demoProgress: { [key: number]: number } = { 1: 75, 2: 40, 3: 100, 5: 60, 6: 100 };
    return demoProgress[lessonId] || 0;
  };

  const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'piggy-bank': 'wallet',
      'trending-up': 'trending-up',
      'lightbulb': 'bulb',
    };
    return iconMap[iconName] || 'book';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Learn</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{ageLevelLabels[state.ageGroup]} Level</Text>
            <Ionicons name="chevron-down" size={16} color="#2563eb" />
          </View>
        </View>

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lesson list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredLessons.map((lesson) => {
          const progress = getProgress(lesson.id);
          
          return (
            <Card
              key={lesson.id}
              variant="elevated"
              style={styles.lessonCard}
              onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
            >
              <View style={styles.lessonContent}>
                <View style={[styles.lessonIcon, { backgroundColor: lesson.bgColor }]}>
                  <Ionicons
                    name={getIconName(lesson.iconName)}
                    size={24}
                    color={lesson.iconColor}
                  />
                </View>
                
                <View style={styles.lessonDetails}>
                  <View style={styles.lessonHeader}>
                    <Text style={styles.lessonTitle} numberOfLines={2}>
                      {lesson.title}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </View>
                  
                  <View style={styles.tagsRow}>
                    <Badge label={lesson.difficulty} size="sm" />
                    <Text style={styles.categoryLabel}>{lesson.category}</Text>
                  </View>

                  <View style={styles.progressRow}>
                    <ProgressBar progress={progress} style={styles.progressBar} />
                    <Text style={styles.progressText}>{progress}% done</Text>
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  levelText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#f3f4f6',
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 12,
    paddingBottom: 100,
  },
  lessonCard: {
    padding: 16,
  },
  lessonContent: {
    flexDirection: 'row',
    gap: 16,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonDetails: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    paddingRight: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    minWidth: 60,
    textAlign: 'right',
  },
});
