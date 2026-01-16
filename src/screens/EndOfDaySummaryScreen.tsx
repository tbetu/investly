/**
 * End-of-day summary screen shown after the Sleep / End Day action.
 * Displays scenario details and the impact on the user's holdings.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components';
import { RootStackParamList } from '../navigation/types';
import { AffectedHolding } from '../types';

type SummaryRoute = RouteProp<RootStackParamList, 'EndOfDaySummary'>;

type Props = {
  route: SummaryRoute;
};

const currency = (value: number) =>
  `₺${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function EndOfDaySummaryScreen({ route }: Props) {
  const { dayResult } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isGain = dayResult.totalChange >= 0;

  const renderHolding = (holding: AffectedHolding) => {
    const isUp = holding.changeAmount >= 0;
    return (
      <View key={holding.symbol} style={styles.holdingRow}>
        <View>
          <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
          <Text style={styles.holdingName}>{holding.name}</Text>
        </View>
        <View style={styles.holdingValues}>
          <Text style={[styles.holdingChange, isUp ? styles.positive : styles.negative]}>
            {isUp ? '+' : ''}
            {holding.changePercent.toFixed(2)}%
          </Text>
          <Text style={styles.holdingAmount}>{currency(holding.changeAmount)}</Text>
        </View>
      </View>
    );
  };

  const handleContinue = () => {
    navigation.navigate('NewDayNewsIntro');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>End of Day Review</Text>
          <Text style={styles.subtitle}>Scenario outcome and portfolio changes</Text>
        </View>

        <Card variant="elevated" style={styles.card}>
          <Text style={styles.sectionLabel}>Scenario</Text>
          <Text style={styles.scenarioTitle}>{dayResult.scenarioTitle}</Text>
          <Text style={styles.scenarioDescription}>{dayResult.scenarioDescription}</Text>
          <Text style={styles.scenarioExplanation}>{dayResult.scenarioExplanation}</Text>
        </Card>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Portfolio before</Text>
            <Text style={styles.metricValue}>{currency(dayResult.portfolioValueBefore)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Portfolio after</Text>
            <Text style={styles.metricValue}>{currency(dayResult.portfolioValueAfter)}</Text>
          </View>
          <View
            style={[
              styles.changePill,
              isGain ? styles.positivePill : styles.negativePill,
            ]}
          >
            <Ionicons
              name={isGain ? 'trending-up' : 'trending-down'}
              size={16}
              color={isGain ? '#166534' : '#991b1b'}
            />
            <Text style={[styles.changeText, isGain ? styles.positive : styles.negative]}>
              {isGain ? '+' : ''}
              {currency(dayResult.totalChange)}
            </Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.card}>
          <Text style={styles.sectionLabel}>Holdings impact</Text>
          {dayResult.affectedHoldings.length === 0 ? (
            <Text style={styles.emptyText}>No holdings were affected today.</Text>
          ) : (
            dayResult.affectedHoldings.map(renderHolding)
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 12,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    color: '#475569',
    fontSize: 14,
  },
  card: {
    padding: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#6b7280',
    fontWeight: '700',
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  scenarioDescription: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  scenarioExplanation: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    color: '#6b7280',
    fontSize: 13,
  },
  metricValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  positivePill: {
    backgroundColor: '#dcfce7',
  },
  negativePill: {
    backgroundColor: '#fee2e2',
  },
  positive: {
    color: '#166534',
  },
  negative: {
    color: '#b91c1c',
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  holdingSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  holdingName: {
    fontSize: 12,
    color: '#6b7280',
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingChange: {
    fontSize: 13,
    fontWeight: '700',
  },
  holdingAmount: {
    fontSize: 13,
    color: '#0f172a',
    marginTop: 2,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
});
