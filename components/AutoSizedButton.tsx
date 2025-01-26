import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

// Button that adjusts to the text inside it but also has a buffer around the text.
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
  },
  buttonText: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 36,
  },
});
