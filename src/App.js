import React, { useState } from 'react';
import GameScreen from './GameScreen';
import './App.css';

export default function App(props) {
  const [playerCount, setPlayerCount] = useState(5);
  const [clientIsQuestLeader, setClientIsQuestLeader] = useState(true);

  const incrementPlayerCount = () => {
    setPlayerCount((((playerCount + 1) % 11) < 5 ? 5 : ((playerCount + 1) % 11)));
  }
  return (
    <div className="App">
      <button onClick={() => setClientIsQuestLeader(!clientIsQuestLeader)}>isQuestLeader</button>
      <button onClick={() => incrementPlayerCount()}>Increase Player Count</button>
      {/* makes it so the player count is 5-10 inclusive for testing */}
      {/* <button onClick={() => incrementPlayerCount()}>Increase Player Countssss</button> */}
      <GameScreen playerCount={playerCount} clientIsQuestLeader={clientIsQuestLeader} setPlayerCount={setPlayerCount}/>
    </div>
  );
}
