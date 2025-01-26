import React, { useState } from "react";
import {
  View,
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
import { PageView } from "./PageView";

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
    <PageView content={
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
    } bottomContent= {
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