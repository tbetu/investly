/**
 * Icon button component for navigation and actions
 */

import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function IconButton({
  icon,
  onPress,
  size = 24,
  color = '#374151',
  backgroundColor = 'transparent',
  style,
}: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor },
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
