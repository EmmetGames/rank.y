import React, { useState, useEffect } from "react";
import {
  Image
} from "react-native";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PairwiseRanker from "@/components/PairwiseRanker";
import InputPage from "@/components/InputPage";
import styles from "@/styles";

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