import React, { useState, useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "@/styles";

const PairwiseRanker = ({ items, onRestart }) => {
  const [rankedBelow, setRankedBelow] = useState({}); // Stores ranked-below lists per item
  const [possiblePairings, setPossiblePairings] = useState([]); // All possible pairings
  const [currentPair, setCurrentPair] = useState(null); // The pair currently being ranked

  useEffect(() => {
    if (items) {
      // Initialize rankedBelow and possible pairings
      const initialRankedBelow = items.reduce((acc, item) => {
        acc[item.id] = [];
        return acc;
      }, {});

      const allPairs = [];
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          allPairs.push([items[i].id, items[j].id]);
        }
      }

      setRankedBelow(initialRankedBelow);
      setPossiblePairings(allPairs);
      setCurrentPair(allPairs[Math.floor(Math.random() * allPairs.length)]);
    }
  }, [items]);

  const handleChoice = (selectedId) => {
    if (!currentPair) return;

    const [first, second] = currentPair;
    const nonSelectedId = selectedId === first ? second : first;
    const updatedRankedBelow = { ...rankedBelow };

    // Recursive function to update rankings
    const updateRankings = (winnerId, loserId) => {
      if (!updatedRankedBelow[winnerId].includes(loserId)) {
        updatedRankedBelow[winnerId].push(loserId);
      }

      // Add all items ranked below loserId to winnerId's list
      updatedRankedBelow[loserId].forEach((id) => {
        if (!updatedRankedBelow[winnerId].includes(id)) {
          updatedRankedBelow[winnerId].push(id);
        }
      });
    };

    // Debug: Print before modifications
    console.log("Before Update:");
    console.log("Ranked Below:", JSON.stringify(updatedRankedBelow, null, 2));
    console.log("Possible Pairings Count:", possiblePairings.length);
    console.log("Current Pair:", currentPair);

    // Update rankings for the selected pair
    updateRankings(selectedId, nonSelectedId);

    // Remove pairs involving loserId from possible pairings
    const newPairings = possiblePairings.filter(
      ([id1, id2]) =>
        !(
          (id1 === selectedId && id2 === nonSelectedId) ||
          (id1 === nonSelectedId && id2 === selectedId)
        )
    );

    setPossiblePairings(newPairings);
    setRankedBelow(updatedRankedBelow);

    // Debug: Print after modifications
    console.log("After Update:");
    console.log("Updated Ranked Below:", JSON.stringify(updatedRankedBelow, null, 2));
    console.log("New Possible Pairings Count:", newPairings.length);

    if (newPairings.length > 0) {
      const newPair = newPairings[Math.floor(Math.random() * newPairings.length)];
      console.log("Next Pair:", newPair); // Debug: Print next pair
      setCurrentPair(newPair);
    } else {
      console.log("No more pairs left to rank.");
      setCurrentPair(null); // No more pairs to rank
    }
  };

  const handleRestart = () => {
    Alert.alert(
      "Restart",
      "Are you sure you want to restart? All progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Restart", onPress: onRestart },
      ]
    );
  };

  if (!items || items.length === 0) return null;

  if (!currentPair) {
    const finalRanking = Object.keys(rankedBelow).sort((a, b) => {
      return rankedBelow[a].length - rankedBelow[b].length;
    });

    return (
      <View style={styles.stepContainer}>
        <ThemedText style={styles.heading}>Final Ranking</ThemedText>
        {finalRanking.map((id, index) => (
          <ThemedText key={id} style={styles.item}>
            {index + 1}. {items.find((item) => item.id === id).text}
          </ThemedText>
        ))}
        <Button title="Restart" onPress={handleRestart} />
      </View>
    );
  }

  const [first, second] = currentPair;
  const firstItem = items.find((item) => item.id === first);
  const secondItem = items.find((item) => item.id === second);

  // Debug: Print the current pair and their rankings
  console.log("Current Pair:", currentPair);
  console.log("Ranked Below for First Item:", rankedBelow[first]);
  console.log("Ranked Below for Second Item:", rankedBelow[second]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>Pairwise Ranker</ThemedText>
      <View style={styles.buttonContainer}>
        <Button title={firstItem.text} onPress={() => handleChoice(first)} />
        <ThemedText style={styles.vs}>VS</ThemedText>
        <Button title={secondItem.text} onPress={() => handleChoice(second)} />
      </View>
      <Button title="Restart" onPress={handleRestart} />
    </View>
  );
};

export default PairwiseRanker;
