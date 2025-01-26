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
    const updatedRankedBelow = { ...rankedBelow };

    // Recursive function to update rankings
    const updateRankings = (winnerId, loserId) => {
      if (!updatedRankedBelow[winnerId].includes(loserId)) {
        updatedRankedBelow[winnerId].push(loserId);
      }
    
      // Add all items from loser's rankedBelow list to winner's list, avoiding duplicates
      updatedRankedBelow[loserId].forEach((id) => {
        if (!updatedRankedBelow[winnerId].includes(id)) {
          updatedRankedBelow[winnerId].push(id);
        }
      });

      // Remove pairings involving the loser and items already ranked below the winner
      setPossiblePairings((prev) => {
        console.log("Filtering Possible Pairings:");
        prev.forEach(([id1, id2]) => {
          console.log(
            `- Pair: ${getText(id1)} (${id1}) vs ${getText(id2)} (${id2})`
          );
        });
      
        const filtered = prev.filter(([id1, id2]) => {
          const loserIsInvalid =
            (id1 != winnerId && updatedRankedBelow[id2].includes(id1)) ||
            (id2 != winnerId && updatedRankedBelow[id1].includes(id2));
      
          const currentPairIsRanked =
            (id1 === winnerId && id2 === loserId) ||
            (id1 === loserId && id2 === winnerId);
      
          if (currentPairIsRanked) {
            console.log(
              `Removing pairing [${getText(id1)} (${id1}) vs ${getText(id2)} (${id2})] - already ranked.`
            );
          } else if (loserIsInvalid) {
            console.log(
              `Removing pairing [${getText(id1)} (${id1}) vs ${getText(id2)} (${id2})] - loser (${getText(
                loserId
              )}) - Inferred ranking.`
            );
          } else {
            console.log(
              `Keeping pairing [${getText(id1)} (${id1}) vs ${getText(id2)} (${id2})].`
            );
          }
      
          return !currentPairIsRanked && !loserIsInvalid;
        });
      
        console.log(
          `Filtered Possible Pairings: ${JSON.stringify(filtered.map(([id1, id2]) => [getText(id1), getText(id2)]))}`
        );
      
        return filtered;
      });
    
      // Find all items where the winner is in their rankedBelow list and propagate the loser's items
      Object.keys(updatedRankedBelow).forEach((id) => {
        if (updatedRankedBelow[id].includes(winnerId)) {
          updateRankings(id, loserId); // Recursive call
        }
      });
    };

    // Debug: Print before modifications
    console.log(""); // Spacing
    console.log("Before Update:");
    console.log("Ranked Below:");
    Object.entries(updatedRankedBelow).forEach(([id, list]) => {
      console.log(`- ${getText(id)} (${id}): ${list.map((lid) => `${getText(lid)} (${lid})`).join(", ")}`);
    });
    console.log("Possible Pairings Count:", possiblePairings.length);
    console.log(
      "Current Pair:",
      `${getText(first)} (${first}) vs ${getText(second)} (${second})`
    );
    console.log("---"); // Spacing

  // Call updateRankings for the current choice
    updateRankings(selectedId, nonSelectedId);
    setRankedBelow(updatedRankedBelow);

    // Log after updates
    console.log(
      `After Update:\nUpdated Ranked Below:\n${Object.entries(updatedRankedBelow)
        .map(([key, value]) => `- ${getText(key)} (${key}): ${value.map(getText)}`)
        .join("\n")}`
    );
    
    console.log("Updated Possible Pairings Count:", possiblePairings.length);

    if (possiblePairings.length > 0) { 
      setCurrentPair(possiblePairings[Math.floor(Math.random() * possiblePairings.length)]);
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
