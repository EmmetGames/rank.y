import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "@/styles";
import { AutoSizedButton } from "@/components/AutoSizedButton";
import { betterAlert } from "@/utils/BetterAlert";
import { PageView } from "@/components/PageView";
import { ThemedView } from "../ThemedView";

// Page showing UI that allows the user to rank items in a pairwise fashion.
// The user is shown two items at a time and must choose which one they prefer.
// Once all pairs have been ranked, the final ranking is displayed.
const RankingPage = ({ items, onRestart, infoVisible, setInfoVisible }) => {
  const [rankedBelow, setRankedBelow] = useState({}); // Stores ranked-below lists per item
  const [possiblePairings, setPossiblePairings] = useState([]); // All possible pairings
  const [currentPair, setCurrentPair] = useState(null); // The pair currently being ranked

  // Track the initial number of pairings. This is used to calculate progress percentage.
  const [initialPairingsCount, setInitialPairingsCount] = useState(0);

  // When the items change, reset the state
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

  // Helper function to get the text of an item by its ID
  const getText = (id) => {
    const item = items.find((item) => item.id == id);
    if (!item) {
      console.log(`getText: No item found for ID ${id}`);
    }
    return item?.text || "Unknown";
  };

  // Function to handle the user's choice between two items
  // It updates the rankedBelow and possiblePairings state
  const handleChoice = (selectedId) => {
    if (!currentPair) return; // Sanity check

    const [first, second] = currentPair;
    const nonSelectedId = selectedId === first ? second : first;

    // 1. Clone the existing data
    const newRankedBelow = { ...rankedBelow };
    let newPairings = [...possiblePairings];

    // 2. Define a local, recursive function that updates the rankings
    const updateRankings = (winnerId, loserId) => {

      // 2.a. Insert loserId into winner's list if not present
      if (!newRankedBelow[winnerId].includes(loserId)) {
        newRankedBelow[winnerId].push(loserId);
      }

      // 2.b. Pull in all items from loser's list
      newRankedBelow[loserId].forEach((id) => {
        if (!newRankedBelow[winnerId].includes(id)) {
          newRankedBelow[winnerId].push(id);
        }
      });

      // 2.c. Now remove pairings that are invalid given the new relationships
      newPairings = newPairings.filter(([id1, id2]) => {
        const loserIsInvalid =
          (id1 !== winnerId && newRankedBelow[id2].includes(id1)) ||
          (id2 !== winnerId && newRankedBelow[id1].includes(id2)); // This condition means if the item is not the winner & it already exists in the rankedBelow list of the other item, then it is invalid.

        const currentPairIsRanked =
          (id1 === winnerId && id2 === loserId) ||
          (id1 === loserId && id2 === winnerId);

        return !loserIsInvalid && !currentPairIsRanked;
      });

      // 3.d. Recursively update any item whose rankedBelow contains winnerId, allowing the rankings to propagate
      Object.keys(newRankedBelow).forEach((id) => {
        if (newRankedBelow[id].includes(winnerId)) {
          updateRankings(id, loserId);
        }
      });
    };

    // 3. Call our local function
    updateRankings(selectedId, nonSelectedId);

    // 4. Choose the next pair from the updated local variable
    // We have to use the local variables because the state is asynchronous and may not have updated yet
    const pairingsAfterRemoval = newPairings; // name for clarity
    let nextPair = null;
    if (pairingsAfterRemoval.length > 0) {
      nextPair = pairingsAfterRemoval[Math.floor(Math.random() * pairingsAfterRemoval.length)];
    }

    // 5. Finally, update state in one shot
    setRankedBelow(newRankedBelow);
    setPossiblePairings(pairingsAfterRemoval);
    setCurrentPair(nextPair);
  };

  // Function that is called when user presses the "Restart" button.
  // After prompting the user it will restart the ranking process, which will take us back to the InputPage based on the logic in index.tsx.
  const handleRestart = () => {
    betterAlert({ title: "Restart", message: "Are you sure you want to restart? All progress will be lost.", onConfirm: onRestart });
  };

  if (!items || items.length === 0) return null; // Sanity check

  // If there are no more pairs to rank, show the final ranking
  if (!currentPair) {
    const finalRanking = Object.keys(rankedBelow).sort((a, b) => {
      return rankedBelow[b].length - rankedBelow[a].length;
    });

    return (
      <PageView content={ // We wrap the content in a PageView component to make it look nice.
        <ThemedView style={styles.container}>
          {/* Title */}
          <ThemedText style={styles.heading}>Final Ranking</ThemedText>

          {/* Display the final ranking, ordered descending */}
          {finalRanking.map((id, index) => (
            <ThemedText key={id} style={styles.item}>
              {index + 1}. {getText(id)}
            </ThemedText>
          ))}
        </ThemedView>
      } bottomContent={ // The bottom of the screen will show the "Restart" button
        <ThemedView style={{ bottom: 100, alignSelf: 'center', justifyContent: 'center' }}>
          <Button title="Restart" onPress={handleRestart} />
        </ThemedView>
      } infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
    );
  }

  // Note - these have to be defined here.
  const [first, second] = currentPair; // Destructure the current pair
  const firstItem = items.find((item) => item.id === first); // Hold the first item
  const secondItem = items.find((item) => item.id === second); // Hold the second item

  // 2. Calculate our progress: (pairingsLeft - pairingsTotal) / pairingsLeft
  const pairingsLeft = initialPairingsCount;
  const pairingsTotal = possiblePairings.length;
  const progressValue = pairingsLeft === 0 ? 0 : (pairingsLeft - pairingsTotal) / pairingsLeft;
  const progressPercent = Math.round(progressValue * 100);

  console.log(
    `Current Pair: ${firstItem.text} (${firstItem.id}) vs ${secondItem.text} (${secondItem.id})\n` +
    `Ranked Below for First Item (${firstItem.text}): ${rankedBelow[first]
      .map((id) => `${getText(id)} (${id})`)
      .join(", ")}\n` +
    `Ranked Below for Second Item (${secondItem.text}): ${rankedBelow[second]
      .map((id) => `${getText(id)} (${id})`)
      .join(", ")}`
  );

  return (
    <PageView content={ // We wrap the content in a PageView component to make it look nice.
      <ThemedView style={styles.container}>
        {/* Title */}
        <ThemedText style={styles.heading}>Let's pick!</ThemedText>

        {/* Show the two items to compare in a row */}
        <ThemedView style={pairwiseRankerStyles.rowContainer}>
          {/* Left item */}
          <ThemedView style={pairwiseRankerStyles.leftContainer}>
            <ThemedView style={styles.buttonStyle}>
              <AutoSizedButton title={firstItem.text} onPress={() => handleChoice(first)} />
            </ThemedView>
          </ThemedView>

          {/* Versus text */}
          <ThemedView style={pairwiseRankerStyles.centerContainer}>
            <ThemedText style={pairwiseRankerStyles.vsText}>VS</ThemedText>
          </ThemedView>

          {/* Right item */}
          <ThemedView style={pairwiseRankerStyles.rightContainer}>
            <ThemedView style={styles.buttonStyle}>
              <AutoSizedButton title={secondItem.text} onPress={() => handleChoice(second)} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Progress bar */}
        <ThemedView style={{ marginTop: 16, alignSelf: "stretch" }}>
          {/* Outer bar (background) */}
          <ThemedView
            style={{
              backgroundColor: "#ccc",
              height: 8,
              borderRadius: 4,
            }}
          >
            {/* Inner bar (progress) */}
            <ThemedView
              style={{
                backgroundColor: "#007AFF",
                width: `${progressPercent}%`,
                height: "100%",
                borderRadius: 4,
              }}
            />
          </ThemedView>

          {/* Progress text */}
          <ThemedText style={{ textAlign: "center", marginTop: 6 }}>
            {progressPercent}% Complete
          </ThemedText>
        </ThemedView>
      </ThemedView>
    } bottomContent={ // The bottom of the screen will show the "Restart" button
      <ThemedView style={{ bottom: 100, alignSelf: 'center', justifyContent: 'center' }}>
        <Button title="Restart" onPress={handleRestart} />
      </ThemedView>
    } infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
  );
};

export default RankingPage;

const pairwiseRankerStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  centerContainer: {
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
    marginHorizontal: 8,
  },
});