import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Button
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ListedItem } from "@/components/ListedItem";
import { PlusButton } from '@/components/PlusButton';
import styles from "@/styles";
import { betterAlert } from "@/utils/BetterAlert";
import { PageView } from "@/components/PageView";
import { ThemedView } from "@/components/ThemedView";

// Shows UI that the user can use to input items to rank.
// When the user has inputted at least two items, they can start ranking them by pressing the "Begin ranking" button.
const InputPage = ({ onStartRanking, infoVisible, setInfoVisible }) => {
  const [items, setItems] = useState([]); // Stores the items that we're ranking
  const [inputValue, setInputValue] = useState(""); // The value of the input field

  // Adds a new item to the list of items to rank, if the input is not empty.
  const addItem = () => {
    if (inputValue.trim()) {
      const newItem = { id: Date.now(), text: inputValue.trim() };
      setItems([...items, newItem]);
      setInputValue("");
    } else {
      betterAlert({title: "Error", message: "Item cannot be empty."});
    }
  };

  // Deletes an item from the list of items to rank.
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Prompts the user to confirm if they want to delete an item.
  const handleDeleteItem = (item) => {
    betterAlert({title: "Delete Item", message: "Are you sure you want to delete the item '" + item.text + "'?", onConfirm: () => deleteItem(item.id)});
  };

  // Starts the ranking process if there are at least two items to rank.
  const handleStart = () => {
    if (items.length < 2) {
      betterAlert({title: "Error", message: "Please add at least two items to rank."});
      return;
    }
    onStartRanking(items);
  };

  return (
    <PageView content={ // We wrap the content in a PageView component to make it look nice.
      <ThemedView style={styles.container}>
      <ThemedView>
        {/* Title */}
        <ThemedText style={styles.sectionTitle}>Enter items to rank</ThemedText>

        {/* For each item we display a ListedItem, which is UI that shows the item & allows it to be deleted. */}
        <ThemedView style={styles.items}>
          {items.map((item) => (
            <ListedItem
              key={item.id}
              item={item}
              deleteItem={() => handleDeleteItem(item)}
            />
          ))}
        </ThemedView>
      </ThemedView>

      {/* Shows begin ranking button only if there are 2 or more input items. */}
      <ThemedView>
        {items.length >= 2 ? (
          <Button title="Begin ranking" onPress={handleStart} />
        ) : (null)}
      </ThemedView>
    </ThemedView>
    } bottomContent= {
      /* Anchored to the bottom of the screen is the input textbox for new items. */
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <ThemedTextInput
          style={styles.input}
          placeholder="New Item"
          value={inputValue}
          onChangeText={setInputValue}
          onEnterPress={addItem}
        />
        <PlusButton addItem={addItem} />
      </KeyboardAvoidingView>
    } infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
  );
};

export default InputPage;