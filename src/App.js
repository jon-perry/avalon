import React, { useState, useEffect } from 'react';
import GameScreen from './GameScreen';
import LobbyScreen from './Lobby/LobbyScreen';
import LoginForm from './Lobby/LoginForm';
import CookieService from './Util/CookieService';
import './App.css';
import './GamePieces/GameBoard/Votes/ApproveReject';
import SuccessFailResults from './GamePieces/GameBoard/Votes/SuccessFailResults';
const CLIENT_ACTION = require('./AppConstants');

export const SocketContext = React.createContext(null);

const ResetButton = ({onClick}) => (
  <div className="reset-button">
    <button onClick={onClick}>Reset</button>
  </div>
)

const io = require('socket.io-client');
const socket = io.connect('alexteno.homeip.net:8888');
console.log(socket.connected)
export default function App() {
  const loggedIn = useLoggedIn();
  const game = useGame();

  const handleReset = () => {
    socket.emit('RESET', {});
  }

  return (
    <SocketContext.Provider value={socket}>
      <ResetButton onClick={handleReset}/>
      <div className="App">
        {game ? (<GameScreen game={game} />) : !loggedIn ? (<LoginForm loggedIn={loggedIn} />) : (<LobbyScreen />)}
      </div>
      {/* <SuccessFailResults results={['success','fail', 'success']}/> */}
    </SocketContext.Provider>
  );

}

const useLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState();

  useEffect(() => {
    /* Setup */
    const handleLoggedIn = (player) => {
      const loggedIn = !!player;
      if (loggedIn) {
        CookieService.SetPlayer(player);
      }
      setLoggedIn(loggedIn);
    };
    socket.on(CLIENT_ACTION.LOGGED_IN, handleLoggedIn);

    /* Check for existing login */
    const player = CookieService.GetPlayer();
    if (!loggedIn) {
      socket.emit(CLIENT_ACTION.CHECK_LOGGED_IN, { uuid: player.id });
    }

    return () => socket.removeListener(CLIENT_ACTION.LOGGED_IN, handleLoggedIn);
  }, [loggedIn]);

  return loggedIn;
}

const useGame = () => {
  const [game, setGame] = useState(undefined);

  useEffect(() => {
    /* Setup */
    const handleSetGame = (gameResponse) => {
      setGame(gameResponse);
    }

    /* Check for existing game */
    const player = CookieService.GetPlayer();
    if (!game) {
      socket.emit(CLIENT_ACTION.GET_GAME, { playerId: player.id })
    }

    socket.on(CLIENT_ACTION.SET_GAME, handleSetGame);
    return () => socket.removeListener(CLIENT_ACTION.SET_GAME, handleSetGame);

  }, [game]);
  return game;
}