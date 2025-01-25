import React from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { StyleSheet, TouchableOpacity  } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function ListedItem({ item, deleteItem }) {
    return (
        <ThemedView style={moreStyles.listedItem}>
          <ThemedText>
            {console.log(`Item Text: ${item.text}, Text Color: ${useThemeColor({}, 'text')}`)}
            {item.text}
          </ThemedText>
          <TouchableOpacity
        style={moreStyles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <ThemedText>Delete</ThemedText>
      </TouchableOpacity>
        </ThemedView>
      );
}

const moreStyles = StyleSheet.create({
  listedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', /* Align items vertically in the center */
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#ff6347', /* Tomato color */
    color: '#fff',
    padding: 4,
    borderRadius: 4,
    cursor: 'pointer',
  },
});