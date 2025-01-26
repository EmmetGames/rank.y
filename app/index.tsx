import React, { useState, useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet
} from "react-native";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PairwiseRanker from "@/components/PairwiseRanker";
import InputPage from "@/components/InputPage";
import InfoButton from "@/components/InfoButton";
import styles from "@/styles";
import InfoModal from "@/components/InfoModal";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function App() {
  const [items, setItems] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleStartRanking = (items) => {
    setItems(items);
  };

  const handleRestart = () => {
    setItems(null);
  };

  if (items) {
    return (
      <PairwiseRanker items={items} onRestart={handleRestart} infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
    )
  }
  else {
    return (
      <InputPage onStartRanking={handleStartRanking} infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
    )
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
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

      {/* Info Button at the top-left */}
      <ThemedView style={localStyles.infoButtonWrapper}>
        <InfoButton onPress={() => setInfoVisible(true)} />
      </ThemedView>

      <InfoModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
      />

      <ThemedView style={styles.stepContainer}>
        {items ? (
            <PairwiseRanker items={items} onRestart={handleRestart} />
          ) : (
            <InputPage onStartRanking={handleStartRanking} />
          )}
      </ThemedView>
    </ParallaxScrollView>
    </ThemedView>
    {/* A fixed input row at the bottom, not overlapping the scroll view */}
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ThemedTextInput
          style={styles.input}
          placeholder="New Item"
          value={inputValue}
          onChangeText={setInputValue}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
 
});