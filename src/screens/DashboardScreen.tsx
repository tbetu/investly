import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Button, Badge } from '../components';
import { useGameContext } from '../context/GameContext';
import { AgeGroupKey, Instrument } from '../data/gameData';
import { BottomTabParamList, RootStackParamList } from '../navigation/types';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const ageGroupLabels: Record<AgeGroupKey, string> = {
  LOW: 'Foundations',
  MID: 'Intermediate',
  HIGH: 'Advanced',
};

const currency = (value: number) => `₺${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function DashboardScreen() {
  const {
    user,
    market,
    portfolio,
    currentScenario,
    todayHotshot,
    endDayWithResult,
    trade,
    getHoldingsValue,
    getNetWorth,
  } = useGameContext();
  const navigation = useNavigation<DashboardNavigationProp>();

  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pan = useRef(new Animated.Value(0)).current;
  const [hasSeenEndDayWarning, setHasSeenEndDayWarning] = useState(false);
  const lastEndDayRef = useRef<number | null>(null);
  const holdingsValue = useMemo(() => getHoldingsValue(), [getHoldingsValue]);
  const netWorth = useMemo(() => getNetWorth(), [getNetWorth]);

  const closeBuyModal = useCallback(() => {
    setShowBuyModal(false);
    setSelectedInstrument(null);
    setError(null);
    pan.setValue(0);
  }, [pan]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            pan.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 100 || gesture.vy > 0.8) {
            closeBuyModal();
          } else {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 8,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        },
      }),
    [closeBuyModal, pan],
  );

  useEffect(() => {
    if (showBuyModal) {
      pan.setValue(0);
    }
  }, [pan, showBuyModal]);

  const onEndDay = useCallback(() => {
    if (!hasSeenEndDayWarning) {
      Alert.alert(
        'Review before ending day',
        'Before ending the day, please review your portfolio. Make sure you are happy with your positions.'
      );
      setHasSeenEndDayWarning(true);
      return;
    }

    const now = Date.now();
    if (lastEndDayRef.current && now - lastEndDayRef.current < 5000) {
      Alert.alert('Please wait', 'Please wait a few seconds before ending the day again.');
      return;
    }

    const result = endDayWithResult();
    if (!result) return;

    lastEndDayRef.current = now;
    navigation.navigate('EndOfDaySummary', { dayResult: result });
  }, [endDayWithResult, hasSeenEndDayWarning, navigation]);

  const onSelectTicker = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setQuantity('1');
    setError(null);
    setShowBuyModal(true);
  };

  const onConfirmBuy = () => {
    if (!selectedInstrument) return;
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    const success = trade(selectedInstrument.symbol, qty, 'buy');
    if (!success) {
      setError('Not enough virtual balance to complete this order.');
      return;
    }

    closeBuyModal();
    Alert.alert('Order placed', `Bought ${qty} ${selectedInstrument.symbol} using game credits.`);
  };

  const renderChange = (changePercent: number) => {
    const percent = changePercent * 100;
    const isUp = percent >= 0;
    const changeColor = isUp ? '#16a34a' : '#dc2626';
    return (
      <View style={styles.changeRow}>
        <Ionicons name={isUp ? 'trending-up' : 'trending-down'} size={14} color={changeColor} />
        <Text style={[styles.changeText, { color: changeColor }]}>
          {isUp ? '+' : ''}
          {percent.toFixed(2)}%
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.metaText}>
              Day {user.currentDay} · {ageGroupLabels[user.ageGroup]} level
            </Text>
          </View>
          <View style={styles.tag}>
            <Ionicons name="time-outline" size={16} color="#2563eb" />
            <Text style={styles.tagText}>Game loop active</Text>
          </View>
        </View>

        <Card variant="elevated" style={styles.netWorthCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Total net worth</Text>
            <Badge label="Live" size="sm" />
          </View>
          <Text style={styles.netWorth}>{currency(netWorth)}</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Cash</Text>
              <Text style={styles.metricValue}>{currency(portfolio.cashBalance)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Holdings value</Text>
              <Text style={styles.metricValue}>{currency(holdingsValue)}</Text>
            </View>
          </View>
          {currentScenario ? (
            <View style={styles.scenarioPill}>
              <Ionicons name="flash" size={16} color="#f59e0b" />
              <View style={{ flex: 1 }}>
                <Text style={styles.scenarioTitle} numberOfLines={1}>
                  {currentScenario.title}
                </Text>
                <Text style={styles.scenarioText} numberOfLines={2}>
                  {currentScenario.explanation}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Trigger a new day to see the latest scenario.</Text>
          )}
          
        <Button onPress={onEndDay} fullWidth>
          Sleep / End Day
        </Button>

        </Card>

        {todayHotshot ? (
          <Pressable
            style={({ pressed }) => [
              styles.hotshotBanner,
              pressed && styles.hotshotBannerPressed,
            ]}
            onPress={() =>
              navigation.navigate('Scenarios', { initialCategory: 'daily-hotshots' })
            }
          >
            <View style={styles.hotshotHeader}>
              <View style={styles.hotshotPill}>
                <Ionicons name="flame" size={14} color="#fff" />
                <Text style={styles.hotshotLabel}>Daily Hotshot</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#475569" />
            </View>
            <Text style={styles.hotshotTitle}>{todayHotshot.title}</Text>
            <Text numberOfLines={2} style={styles.hotshotSnippet}>
              {todayHotshot.description}
            </Text>

          </Pressable>
        ) : (
          <View style={[styles.hotshotBanner, styles.hotshotPlaceholder]}>
            <Text style={[styles.hotshotLabel, styles.hotshotLabelMuted]}>Daily Hotshot</Text>
            <Text style={styles.hotshotSnippet}>
              New market news will appear here once the day begins.
            </Text>
          </View>
        )}


        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Market ticker</Text>
            <Text style={styles.sectionSubtitle}>Tap any asset to open buy flow</Text>
          </View>
          <View style={styles.cashBadge}>
            <Ionicons name="wallet" size={16} color="#2563eb" />
            <Text style={styles.cashText}>{currency(portfolio.cashBalance)}</Text>
          </View>
        </View>

        <Card variant="elevated" style={styles.tickerCard}>
          {market.map((inst, index) => (
            <Pressable
              key={inst.symbol}
              style={({ pressed }) => [
                styles.tickerRow,
                index !== market.length - 1 && styles.tickerDivider,
                pressed && styles.tickerPressed,
              ]}
              onPress={() => onSelectTicker(inst)}
            >
              <View style={styles.tickerInfo}>
                <Text style={styles.symbol}>{inst.symbol}</Text>
                <Text style={styles.name}>{inst.name}</Text>
                <View style={styles.marketChip}>
                  <Text style={styles.marketText}>{inst.market}</Text>
                </View>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>{currency(inst.currentPrice)}</Text>
                {renderChange(inst.changePercent)}
              </View>
            </Pressable>
          ))}
        </Card>

      </ScrollView>

      <Modal
        visible={showBuyModal}
        animationType="slide"
        transparent
        onRequestClose={closeBuyModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <Pressable style={styles.modalOverlay} onPress={closeBuyModal}>
            <Animated.View
              style={[styles.modalContent, { transform: [{ translateY: pan }] }]}
              {...panResponder.panHandlers}
              onStartShouldSetResponder={() => true}
            >
              <Pressable style={styles.modalHandle} onPress={closeBuyModal} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buy asset</Text>
              {selectedInstrument ? <Text style={styles.modalSubtitle}>{selectedInstrument.name}</Text> : null}
            </View>

            {selectedInstrument ? (
              <>
                <View style={styles.modalSummary}>
                  <Text style={styles.summaryLabel}>Symbol</Text>
                  <Text style={styles.summaryValue}>{selectedInstrument.symbol}</Text>
                </View>
                <View style={styles.modalSummary}>
                  <Text style={styles.summaryLabel}>Price</Text>
                  <Text style={styles.summaryValue}>{currency(selectedInstrument.currentPrice)}</Text>
                </View>
                <View style={styles.modalSummary}>
                  <Text style={styles.summaryLabel}>Available cash</Text>
                  <Text style={styles.summaryValue}>{currency(portfolio.cashBalance)}</Text>
                </View>

                <Text style={styles.quantityLabel}>Quantity</Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                  placeholder="1"
                  style={styles.quantityInput}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.modalActions}>
                  <Button variant="outline" onPress={closeBuyModal} style={styles.actionButton}>
                    Cancel
                  </Button>
                  <Button onPress={onConfirmBuy} style={styles.actionButton}>
                    Confirm Buy
                  </Button>
                </View>
              </>
            ) : null}
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '800',
  },
  metaText: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 14,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  netWorthCard: {
    gap: 12,

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  netWorth: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  scenarioPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  scenarioTitle: {
    color: '#9a3412',
    fontSize: 13,
    fontWeight: '700',
  },
  scenarioText: {
    color: '#9a3412',
    fontSize: 12,
    marginTop: 2,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  cashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  cashText: {
    color: '#075985',
    fontWeight: '700',
  },
  tickerCard: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  tickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  tickerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tickerPressed: {
    backgroundColor: '#f1f5f9',
  },
  tickerInfo: {
    flex: 1,
    gap: 4,
  },
  symbol: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  name: {
    color: '#6b7280',
    fontSize: 12,
  },
  marketChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  marketText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hotshotBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  hotshotBannerPressed: {
    backgroundColor: '#f8fafc',
  },
  hotshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotshotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f97316',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  hotshotLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  hotshotLabelMuted: {
    color: '#0f172a',
  },
  hotshotTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  hotshotSnippet: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  hotshotPlaceholder: {
    backgroundColor: '#f8fafc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,

  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 999,
    alignSelf: 'center',
  },
  modalHeader: {
    gap: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 13,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  quantityLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});
