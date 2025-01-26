import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function AutoSizedButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    // No fixed width or height, so it auto-sizes to content
    // while padding ensures extra space.
  },
  buttonText: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 36,
  },
});
