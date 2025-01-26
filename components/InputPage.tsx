import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
  Image,
  SafeAreaView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { ListedItem } from "@/components/ListedItem";
import { PlusButton } from '@/components/PlusButton';
import styles from "@/styles";
import { betterAlert } from "@/utils/BetterAlert";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import InfoModal from "./InfoModal";
import InfoButton from "./InfoButton";

const InputPage = ({ onStartRanking, infoVisible, setInfoVisible }) => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim()) {
      const newItem = { id: Date.now(), text: inputValue.trim() };
      setItems([...items, newItem]);
      setInputValue("");
    } else {
      betterAlert({title: "Error", message: "Item cannot be empty."});
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleDeleteItem = (item) => {
    betterAlert({title: "Delete Item", message: "Are you sure you want to delete the item '" + item.text + "'?", onConfirm: () => deleteItem(item.id)});
  };

  const handleStart = () => {
    if (items.length < 2) {
      betterAlert({title: "Error", message: "Please add at least two items to rank."});
      return;
    }
    onStartRanking(items);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Info Button at the top-left */}
      <ThemedView style={styles.infoButtonWrapper}>
        <InfoButton onPress={() => setInfoVisible(true)} />
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/leaderboardsComplex.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rank.y</ThemedText>
      </ThemedView>

      <InfoModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
      />

      <ThemedView style={styles.stepContainer}>
      <View style={styles.container}>
      <View>
        <ThemedText style={styles.sectionTitle}>Enter items to rank</ThemedText>
        <View style={styles.items}>
          {items.map((item) => (
            <ListedItem
              key={item.id}
              item={item}
              deleteItem={() => handleDeleteItem(item)}
            />
          ))}
        </View>
      </View>
      <View>
        {items.length >= 2 ? (
          <Button title="Begin ranking" onPress={handleStart} />
        ) : (null)}
      </View>
    </View>
      </ThemedView>
    </ParallaxScrollView>
    </ThemedView>
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <ThemedTextInput
          style={styles.input}
          placeholder="New Item"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <PlusButton addItem={addItem} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InputPage;