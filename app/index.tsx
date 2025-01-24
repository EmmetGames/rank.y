import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Image,
  StyleSheet,
  Platform
} from "react-native";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';

import { Swipeable } from "react-native-gesture-handler";


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
      <View style={styles.stepContainer}>
        <ThemedText style={styles.heading}>Final Ranking</ThemedText>
        {ranked.map((item, index) => (
          <ThemedText key={index} style={styles.item}>
            {index + 1}. {item}
          </ThemedText>
        ))}
        <Button title="Restart" onPress={handleRestart} />
      </View>
    );
  }

  const [first, second] = currentPair;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>Pairwise Ranker</ThemedText>
      <View style={styles.buttonContainer}>
        <Button title={unranked[first]} onPress={() => handleChoice(unranked[first])} />
        <ThemedText style={styles.vs}>VS</ThemedText>
        <Button title={unranked[second]} onPress={() => handleChoice(unranked[second])} />
      </View>
      <Button title="Restart" onPress={handleRestart} />
    </View>
  );
};


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
        <ThemedText style={[
          styles.itemText,
          colorScheme === "dark" ? styles.darkText : styles.lightText
        ]}>{item}</ThemedText>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>Enter Items to Rank</ThemedText>
      <ThemedTextInput
        style={[
          styles.input
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    width: "80%",
    borderRadius: 5,
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
});