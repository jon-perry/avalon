import React, { useContext, useState } from 'react';
import { SocketContext } from '../App';
import './Lobby.scss';
import CookieService from '../Util/CookieService';
const CLIENT_ACTION = require('../AppConstants');

export default function ({ id, players, leader }) {

    const socket = useContext(SocketContext);
    const [isChecked, setIsChecked] = useState(false);

    const handleOnClick = () => {
        socket.emit(CLIENT_ACTION.JOIN_LOBBY, { id });
    };

    const handleCheckChange = (event) => {
        const isChecked = event.target.checked;
        setIsChecked(isChecked);
        socket.emit(CLIENT_ACTION.IS_READY_CHANGE, { id, ready: isChecked });
    };

    const activePlayer = CookieService.GetPlayer();
    const activeLobby = players.some((lobbyPlayer) => activePlayer.id === lobbyPlayer.id);

    const isLeader = activePlayer.id === (leader ? leader.id : undefined);

    const handleGameStart = () => {
        socket.emit(CLIENT_ACTION.GAME_START, { id });
    };

    return (
        <div className="lobby">
            <h2>Players</h2>
            {
                players.map((player) => {

                    return (
                        <div className="player" key={player.id}>
                            {(player.id === leader.id) && (<span className="lobby-leader">♔</span>)}
                            <span className="player-name">{player.name}</span>
                            {
                                activePlayer.id === player.id ?
                                    (
                                        <label htmlFor="isReady">Ready:
                                            <input className="readiness" type="checkbox" id="isReady" name="isReady" value={isChecked} onChange={handleCheckChange} />
                                        </label>
                                    ) :
                                    (
                                        <label htmlFor={`${player.name}IsReady`}>Ready:
                                            <input className="readiness" type="checkbox" name={`${player.name}IsReady`} checked={player.ready} disabled={true} />
                                        </label>
                                    )
                            }
                        </div>
                    )
                })
            }
            <div className="lobby-controls">
                {!activeLobby && (<button className="join-lobby" onClick={handleOnClick}>Join Lobby</button>)}
                {isLeader && (<button onClick={() => handleGameStart()} disabled={!players.every((player) => player.ready)}>Start</button>)}
            </div>
        </div>
    )
}
