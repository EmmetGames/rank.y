import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const InputPage = ({ onStartRanking }) => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const colorScheme = useColorScheme();

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    } else {
      Alert.alert("Error", "Item cannot be empty.");
    }
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    if (items.length < 2) {
      Alert.alert("Error", "Please add at least two items to rank.");
      return;
    }
    onStartRanking(items);
  };

  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.deleteButtonContainer}>
          <Button
            title="Delete"
            color="red"
            onPress={() => handleDeleteItem(index)}
          />
        </View>
      )}
    >
      <TouchableOpacity onPress={() => setInputValue(item)} style={styles.listItem}>
        <Text style={[
          styles.itemText,
          colorScheme === "dark" ? styles.darkText : styles.lightText
        ]}>{item}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Items to Rank</Text>
      <TextInput
        style={[
          styles.input,
          colorScheme === "dark" ? styles.darkInput : styles.lightInput
        ]}
        placeholder="Enter an item"
        placeholderTextColor={colorScheme === "dark" ? "#aaaaaa" : "#666666"}
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button title="Add Item" onPress={handleAddItem} />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <Button title="Start Ranking" onPress={handleStart} />
    </View>
  );
};

const PairwiseRanker = ({ items, onRestart }) => {
  const [currentPair, setCurrentPair] = useState([0, 1]);
  const [ranked, setRanked] = useState([]);
  const [unranked, setUnranked] = useState([...items]);

  const handleChoice = (choice) => {
    const [first, second] = currentPair;

    const newRanked = [...ranked, choice];
    setRanked(newRanked);

    const newUnranked = unranked.filter(
      (item) => item !== unranked[first] && item !== unranked[second]
    );
    setUnranked(newUnranked);

    if (newUnranked.length >= 2) {
      setCurrentPair([0, 1]);
    } else if (newUnranked.length === 1) {
      setRanked([...newRanked, ...newUnranked]);
      setUnranked([]);
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

  if (unranked.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Final Ranking</Text>
        {ranked.map((item, index) => (
          <Text key={index} style={styles.item}>
            {index + 1}. {item}
          </Text>
        ))}
        <Button title="Restart" onPress={handleRestart} />
      </View>
    );
  }

  const [first, second] = currentPair;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pairwise Ranker</Text>
      <View style={styles.buttonContainer}>
        <Button title={unranked[first]} onPress={() => handleChoice(unranked[first])} />
        <Text style={styles.vs}>VS</Text>
        <Button title={unranked[second]} onPress={() => handleChoice(unranked[second])} />
      </View>
      <Button title="Restart" onPress={handleRestart} />
    </View>
  );
};

export default function App() {
  const [items, setItems] = useState(null);
  const colorScheme = useColorScheme();

  const handleStartRanking = (items) => {
    setItems(items);
  };

  const handleRestart = () => {
    setItems(null);
  };

  return (
    <View style={[styles.container, colorScheme === "dark" ? styles.darkBackground : styles.lightBackground]}>
      {items ? (
        <PairwiseRanker items={items} onRestart={handleRestart} />
      ) : (
        <InputPage onStartRanking={handleStartRanking} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    width: "80%",
    borderRadius: 5,
  },
  lightInput: {
    borderColor: "gray",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  darkInput: {
    borderColor: "#666666",
    backgroundColor: "#333333",
    color: "#ffffff",
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
  lightText: {
    color: "#000000",
  },
  darkText: {
    color: "#ffffff",
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
  lightBackground: {
    backgroundColor: "#ffffff",
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
  },
});
