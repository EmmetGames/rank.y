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

// Component holding the main layout of a page in this app.
export function PageView({ content, infoVisible, setInfoVisible, topContent = null, bottomContent = null }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      { // If there is top content, render it
        topContent
      }

      {/* Info button that when pressed shows app info */}
      <ThemedView style={styles.infoButtonWrapper}>
        <InfoButton onPress={() => setInfoVisible(true)} />
      </ThemedView>

      <ThemedView style={{ flex: 1 }}>
        {/* Parallax scroll view that holds the content of the page. Looks nice & has a little image behind it. */}
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
          headerImage={
            <Image
              source={require('@/assets/images/leaderboardsComplex.png')}
              style={styles.reactLogo}
            />
          }>

          {/* Title of the app */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Rank.y</ThemedText>
          </ThemedView>
          
          {/* Info modal that shows app info when button is pressed*/}
          <InfoModal
            visible={infoVisible}
            onClose={() => setInfoVisible(false)}
          />

          <ThemedView style={styles.stepContainer}>
            {
              // Render the content of the page
              content
            }
          </ThemedView>
        </ParallaxScrollView>
      </ThemedView>
      {
        // If there is bottom content, render it
        bottomContent
      }
    </SafeAreaView>
  );
}