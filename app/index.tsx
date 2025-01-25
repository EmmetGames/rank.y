import React, { useState } from "react";
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
            {index + 1}. {item.text}
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
        <Button title={unranked[first].text} onPress={() => handleChoice(unranked[first])} />
        <ThemedText style={styles.vs}>VS</ThemedText>
        <Button title={unranked[second].text} onPress={() => handleChoice(unranked[second])} />
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
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <ThemedText style={styles.sectionTitle}>Enter items to rank</ThemedText>
        <View style={styles.items}>
          {items.map(item => (
            <ListedItem
              key={item.id}
              item={item}
              deleteItem={deleteItem}
            />
          ))}
        </View>
      </View>
        
      </ScrollView>

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
    bottom: 60,
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