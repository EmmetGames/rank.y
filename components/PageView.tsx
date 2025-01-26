import React from "react";
import {
  Image,
  SafeAreaView,
} from "react-native";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import InfoButton from "@/components/InfoButton";
import styles from "@/styles";
import InfoModal from "@/components/InfoModal";

export function PageView({content, infoVisible, setInfoVisible, topContent = null, bottomContent = null}) {
    return (
    <SafeAreaView style={{ flex: 1 }}>
        {
            topContent
        }
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
        {
            content
        }
      </ThemedView>
    </ParallaxScrollView>
    </ThemedView>
    {
        bottomContent
    }
    </SafeAreaView>
    );
}