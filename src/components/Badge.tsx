/**
 * Badge/Tag component for labels and categories
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantColors = {
  default: { bg: '#f3f4f6', text: '#374151' },
  success: { bg: '#dcfce7', text: '#16a34a' },
  warning: { bg: '#fef9c3', text: '#ca8a04' },
  error: { bg: '#fee2e2', text: '#dc2626' },
  info: { bg: '#dbeafe', text: '#2563eb' },
};

export default function Badge({
  label,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) {
  const colors = variantColors[variant];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.bg },
        size === 'sm' && styles.small,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === 'sm' && styles.textSmall,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 12,
  },
});
