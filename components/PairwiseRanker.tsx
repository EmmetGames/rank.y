import React, { useState, useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "@/styles";

const PairwiseRanker = ({ items, onRestart }) => {
  const [rankedBelow, setRankedBelow] = useState({}); // Stores ranked-below lists per item
  const [possiblePairings, setPossiblePairings] = useState([]); // All possible pairings
  const [currentPair, setCurrentPair] = useState(null); // The pair currently being ranked

  useEffect(() => {
    console.log("Starting Items Array:", items);
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

  const getText = (id) => {
    const item = items.find((item) => item.id == id);
    if (!item) {
      console.log(`getText: No item found for ID ${id}`);
    }
    return item?.text || "Unknown";
  };

  const handleChoice = (selectedId) => {
    if (!currentPair) return;
  
    const [first, second] = currentPair;
    const nonSelectedId = selectedId === first ? second : first;
  
    // 1. Clone the existing data
    const newRankedBelow = { ...rankedBelow };
    let newPairings = [...possiblePairings];
  
    // 2. Define a local, recursive function
    const updateRankings = (winnerId, loserId) => {
      // Insert loserId into winner's list if not present
      if (!newRankedBelow[winnerId].includes(loserId)) {
        newRankedBelow[winnerId].push(loserId);
      }
  
      // Pull in all items from loser's list
      newRankedBelow[loserId].forEach((id) => {
        if (!newRankedBelow[winnerId].includes(id)) {
          newRankedBelow[winnerId].push(id);
        }
      });
  
      // Now remove pairings that are invalid given the new relationships
      newPairings = newPairings.filter(([id1, id2]) => {
        const loserIsInvalid =
          (id1 !== winnerId && newRankedBelow[id2].includes(id1)) ||
          (id2 !== winnerId && newRankedBelow[id1].includes(id2));
  
        const currentPairIsRanked =
          (id1 === winnerId && id2 === loserId) ||
          (id1 === loserId && id2 === winnerId);
  
        return !loserIsInvalid && !currentPairIsRanked;
      });
  
      // Recursively update any item whose rankedBelow contains winnerId
      Object.keys(newRankedBelow).forEach((id) => {
        if (newRankedBelow[id].includes(winnerId)) {
          updateRankings(id, loserId);
        }
      });
    };
  
    // 3. Call our local function
    updateRankings(selectedId, nonSelectedId);
  
    // 4. Choose the next pair from the updated local variable
    const pairingsAfterRemoval = newPairings; // name for clarity
    let nextPair = null;
    if (pairingsAfterRemoval.length > 0) {
      nextPair = pairingsAfterRemoval[Math.floor(Math.random() * pairingsAfterRemoval.length)];
    }
  
    // 5. Finally, update state in one shot
    setRankedBelow(newRankedBelow);
    setPossiblePairings(pairingsAfterRemoval);
    setCurrentPair(nextPair);
  
    // That’s it! All changes are local & synchronous in this function call.
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
      return rankedBelow[b].length - rankedBelow[a].length;
    });

    return (
      <View style={styles.stepContainer}>
        <ThemedText style={styles.heading}>Final Ranking</ThemedText>
        {finalRanking.map((id, index) => (
          <ThemedText key={id} style={styles.item}>
            {index + 1}. {getText(id)}
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
  console.log(
    "Current Pair:",
    `${firstItem.text} (${firstItem.id}) vs ${secondItem.text} (${secondItem.id})`
  );
  console.log(
    "Ranked Below for First Item:",
    firstItem.text,
    rankedBelow[first].map((id) => `${getText(id)} (${id})`)
  );
  console.log(
    "Ranked Below for Second Item:",
    secondItem.text,
    rankedBelow[second].map((id) => `${getText(id)} (${id})`)
  );

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
