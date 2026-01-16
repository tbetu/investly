/**
 * Profile/Progress screen
 * Shows user info, progress stats, badges, and settings
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Card, ProgressBar } from '../components';
import { useGameContext } from '../context/GameContext';

const ageLevelLabels = {
  elementary: 'Elementary School',
  middle: 'Middle School',
  high: 'High School',
  university: 'University',
};

const currency = (value: number) =>
  `₺${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

type ProfileScreenProps = {
  navigation: any;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const { portfolio, getHoldingsValue, getNetWorth } = useGameContext();

  const xpProgress = ((state.progress.xp % 200) / 200) * 100;
  const xpForNextLevel = 200 - (state.progress.xp % 200);

  const lessonsCompleted = state.progress.lessonsCompleted.length;
  const scenariosCompleted = state.progress.scenariosCompleted.length;
  const quizScores = Object.values(state.progress.quizResults);
  const quizAccuracy =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0;
  const badgesUnlocked = state.badges.filter((b) => b.unlocked).length;

  const cashBalance = portfolio.cashBalance;
  const holdingsValue = useMemo(() => getHoldingsValue(), [getHoldingsValue]);
  const totalValue = useMemo(() => getNetWorth(), [getNetWorth]);
  const avatarInitial = state.userName ? state.userName.charAt(0).toUpperCase() : '?';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitial}</Text>
            </View>
            <View style={styles.heroTextBlock}>
              <Text style={styles.userName}>{state.userName}</Text>
              <Text style={styles.userLevel}>{ageLevelLabels[state.ageGroup]}</Text>
              <View style={styles.levelPill}>
                <Ionicons name="flame" size={14} color="#0f172a" />
                <Text style={styles.levelPillText}>Level {state.progress.level}</Text>
                <Text style={styles.levelPillSub}>{xpForNextLevel} XP to next</Text>
              </View>
            </View>
            <View style={styles.xpBubble}>
              <Text style={styles.xpLabel}>XP</Text>
              <Text style={styles.xpValue}>{state.progress.xp}</Text>
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Learning progress</Text>
              <Text style={styles.progressMeta}>{Math.round(xpProgress)}% to next level</Text>
            </View>
            <ProgressBar
              progress={xpProgress}
              backgroundColor="rgba(255,255,255,0.2)"
              fillColor="#ffffff"
            />
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Ionicons name="flag" size={18} color="#0ea5e9" />
              <Text style={styles.heroStatValue}>{scenariosCompleted}</Text>
              <Text style={styles.heroStatLabel}>Scenarios done</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Ionicons name="checkbox" size={18} color="#22c55e" />
              <Text style={styles.heroStatValue}>{quizAccuracy}%</Text>
              <Text style={styles.heroStatLabel}>Quiz accuracy</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Ionicons name="book" size={18} color="#fde047" />
              <Text style={styles.heroStatValue}>{lessonsCompleted}</Text>
              <Text style={styles.heroStatLabel}>Lessons</Text>
            </View>
          </View>
        </View>

        <Card variant="elevated" style={styles.balanceCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Virtual balance</Text>
            <View style={styles.balanceBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#2563eb" />
              <Text style={styles.balanceBadgeText}>Simulation</Text>
            </View>
          </View>
          <Text style={styles.totalValue}>{currency(totalValue)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Cash</Text>
              <Text style={styles.balanceValue}>{currency(cashBalance)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Invested</Text>
              <Text style={styles.balanceValue}>{currency(holdingsValue)}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Learning stats</Text>
            <Text style={styles.sectionCaption}>Keep growing your streak</Text>
          </View>
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statCard}>
              <View style={[styles.statIcon, styles.blueIcon]}>
                <Ionicons name="book" size={20} color="#1d4ed8" />
              </View>
              <Text style={styles.statValue}>{lessonsCompleted}</Text>
              <Text style={styles.statLabel}>Lessons completed</Text>
            </Card>

            <Card variant="elevated" style={styles.statCard}>
              <View style={[styles.statIcon, styles.purpleIcon]}>
                <Ionicons name="flag" size={20} color="#7c3aed" />
              </View>
              <Text style={styles.statValue}>{scenariosCompleted}</Text>
              <Text style={styles.statLabel}>Scenarios finished</Text>
            </Card>

            <Card variant="elevated" style={styles.statCard}>
              <View style={[styles.statIcon, styles.greenIcon]}>
                <Ionicons name="checkmark-done" size={20} color="#16a34a" />
              </View>
              <Text style={styles.statValue}>{quizAccuracy}%</Text>
              <Text style={styles.statLabel}>Correct answers</Text>
            </Card>

            <Card variant="elevated" style={styles.statCard}>
              <View style={[styles.statIcon, styles.yellowIcon]}>
                <Ionicons name="ribbon" size={20} color="#ca8a04" />
              </View>
              <Text style={styles.statValue}>{badgesUnlocked}</Text>
              <Text style={styles.statLabel}>Badges unlocked</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesGrid}>
            {state.badges.map((badge) => (
              <View
                key={badge.id}
                style={[styles.badgeCard, !badge.unlocked && styles.badgeLocked]}
              >
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName} numberOfLines={2}>
                  {badge.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick settings</Text>
            <Text style={styles.sectionCaption}>Adjust your experience</Text>
          </View>
          <Card variant="elevated" style={styles.settingsCard}>
            <Pressable
              style={styles.settingsItem}
              onPress={() => navigation.navigate('AgeSelection')}
            >
              <View style={styles.settingsRow}>
                <Ionicons name="person-outline" size={20} color="#4b5563" />
                <Text style={styles.settingsText}>Change age level</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable style={styles.settingsItem}>
              <View style={styles.settingsRow}>
                <Ionicons name="globe-outline" size={20} color="#4b5563" />
                <Text style={styles.settingsText}>Language</Text>
              </View>
              <View style={styles.settingsValue}>
                <Text style={styles.settingsValueText}>English</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </Pressable>

            <Pressable style={[styles.settingsItem, styles.settingsItemLast]}>
              <View style={styles.settingsRow}>
                <Ionicons name="notifications-outline" size={20} color="#4b5563" />
                <Text style={styles.settingsText}>Notification preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 16,
  },
  hero: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  heroTextBlock: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  userLevel: {
    fontSize: 14,
    color: '#dbeafe',
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelPillText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  levelPillSub: {
    color: '#1e3a8a',
    fontSize: 12,
  },
  xpBubble: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
    minWidth: 90,
  },
  xpLabel: {
    color: '#e0f2fe',
    fontSize: 12,
  },
  xpValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  progressBlock: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressMeta: {
    color: '#dbeafe',
    fontSize: 12,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  heroStatValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: '#e0f2fe',
    fontSize: 12,
  },
  balanceCard: {
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCaption: {
    color: '#6b7280',
    fontSize: 12,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  balanceBadgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 12,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceItem: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
  },
  balanceLabel: {
    color: '#6b7280',
    fontSize: 13,
  },
  balanceValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    alignItems: 'flex-start',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  blueIcon: {
    backgroundColor: '#dbeafe',
  },
  purpleIcon: {
    backgroundColor: '#f3e8ff',
  },
  greenIcon: {
    backgroundColor: '#dcfce7',
  },
  yellowIcon: {
    backgroundColor: '#fef9c3',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 6,
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsText: {
    fontSize: 16,
    color: '#111827',
  },
  settingsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsValueText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
