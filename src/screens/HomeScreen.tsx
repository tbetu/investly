/**
 * Home/Dashboard screen
 * Shows greeting, portfolio overview, highlights, and market snapshot
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { MARKET_INDICES } from '../data';
import { Card } from '../components';

const ageLevelLabels = {
  elementary: 'Elementary School',
  middle: 'Middle School',
  high: 'High School',
  university: 'University',
};

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { state, getPortfolioValue } = useApp();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const portfolioValue = getPortfolioValue();
  const totalChange = ((portfolioValue - state.balance) / state.balance) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {state.userName} 👋
            </Text>
            <Text style={styles.levelText}>
              Level: {ageLevelLabels[state.ageGroup]} · XP: {state.progress.xp}
            </Text>
          </View>
          <Pressable
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={20} color="#ffffff" />
          </Pressable>
        </View>

        {/* Virtual wallet card */}
        <Card variant="elevated" style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Virtual Balance</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            ₺{state.balance.toLocaleString()}
          </Text>
          <View style={styles.portfolioRow}>
            <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
            <View style={styles.portfolioValue}>
              <Text style={styles.portfolioAmount}>
                ₺{portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
              <Text style={[
                styles.changeText,
                totalChange >= 0 ? styles.positive : styles.negative
              ]}>
                ({totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}%)
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Main content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Highlights</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsContainer}
          >
            {/* Today's Scenario */}
            <Pressable
              style={({ pressed }) => [
                styles.highlightCard,
                pressed && styles.highlightCardPressed,
              ]}
              onPress={() => navigation.navigate('ScenarioDetail', { scenarioId: 1 })}
            >
              <View style={styles.highlightHeader}>
                <View style={[styles.highlightIcon, styles.purpleIcon]}>
                  <Ionicons name="flag" size={20} color="#9333ea" />
                </View>
                <Text style={styles.highlightType}>Today's Scenario</Text>
              </View>
              <Text style={styles.highlightText}>
                Central bank raises interest rates
              </Text>
            </Pressable>

            {/* New Quiz */}
            <Pressable
              style={({ pressed }) => [
                styles.highlightCard,
                pressed && styles.highlightCardPressed,
              ]}
              onPress={() => navigation.navigate('LessonDetail', { lessonId: 2 })}
            >
              <View style={styles.highlightHeader}>
                <View style={[styles.highlightIcon, styles.yellowIcon]}>
                  <Ionicons name="school" size={20} color="#ca8a04" />
                </View>
                <Text style={[styles.highlightType, { color: '#ca8a04' }]}>New Quiz</Text>
              </View>
              <Text style={styles.highlightText}>
                3 questions about interest rates
              </Text>
            </Pressable>

            {/* Continue Lesson */}
            <Pressable
              style={({ pressed }) => [
                styles.highlightCard,
                pressed && styles.highlightCardPressed,
              ]}
              onPress={() => navigation.navigate('LessonDetail', { lessonId: 1 })}
            >
              <View style={styles.highlightHeader}>
                <View style={[styles.highlightIcon, styles.blueIcon]}>
                  <Ionicons name="book" size={20} color="#2563eb" />
                </View>
                <Text style={[styles.highlightType, { color: '#2563eb' }]}>Continue Lesson</Text>
              </View>
              <Text style={styles.highlightText}>
                Money and Inflation · Lesson 2
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Market Snapshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Snapshot (demo data)</Text>
          
          <View style={styles.marketList}>
            {MARKET_INDICES.map((index) => (
              <Card key={index.id} variant="elevated" style={styles.marketCard}>
                <View style={styles.marketRow}>
                  <View>
                    <Text style={styles.marketName}>{index.name}</Text>
                    <Text style={styles.marketFullName}>{index.fullName}</Text>
                  </View>
                  <View style={styles.marketValues}>
                    <Text style={styles.marketValue}>
                      {index.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                    <View style={[
                      styles.changeRow,
                      index.change >= 0 ? styles.positiveRow : styles.negativeRow,
                    ]}>
                      <Ionicons
                        name={index.change >= 0 ? 'trending-up' : 'trending-down'}
                        size={12}
                        color={index.change >= 0 ? '#16a34a' : '#dc2626'}
                      />
                      <Text style={[
                        styles.marketChange,
                        index.change >= 0 ? styles.positive : styles.negative,
                      ]}>
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 14,
    color: '#bfdbfe',
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletCard: {
    padding: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  activeBadgeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  portfolioValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  portfolioAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  positive: {
    color: '#16a34a',
  },
  negative: {
    color: '#dc2626',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  highlightsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  highlightCard: {
    width: 256,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purpleIcon: {
    backgroundColor: '#f3e8ff',
  },
  yellowIcon: {
    backgroundColor: '#fef9c3',
  },
  blueIcon: {
    backgroundColor: '#dbeafe',
  },
  highlightType: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 14,
    color: '#111827',
  },
  marketList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  marketCard: {
    padding: 16,
  },
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  marketFullName: {
    fontSize: 12,
    color: '#6b7280',
  },
  marketValues: {
    alignItems: 'flex-end',
  },
  marketValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  positiveRow: {},
  negativeRow: {},
  marketChange: {
    fontSize: 12,
    fontWeight: '500',
  },
});
