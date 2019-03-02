import React, { useState } from 'react';
import GameScreen from './GameScreen';
import './App.css';

export default function App(props) {
  const [playerCount, setPlayerCount] = useState(5);
  const [clientIsQuestLeader, setClientIsQuestLeader] = useState(true);
  const io = require('socket.io-client');
  const socket = io.connect('localhost:8888');
  const incrementPlayerCount = () => {
                    /* makes it so the player count is 5-10 inclusive for testing */
    setPlayerCount((((playerCount + 1) % 11) < 5 ? 5 : ((playerCount + 1) % 11)));
  }

  return (
    <div className="App">
      <button onClick={() => setClientIsQuestLeader(!clientIsQuestLeader)}>isQuestLeader</button>
      <button onClick={() => incrementPlayerCount()}>Increase Player Count</button>
      <GameScreen socket={socket} playerCount={playerCount} clientIsQuestLeader={clientIsQuestLeader} setPlayerCount={setPlayerCount}/>
    </div>
  );
}
