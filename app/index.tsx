import React, { useState, useEffect } from "react";
import PairwiseRanker from "@/components/PairwiseRanker";
import InputPage from "@/components/InputPage";

export default function App() {
  const [items, setItems] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

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
}