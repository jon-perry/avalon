import React, { useEffect, useState } from 'react';
import GameScreen from './GameScreen';
import './App.css';

export default function App(props) {
  const [playerCount, setPlayerCount] = useState(5);
  const [clientIsQuestLeader, setClientIsQuestLeader] = useState(false);
  return (
    <div className="App">
      <button onClick={() => setClientIsQuestLeader(!clientIsQuestLeader)}>isQuestLeader</button>
                                                          {/* makes it so the player count is 5-10 inclusive for testing */}
      <button onClick={() => setPlayerCount( ( ((playerCount + 1) % 11) < 5 ? 5 : ((playerCount + 1) % 11) ))}>Increase Player Count</button>
      <GameScreen playerCount={playerCount} clientIsQuestLeader={clientIsQuestLeader}/>
    </div>
  );
}
