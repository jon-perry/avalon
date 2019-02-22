import React, { useEffect, useState } from 'react';
import GameScreen from './GameScreen';
import './App.css';

export default function App(props) {
  const [playerCount, setPlayerCount] = useState(5);
    
  return (
    <div className="App">
      <GameScreen playerCount={playerCount}/>
    </div>
  );
}