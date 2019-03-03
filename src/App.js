import React, { useState, useEffect } from 'react';
import GameScreen from './GameScreen';
import './App.css';
import LoginScreen from './Login/LoginScreen'
const io = require('socket.io-client');
const socket = io.connect('localhost:8888');

export default function App(props) {
  const [playerCount, setPlayerCount] = useState(5);
  const [loggedIn, setLoggedIn] = useState(false);
  const [clientIsQuestLeader, setClientIsQuestLeader] = useState(true);

  const incrementPlayerCount = () => {
    /* makes it so the player count is 5-10 inclusive for testing */
    setPlayerCount((((playerCount + 1) % 11) < 5 ? 5 : ((playerCount + 1) % 11)));
  }


  useEffect(() => {
    const handle = msg => setLoggedIn(true);
    socket.on('loggedIn', handle);

    return () => socket.removeEventListener('loggedIn', handle);
  }, [loggedIn]);

  return (
    <div className="App">
      <button onClick={() => setClientIsQuestLeader(!clientIsQuestLeader)}>isQuestLeader</button>
      <button onClick={() => incrementPlayerCount()}>Increase Player Count</button>
      {true ? <GameScreen socket={socket} playerCount={playerCount} clientIsQuestLeader={clientIsQuestLeader} setPlayerCount={setPlayerCount} /> : <LoginScreen socket={socket} />}
    </div>
  );
}
