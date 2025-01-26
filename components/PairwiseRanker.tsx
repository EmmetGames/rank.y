import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "@/styles";
import { AutoSizedButton } from "./AutoSizedButton";
import { betterAlert } from "@/utils/BetterAlert";
import { PageView } from "./PageView";

const PairwiseRanker = ({ items, onRestart, infoVisible, setInfoVisible }) => {
  const [rankedBelow, setRankedBelow] = useState({}); // Stores ranked-below lists per item
  const [possiblePairings, setPossiblePairings] = useState([]); // All possible pairings
  const [currentPair, setCurrentPair] = useState(null); // The pair currently being ranked

  // Track the initial number of pairings (N)
  const [initialPairingsCount, setInitialPairingsCount] = useState(0);

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
      setInitialPairingsCount(allPairs.length);
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
    betterAlert({title: "Restart", message: "Are you sure you want to restart? All progress will be lost.", onConfirm: onRestart});
  };

  if (!items || items.length === 0) return null;

  if (!currentPair) {
    const finalRanking = Object.keys(rankedBelow).sort((a, b) => {
      return rankedBelow[b].length - rankedBelow[a].length;
    });

    return (
      <PageView content={
        <View style={styles.container}>
        <ThemedText style={styles.heading}>Final Ranking</ThemedText>
        {finalRanking.map((id, index) => (
          <ThemedText key={id} style={styles.item}>
            {index + 1}. {getText(id)}
          </ThemedText>
        ))}
      </View>
      } bottomContent={
        <View style={{bottom: 100, alignSelf: 'center', justifyContent: 'center'}}>
          <Button title="Restart" onPress={handleRestart} />
        </View>
      } infoVisible={infoVisible} setInfoVisible={setInfoVisible} />












    );
  }

  const [first, second] = currentPair;
  const firstItem = items.find((item) => item.id === first);
  const secondItem = items.find((item) => item.id === second);

  // 2. Calculate our progress: (N - X) / N
  const N = initialPairingsCount;
  const X = possiblePairings.length;
  const progressValue = N === 0 ? 0 : (N - X) / N;
  const progressPercent = Math.round(progressValue * 100);

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
    <PageView content={
      <View style={styles.container}>
      <ThemedText style={styles.heading}>Let's pick!</ThemedText>
      <View style={pairwiseRankerStyles.rowContainer}>
        <View style={pairwiseRankerStyles.leftContainer}>
          <View style={styles.buttonStyle}>
            <AutoSizedButton title={firstItem.text} onPress={() => handleChoice(first)} />
          </View>
        </View>

        <View style={pairwiseRankerStyles.centerContainer}>
          <ThemedText style={styles.vs}>VS</ThemedText>
        </View>

        <View style={pairwiseRankerStyles.rightContainer}>
          <View style={styles.buttonStyle}>
            <AutoSizedButton title={secondItem.text} onPress={() => handleChoice(second)} />
          </View>
        </View>
      </View>

      <View style={{ marginTop: 16, alignSelf: "stretch" }}>
        {/* Outer bar (background) */}
        <View
          style={{
            backgroundColor: "#ccc",
            height: 8,
            borderRadius: 4,
          }}
        >
          {/* Inner bar (progress) */}
          <View
            style={{
              backgroundColor: "#007AFF",
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: 4,
            }}
          />
        </View>
        <ThemedText style={{ textAlign: "center", marginTop: 6 }}>
          {progressPercent}% Complete
        </ThemedText>
      </View>
    </View>
    } bottomContent={
      <View style={{bottom: 100, alignSelf: 'center', justifyContent: 'center'}}>
        <Button title="Restart" onPress={handleRestart} />
      </View>
    } infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
  );
};

export default PairwiseRanker;

const pairwiseRankerStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  centerContainer: {
    // No flex, so it doesn't expand
    // or give it a small fixed width if you like
    // width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    // any other styling you wish
    marginHorizontal: 8,
  },
});