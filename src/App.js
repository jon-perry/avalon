import React, { useState, useEffect } from 'react';
import GameScreen from './GameScreen';
import './App.css';
import LoginScreen from './Login/LoginScreen'

export const SocketContext = React.createContext(null);

const io = require('socket.io-client');
const socket = io.connect('localhost:8888');

function WaitingForPlayers(props) {
  return (
    <div>Waiting for all players to connect</div>
  );
};

export default function App(props) {
  const gameStarted = useGameStarted(true);
  const loggedIn = useLoggedIn(false);
  const players = useServerGivenPlayers();
  const [playerCount, setPlayerCount] = useState(5);
  const [clientIsQuestLeader, setClientIsQuestLeader] = useState(true);

  const incrementPlayerCount = () => {
    /* makes it so the player count is 5-10 inclusive for testing */
    setPlayerCount((((playerCount + 1) % 11) < 5 ? 5 : ((playerCount + 1) % 11)));
  }





  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <button onClick={() => setClientIsQuestLeader(!clientIsQuestLeader)}>isQuestLeader</button>
        <button onClick={() => incrementPlayerCount()}>Increase Player Count</button>
        {loggedIn ?
          gameStarted ? <GameScreen players={players} playerCount={playerCount} clientIsQuestLeader={clientIsQuestLeader} setPlayerCount={setPlayerCount} /> : <WaitingForPlayers />
          : <LoginScreen />}
      </div>
    </SocketContext.Provider>
  );
}



const useGameStarted = (initial) => {
  const [gameStarted, setGameStarted] = useState(initial);

  const handle = msg => setGameStarted(msg);
  useEffect(() => {
    socket.on('gameStarted', handle);

    return () => socket.removeListener('gameStarted', handle);
  });

  return gameStarted;
};

const useLoggedIn = (initial) => {

  const [loggedIn, setLoggedIn] = useState(initial);

  useEffect(() => {
    const handle = msg => setLoggedIn(msg);
    socket.on('loggedIn', handle);

    return () => socket.removeEventListener('loggedIn', handle);
  });

  return loggedIn;
};

const useServerGivenPlayers = (initial) => {
  const [players, setPlayers] = useState(initial);
  const createCharacter = (cardImage) => require(`./pictures/characters/${cardImage}.jpg`);


  useEffect(() => {
    const handle = (players) => {
      const tmpPlayers = players.map((player) => {
        return { playerName: player.name, cardImage: createCharacter(player.cardImage), vote: 'approve' };
      });
      //tmpPlayers.push({playerName: players[0].name, cardImage: createCharacter(players[0].character), vote: 'approve'})
      console.log(tmpPlayers)
      setPlayers(tmpPlayers);
    };

    socket.on('gamePlayers', handle);

    return () => socket.removeListener('gamePlayers', handle);
  });

  return players;
};