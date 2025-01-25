import React from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export function ListedItem({ item, deleteItem }) {
    return (
      <ThemedView style={styles.item}>
        <ThemedView style={styles.itemLeft}>
          <ThemedText style={styles.itemText}>{item.text}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.circular}>
          <TouchableOpacity key={item.id}  onPress={deleteItem}>
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.circular}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '80%',
  },
  square: {
    width: 24,
    height: 24,
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 5,
  },
});
