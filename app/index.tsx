import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  useColorScheme,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ListedItem } from '@/components/ListedItem';

export default function App() {
  const [items, setItems] = useState(null);

  const handleStartRanking = (items) => {
    setItems(items);
  };

  const handleRestart = () => {
    setItems(null);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rank.y</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {items ? (
            <PairwiseRanker items={items} onRestart={handleRestart} />
          ) : (
            <InputPage onStartRanking={handleStartRanking} />
          )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

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


const InputPage = ({ onStartRanking }) => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const colorScheme = useColorScheme();

  function addItem() {
    if (inputValue.trim()) {
      const newItem = { id: Date.now(), text: inputValue.trim() };
      setItems([...items, newItem]);
      setInputValue("");
    } else {
      Alert.alert("Error", "Item cannot be empty.");
    }
  };

  function deleteItem(id) {
    console.log('Deleting item: ', id);
    setItems(items.filter(item => item.id !== id));
  }

  const handleStart = () => {
    if (items.length < 2) {
      Alert.alert("Error", "Please add at least two items to rank.");
      return;
    }
    onStartRanking(items);
  };

  return (
      <View style={styles.container}>

      <View style={styles.tasksWrapper}>
        <ThemedText style={styles.sectionTitle}>Enter items to rank</ThemedText>
        <View style={styles.items}>
          {items.map(item => (
            <ListedItem
              key={item.id}
              item={item}
              deleteItem={() => deleteItem(item.id)}
            />
          ))}
        </View>
      </View>


        <TouchableOpacity onPress={handleStart}>
          <ThemedView style={styles.addWrapper}>
            <ThemedText>Begin Ranking</ThemedText>
          </ThemedView>
        </TouchableOpacity>
        <ThemedView style={styles.addWrapper}>
            <ThemedText>Begin Ranking</ThemedText>
          </ThemedView>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <ThemedTextInput style={styles.input} placeholder={'New Item'} value={inputValue} onChangeText={setInputValue} />
        <TouchableOpacity onPress={addItem}>
          <ThemedView style={styles.addWrapper}>
            <ThemedText>+</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
};


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  vs: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    width: "100%",
    marginTop: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  itemText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  vs: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  item: {
    fontSize: 18,
    marginVertical: 4,
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 60,
    borderWidth: 1,
    width: 250,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  addWrapper: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
});