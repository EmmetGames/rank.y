import React, { useState, useEffect } from "react";
import {
  Image,
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

export default function App() {
  const [items, setItems] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

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
  );
}

const localStyles = StyleSheet.create({
  infoButtonWrapper: {
    position: "absolute",
    top: 40,    // adjust as needed based on your header or safe area
    left: 10,
    zIndex: 999,  // ensure the button is on top
  },
});