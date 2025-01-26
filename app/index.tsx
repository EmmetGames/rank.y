import React, { useState, useEffect } from "react";
import RankingPage from "@/components/RankingPage";
import InputPage from "@/components/InputPage";

// The main App component that will be rendered by the app.
export default function App() {
  const [items, setItems] = useState(null); // Stores the items that we're ranking
  const [infoVisible, setInfoVisible] = useState(false); // Whether the info modal is visible

  const handleStartRanking = (items) => {
    setItems(items);
  };

  const handleRestart = () => {
    setItems(null);
  };

  // If items have been set, render the RankingPage component. Otherwise, render the InputPage component.
  if (items) {
    return (
      <RankingPage items={items} onRestart={handleRestart} infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
    )
  }
  else {
    return (
      <InputPage onStartRanking={handleStartRanking} infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
    )
  }
}