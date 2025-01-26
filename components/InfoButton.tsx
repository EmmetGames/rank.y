import React from "react";
import { StyleSheet, Button } from "react-native";
import { ThemedView } from "./ThemedView";

// Info button that when pressed shows app info
export default function InfoButton({ onPress}) {
  // Press handler that shows an alert explaining what the app does
  const handlePress = () => {
    console.log("Info button pressed");
    onPress();
  };

  return (
    <ThemedView style={styles.container}>
        <Button title="Info" onPress={handlePress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // If you want some spacing around the button
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    // Add any styling to differentiate it visually
    color: "#007AFF",
  },
});
