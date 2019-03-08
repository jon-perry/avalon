import React, { useState, useEffect } from 'react';
import GameScreen from './GameScreen';
import './App.css';
import LoginScreen from './Login/LoginScreen';
const CLIENT_ACTION = require('./AppConstants');

export const SocketContext = React.createContext(null);

const io = require('socket.io-client');
const socket = io.connect('localhost:8888');

function WaitingForPlayers(props) {
  return (
    <div>Waiting for all players to connect</div>
  );
};
export default function App(props) {
  const gameStarted = useGameStarted(false);
  const loggedIn = useLoggedIn(false);
  const players = useServerGivenPlayers();
  const [playerCount, setPlayerCount] = useState(5);
  const clientIsQuestLeader= useClientIsQuestLeader();



  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        {loggedIn ?
          gameStarted ? <GameScreen players={players} playerCount={players.length} clientIsQuestLeader={clientIsQuestLeader} /> : <WaitingForPlayers />
          : <LoginScreen />}
      </div>
    </SocketContext.Provider>
  );
}



const useGameStarted = (initial) => {
  const [gameStarted, setGameStarted] = useState(initial);

  const gameStartedHandle = msg => setGameStarted(msg);

  useEffect(() => {
    socket.on(CLIENT_ACTION.GAME_STARTED, gameStartedHandle);

    return () => socket.removeListener(CLIENT_ACTION.GAME_STARTED, gameStartedHandle);
  });

  return gameStarted;
};

const useLoggedIn = (initial) => {

  const [loggedIn, setLoggedIn] = useState(initial);

  useEffect(() => {
    const handle = msg => setLoggedIn(msg);
    socket.on(CLIENT_ACTION.LOGGED_IN, handle);

    return () => socket.removeEventListener(CLIENT_ACTION.LOGGED_IN, handle);
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
      setPlayers(tmpPlayers);
    };

    socket.on(CLIENT_ACTION.GAME_PLAYERS, handle);

    return () => socket.removeListener(CLIENT_ACTION.GAME_PLAYERS, handle);
  });

  return players;
};

const useClientIsQuestLeader = () => {
  const [clientIsQuestLeader, setClientIsQuestLeader] = useState(false);

  const handleClientIsQuestLeader = isQuestLeader => {console.log(isQuestLeader); setClientIsQuestLeader(isQuestLeader);}
  useEffect(() => {
    socket.on(CLIENT_ACTION.IS_QUEST_LEADER, handleClientIsQuestLeader);

    return () => socket.removeListener(CLIENT_ACTION.IS_QUEST_LEADER, handleClientIsQuestLeader);
  });

  return clientIsQuestLeader
}
