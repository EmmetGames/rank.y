import React, { useState } from "react";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { ListedItem } from "@/components/ListedItem";
import { PlusButton } from '@/components/PlusButton';
import styles from "@/styles";

const InputPage = ({ onStartRanking }) => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim()) {
      const newItem = { id: Date.now(), text: inputValue.trim() };
      setItems([...items, newItem]);
      setInputValue("");
    } else {
      Alert.alert("Error", "Item cannot be empty.");
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

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
          {items.map((item) => (
            <ListedItem
              key={item.id}
              item={item}
              deleteItem={() => deleteItem(item.id)}
            />
          ))}
        </View>
      </View>
      <Button title="Begin ranking" onPress={handleStart} />
      <Button title="Begin ranking" onPress={handleStart} />
      <Button title="Begin ranking" onPress={handleStart} />
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
    </View>
  );
};

export default InputPage;