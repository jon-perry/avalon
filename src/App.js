import React, { useState, useEffect } from 'react';
import GameScreen from './GameScreen';
import LobbyScreen from './Lobby/LobbyScreen';
import LoginForm from './Lobby/LoginForm';
import CookieService from './Util/CookieService';
import './App.scss';
import './GamePieces/GameBoard/Votes/ApproveReject';
const APP_CONSTANTS = require('./AppConstants');

export const SocketContext = React.createContext(null);

const ResetButton = ({ onClick }) => (
  <div className="reset-button">
    <button onClick={onClick}>Reset</button>
  </div>
)

const io = require('socket.io-client');
const socket = io.connect('192.0.208.246:8888');

export default function App() {
  const loggedIn = useLoggedIn();
  const game = useGame();
  const error = useError();
  const source = require('./pictures/game-boards/custom-variant.jpg')
  const style = {
    backgroundImage: `url(${source})`,
    backgroundSize: "cover"
  }

  const handleReset = () => {
    socket.emit('RESET', {});
  }

  return (
    <SocketContext.Provider value={socket}>
      <ResetButton onClick={handleReset} />
      <div className="App" style={style}>
        {game ? (<GameScreen game={game} />) : !loggedIn ? (<LoginForm loggedIn={loggedIn} error={error} />) : (<LobbyScreen />)}
      </div>
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
    socket.on(APP_CONSTANTS.LOGGED_IN, handleLoggedIn);

    /* Check for existing login */
    const player = CookieService.GetPlayer();
    if (!loggedIn) {
      socket.emit(APP_CONSTANTS.CHECK_LOGGED_IN, { uuid: player.id });
    }

    return () => socket.removeListener(APP_CONSTANTS.LOGGED_IN, handleLoggedIn);
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
      socket.emit(APP_CONSTANTS.GET_GAME, { playerId: player.id })
    }

    socket.on(APP_CONSTANTS.SET_GAME, handleSetGame);
    return () => socket.removeListener(APP_CONSTANTS.SET_GAME, handleSetGame);

  }, [game]);
  return game;
}

const useError = () => {
  const [error, setError] = useState('');


  useEffect(() => {
    const handleError = ({ error }) => {
      console.log('error received');
      console.log(error);
      setError(error);
    };

    socket.on(APP_CONSTANTS.ERROR, handleError);


    return () => socket.removeEventListener(APP_CONSTANTS.ERROR, handleError);
  }, [error])
  return error;
}