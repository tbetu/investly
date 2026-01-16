/**
 * Portfolio screen - View holdings and practice buy/sell
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameContext } from '../context/GameContext';
import { INITIAL_PORTFOLIO, Instrument } from '../data/gameData';
import { Card } from '../components';

type PortfolioScreenProps = {
  navigation: any;
};

export default function PortfolioScreen({ navigation }: PortfolioScreenProps) {
  const insets = useSafeAreaInsets();
  const { market, portfolio, trade, getHoldingsValue, getNetWorth } = useGameContext();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'buy' | 'sell'>('buy');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const slide = useRef(new Animated.Value(0)).current;

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedSymbol(null);
    setError(null);
    slide.setValue(0);
  }, [slide]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            slide.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 80 || gesture.vy > 0.8) {
            closeModal();
          } else {
            Animated.spring(slide, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 8,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(slide, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        },
      }),
    [closeModal, slide]
  );

  useEffect(() => {
    if (showModal) {
      slide.setValue(0);
    }
  }, [showModal, slide]);

  const portfolioValue = useMemo(() => getHoldingsValue(), [getHoldingsValue]);
  const netWorth = useMemo(() => getNetWorth(), [getNetWorth]);
  const totalChange =
    INITIAL_PORTFOLIO.cashBalance > 0
      ? ((netWorth - INITIAL_PORTFOLIO.cashBalance) / INITIAL_PORTFOLIO.cashBalance) * 100
      : 0;

  const openModal = (type: 'buy' | 'sell') => {
    setModalType(type);
    setSelectedSymbol(null);
    setQuantity('1');
    setError(null);
    slide.setValue(0);
    setShowModal(true);
  };

  const handleTrade = () => {
    if (!selectedSymbol || !quantity) return;
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) return;

    const didTrade = trade(selectedSymbol, qty, modalType);
    if (!didTrade) {
      setError('Trade could not be executed. Check balance/quantity.');
      return;
    }
    
    closeModal();
  };

  const getInstrumentsForModal = () => {
    if (modalType === 'buy') {
      return market;
    }
    // For sell, only show instruments user owns
    return market.filter((i) =>
      portfolio.holdings.some((h) => h.symbol === i.symbol)
    );
  };

  const getInstrumentBySymbol = (symbol: string): Instrument | undefined => {
    return market.find((i) => i.symbol === symbol);
  };

  const getHoldingValue = (symbol: string, quantity: number): number => {
    const instrument = getInstrumentBySymbol(symbol);
    const price = instrument ? instrument.currentPrice : 0;
    return price * quantity;
  };

  const getHoldingChange = (symbol: string, avgPrice: number): number => {
    const instrument = getInstrumentBySymbol(symbol);
    if (!instrument || avgPrice === 0) return 0;
    return ((instrument.currentPrice - avgPrice) / avgPrice) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Portfolio</Text>

        {/* Balance cards */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Virtual Balance</Text>
            <Text style={styles.balanceAmount}>₺{portfolio.cashBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Portfolio Value</Text>
            <Text style={styles.balanceAmount}>
              ₺{portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.changeText, totalChange >= 0 ? styles.positive : styles.negative]}>
              {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Holdings section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Holdings</Text>
          
          {portfolio.holdings.length === 0 ? (
            <Card variant="elevated" style={styles.emptyCard}>
              <Text style={styles.emptyText}>No holdings yet. Use Buy to start building.</Text>
            </Card>
          ) : (
            <View style={styles.holdingsList}>
              {portfolio.holdings.map((holding) => {
                const value = getHoldingValue(holding.symbol, holding.quantity);
                const change = getHoldingChange(holding.symbol, holding.avgPrice);
                const instrument = getInstrumentBySymbol(holding.symbol);
                
                return (
                  <Card key={holding.symbol} variant="elevated" style={styles.holdingCard}>
                    <View style={styles.holdingHeader}>
                      <View>
                        <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                        <Text style={styles.holdingName}>{holding.name}</Text>
                      </View>
                      <View style={styles.holdingValues}>
                        <Text style={styles.holdingValue}>₺{value.toLocaleString()}</Text>
                        <View style={styles.changeRow}>
                          <Ionicons
                            name={change >= 0 ? 'trending-up' : 'trending-down'}
                            size={12}
                            color={change >= 0 ? '#16a34a' : '#dc2626'}
                          />
                          <Text style={[styles.holdingChange, change >= 0 ? styles.positive : styles.negative]}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.holdingDetails}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Quantity</Text>
                        <Text style={styles.detailValue}>{holding.quantity}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Avg Price</Text>
                        <Text style={styles.detailValue}>₺{holding.avgPrice.toFixed(2)}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Current</Text>
                        <Text style={styles.detailValue}>
                          ₺{(instrument?.currentPrice ?? holding.avgPrice).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => openModal('buy')}
            >
              <View style={[styles.actionIcon, styles.buyIcon]}>
                <Ionicons name="add" size={24} color="#16a34a" />
              </View>
              <Text style={styles.actionText}>Buy</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => openModal('sell')}
            >
              <View style={[styles.actionIcon, styles.sellIcon]}>
                <Ionicons name="remove" size={24} color="#dc2626" />
              </View>
              <Text style={styles.actionText}>Sell</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Buy/Sell Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={insets.top + 16}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <Animated.View
              style={[styles.modalContent, { transform: [{ translateY: slide }] }]}
              {...panResponder.panHandlers}
              onStartShouldSetResponder={() => true}
            >
              <Pressable style={styles.modalHandle} onPress={closeModal} />
              
              <Text style={styles.modalTitle}>
                {modalType === 'buy' ? 'Buy Asset' : 'Sell Asset'}
              </Text>

              {/* Instrument selection */}
              <Text style={styles.modalSubtitle}>Select instrument</Text>
              <ScrollView style={styles.instrumentList} showsVerticalScrollIndicator={false}>
                {getInstrumentsForModal().map((instrument) => (
                  <Pressable
                    key={instrument.symbol}
                    style={[
                      styles.instrumentItem,
                      selectedSymbol === instrument.symbol && styles.instrumentItemSelected,
                    ]}
                    onPress={() => setSelectedSymbol(instrument.symbol)}
                  >
                    <View>
                      <Text style={styles.instrumentSymbol}>{instrument.symbol}</Text>
                      <Text style={styles.instrumentName}>{instrument.name}</Text>
                    </View>
                    <Text style={styles.instrumentPrice}>₺{instrument.currentPrice.toFixed(2)}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {selectedSymbol && (
                <View style={styles.quantitySection}>
                  <Text style={styles.modalSubtitle}>Quantity</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="number-pad"
                    placeholder="1"
                  />
                </View>
              )}

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.modalButton,
                    modalType === 'buy' ? styles.buyButton : styles.sellButton,
                    !selectedSymbol && styles.buttonDisabled,
                  ]}
                  onPress={handleTrade}
                  disabled={!selectedSymbol}
                >
                  <Text style={styles.tradeButtonText}>
                    {modalType === 'buy' ? 'Buy' : 'Sell'}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#bfdbfe',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  changeText: {
    fontSize: 12,
    marginTop: 4,
  },
  positive: {
    color: '#86efac',
  },
  negative: {
    color: '#fca5a5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
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
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  holdingsList: {
    gap: 12,
  },
  holdingCard: {
    padding: 16,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  holdingSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  holdingName: {
    fontSize: 12,
    color: '#6b7280',
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  holdingChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  holdingDetails: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  actionCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyIcon: {
    backgroundColor: '#dcfce7',
  },
  sellIcon: {
    backgroundColor: '#fee2e2',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  instrumentList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  instrumentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  instrumentItemSelected: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  instrumentSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  instrumentName: {
    fontSize: 12,
    color: '#6b7280',
  },
  instrumentPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  buyButton: {
    backgroundColor: '#16a34a',
  },
  sellButton: {
    backgroundColor: '#dc2626',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  tradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
