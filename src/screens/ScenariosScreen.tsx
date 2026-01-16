/**
 * Scenarios screen - Browse and practice with scenario cards
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useGameContext } from '../context/GameContext';
import { getScenariosByAgeGroup } from '../data';
import { Card, Badge } from '../components';
import { DailyHotshotEvent } from '../data/dailyHotshots';
import { BottomTabParamList, ScenarioCategoryId } from '../navigation/types';

const categories: { id: ScenarioCategoryId; label: string }[] = [
  { id: 'daily-hotshots', label: 'Daily Hotshots' },
  { id: 'all', label: 'All' },
  { id: 'economy', label: 'Economy' },
  { id: 'company', label: 'Company News' },
  { id: 'global', label: 'Global Events' },
];

type ScenariosScreenProps = {
  navigation: any;
};

export default function ScenariosScreen({ navigation }: ScenariosScreenProps) {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const { todayHotshot } = useGameContext();
  const route = useRoute<RouteProp<BottomTabParamList, 'Scenarios'>>();

  const initialCategory: ScenarioCategoryId = route.params?.initialCategory ?? 'daily-hotshots';
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategoryId>(initialCategory);

  useEffect(() => {
    if (route.params?.initialCategory) {
      setSelectedCategory(route.params.initialCategory);
    }
  }, [route.params?.initialCategory]);

  const scenarios = useMemo(() => getScenariosByAgeGroup(state.ageGroup), [state.ageGroup]);
  const isHotshotsSelected = selectedCategory === 'daily-hotshots';

  const filteredScenarios = useMemo(() => {
    if (isHotshotsSelected) return [];
    if (selectedCategory === 'all') return scenarios;
    return scenarios.filter((s) =>
      s.category.toLowerCase().includes(selectedCategory) ||
      (selectedCategory === 'company' && s.category === 'Company News')
    );
  }, [isHotshotsSelected, scenarios, selectedCategory]);

  const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'trending-up': 'trending-up',
      'briefcase': 'briefcase',
      'globe': 'globe',
    };
    return iconMap[iconName] || 'flag';
  };

  const renderHotshotCard = (hotshot: DailyHotshotEvent) => {
    const topTwo = Object.entries(hotshot.impact)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 2);

    return (
      <Card variant="elevated" style={styles.hotshotCard}>
        <View style={styles.hotshotHeader}>
          <View style={styles.hotshotBadge}>
            <Ionicons name="flame" size={16} color="#fff" />
            <Text style={styles.hotshotBadgeText}>Today’s Hotshot</Text>
          </View>
          <Text style={styles.hotshotDifficulty}>{hotshot.difficulty.toUpperCase()}</Text>
        </View>

        <Text style={styles.hotshotTitle}>{hotshot.title}</Text>
        <Text style={styles.hotshotDescription}>{hotshot.description}</Text>
        <Text style={styles.hotshotExplanation}>{hotshot.explanation}</Text>

        {topTwo.length > 0 && (
          <View style={styles.topImpactsContainer}>
            <Text style={styles.impactLabel}>Top impacted assets</Text>
            {topTwo.map(([symbol]) => (
              <View key={symbol} style={styles.topImpactRow}>
                <Text style={styles.assetSymbol}>{symbol}</Text>
                <Text style={styles.assetImpactPlaceholder}>?</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Scenarios</Text>
        <Text style={styles.subtitle}>
          Practice reacting to real-world news and events
        </Text>

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Scenarios list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isHotshotsSelected ? (
          todayHotshot ? (
            renderHotshotCard(todayHotshot)
          ) : (
            <Card variant="elevated" style={styles.hotshotCard}>
              <Text style={styles.hotshotTitle}>Daily Hotshot</Text>
              <Text style={styles.hotshotDescription}>
                Your hotshot event will appear here once the day begins.
              </Text>
            </Card>
          )
        ) : (
          filteredScenarios.map((scenario) => {
            const isCompleted = state.progress.scenariosCompleted.includes(scenario.id);
            
            return (
              <Card
                key={scenario.id}
                variant="elevated"
                style={styles.scenarioCard}
                onPress={() => navigation.navigate('ScenarioDetail', { scenarioId: scenario.id })}
              >
                <View style={styles.scenarioContent}>
                  <View style={[styles.scenarioIcon, { backgroundColor: scenario.bgColor }]}>
                    <Ionicons
                      name={getIconName(scenario.iconName)}
                      size={24}
                      color={scenario.iconColor}
                    />
                  </View>
                  
                  <View style={styles.scenarioDetails}>
                    <View style={styles.scenarioHeader}>
                      <Text style={styles.scenarioTitle} numberOfLines={2}>
                        {scenario.title}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </View>
                    
                    <View style={styles.tagsRow}>
                      <Badge label={scenario.category} variant="info" size="sm" />
                      <Text style={styles.tagText}>{scenario.tag}</Text>
                      {isCompleted && (
                        <View style={styles.completedBadge}>
                          <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
                        </View>
                      )}
                    </View>

                    <Text style={styles.teaserText} numberOfLines={2}>
                      {scenario.teaser}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Scenario</Text>
                    <Ionicons name="chevron-forward" size={16} color="#2563eb" />
                  </View>
                </View>
              </Card>
            );
          })
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
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
  scenarioCard: {
    padding: 16,
  },
  hotshotCard: {
    padding: 16,
    gap: 8,
  },
  hotshotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotshotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fb7185',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hotshotBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  hotshotDifficulty: {
    color: '#fb7185',
    fontWeight: '700',
    fontSize: 12,
  },
  hotshotTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  hotshotDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  hotshotExplanation: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  impactLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#6b7280',
    fontWeight: '700',
  },
  topImpactsContainer: {
    marginTop: 8,
    padding: 12,
    gap: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topImpactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  assetSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  assetImpactPlaceholder: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  scenarioContent: {
    flexDirection: 'row',
    gap: 16,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioDetails: {
    flex: 1,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scenarioTitle: {
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
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
  },
  completedBadge: {
    marginLeft: 'auto',
  },
  teaserText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  startButtonText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
});
