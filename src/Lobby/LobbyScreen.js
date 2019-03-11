import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../App';
import Lobby from './Lobby';
const CLIENT_ACTION = require('../AppConstants');

function LobbyScreen() {
    const [lobbies, setLobbies] = useState(undefined);

    const socket = useContext(SocketContext);
    useEffect(() => {
        const handleSetLobbies = (lobbiesResponse) => {
            setLobbies(lobbiesResponse);
        };
        if (!lobbies) {
            socket.emit(CLIENT_ACTION.GET_LOBBIES, undefined);
        }
        socket.on(CLIENT_ACTION.SET_LOBBIES, handleSetLobbies);
        return () => socket.removeListener(CLIENT_ACTION.SET_LOBBIES, handleSetLobbies);
    }, [lobbies]);

    return (
        <div className="lobbies">
            {
                lobbies ? (
                    <>
                        <h1>Lobbies</h1>
                        {
                            lobbies.map((lobby) => (<Lobby key={lobby.id} activeLobbyId={lobby.id} {...lobby} />))
                        }
                    </>
                ) : (<div className="loading">...</div>)
            }
        </div>
    )

}

export default LobbyScreen;