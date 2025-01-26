import React from "react";
import { Modal, View, Text, Button, StyleSheet, ScrollView } from "react-native";

export default function InfoModal({ visible, onClose }) {
  return (
    <Modal
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>1. What is Rank.y?</Text>
        <Text style={styles.paragraph}>
        Rank.y is a pairwise comparison tool that helps you organize and prioritize ideas, tasks, or any list of items you’d like to compare.
        {'\n'}Instead of ranking items all at once (which can be confusing or overwhelming), Rank.y systematically walks you through pairwise comparisons (i.e., which of these two items do you prefer?).
        {'\n'}By comparing two items at a time, you quickly end up with a sorted list from most preferred to least preferred.
        </Text>

        <Text style={styles.heading}>2. How to Use</Text>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 20, fontWeight: "bold" }}>a.</Text>
            <Text style={{ flex: 1 }}>
                Input Items: Start by entering each item you want to rank. You can add as many items as you like, but at least two.
            </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 20, fontWeight: "bold" }}>b.</Text>
            <Text style={{ flex: 1 }}>
                Begin Ranking: Once you have your list, press Begin Ranking. Rank.y will present pairs of items and ask which one you prefer. Choose between the two options.
            </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 20, fontWeight: "bold" }}>c.</Text>
            <Text style={{ flex: 1 }}>
                Continue Until Done: Rank.y automatically keeps track of inferred relationships (for example, if A > B and B > C, it assumes A > C), so you won’t have to compare every combination of every item. Keep answering the pairwise prompts until you’ve compared all necessary pairs.
            </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 20, fontWeight: "bold" }}>d.</Text>
            <Text style={{ flex: 1 }}>
                Final Results: Once all comparisons are done, Rank.y reveals your final sorted list, from most preferred to least preferred.
            </Text>
        </View>

        <Text style={styles.heading}>3. Made a Mistake?</Text>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 20, fontWeight: "bold" }}>a.</Text>
            <Text style={{ flex: 1 }}>
                Restart Entirely: If you realize you need to re-rank or you want to start fresh with new items, you can tap Restart to begin again.
            </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 20, fontWeight: "bold" }}>b.</Text>
            <Text style={{ flex: 1 }}>
                Delete or Edit Items: If you accidentally added an item or typed its name incorrectly, just remove that item before you start ranking (or restart if you’ve already begun).
            </Text>
        </View>

        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  paragraph: {
    marginTop: 5,
    fontSize: 16,
    lineHeight: 22,
  },
});
