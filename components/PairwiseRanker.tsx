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

      // Remove pairs involving loserId from possible pairings
      setPossiblePairings((prev) =>
        prev.filter(
          ([id1, id2]) => !(id1 === loserId || id2 === loserId)
        )
      );

      // Add all items ranked below loserId to winnerId's list
      updatedRankedBelow[loserId].forEach((id) => {
        if (!updatedRankedBelow[winnerId].includes(id)) {
          updatedRankedBelow[winnerId].push(id);
        }
      });

      // Remove all pairs involving items ranked below loserId
      setPossiblePairings((prev) =>
        prev.filter(
          ([id1, id2]) =>
            !(
              updatedRankedBelow[loserId].includes(id1) ||
              updatedRankedBelow[loserId].includes(id2)
            )
        )
      );

      // Recursively update rankings for any item that had the winnerId ranked below it
      Object.keys(updatedRankedBelow).forEach((id) => {
        if (updatedRankedBelow[id].includes(winnerId)) {
          updateRankings(id, loserId);
        }
      });
    };

    // Update rankings for the selected pair
    updateRankings(selectedId, nonSelectedId);
    setRankedBelow(updatedRankedBelow);

    // Choose a new pair randomly from the remaining possible pairings
    const newPairings = possiblePairings.filter(
      ([id1, id2]) => !(id1 === selectedId && id2 === nonSelectedId)
    );
    setPossiblePairings(newPairings);

    if (newPairings.length > 0) {
      setCurrentPair(newPairings[Math.floor(Math.random() * newPairings.length)]);
    } else {
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

  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>Pairwise Ranker</ThemedText>
      <View style={styles.buttonContainer}>
        <Button
          title={firstItem.text}
          onPress={() => handleChoice(first)}
        />
        <ThemedText style={styles.vs}>VS</ThemedText>
        <Button
          title={secondItem.text}
          onPress={() => handleChoice(second)}
        />
      </View>
      <Button title="Restart" onPress={handleRestart} />
    </View>
  );
};

export default PairwiseRanker;
