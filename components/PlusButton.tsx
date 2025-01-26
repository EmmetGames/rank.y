// File: src/components/PlusButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import styles from '@/styles';

export function PlusButton({ addItem }) {
  return (
    <ThemedView>
      <TouchableOpacity onPress={addItem}>
        <ThemedView style={styles.addWrapper}>
          <ThemedText>+</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}
