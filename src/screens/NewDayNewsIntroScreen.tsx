import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';

const NewDayNewsIntroScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('MainTabs', {
        screen: 'Scenarios',
        params: { initialCategory: 'daily-hotshots' },
      });
    }, 1700);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.title}>Review the new day&apos;s news</Text>
      <Text style={styles.subtitle}>
        A new trading day is starting. Check today&apos;s Daily Hotshots before making your next moves.
      </Text>
      <Text style={styles.helperText}>
        You&apos;ll be automatically redirected to the Daily Hotshots page in a moment...
      </Text>
    </View>
  );
};

export default NewDayNewsIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  helperText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
});
