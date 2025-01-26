import React from "react";
import { TouchableOpacity, Alert, StyleSheet, Text, View, Button } from "react-native";

export default function InfoButton({ onPress}) {
  // Press handler that shows an alert explaining what the app does
  const handlePress = () => {
    console.log("Info button pressed");
    onPress();
  };

  return (
    <View style={styles.container}>
        <Button title="Info" onPress={handlePress} />
    </View>
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
