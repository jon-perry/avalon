import React, { useState, useEffect, useContext } from 'react';
import Player from './Player';
import './PlayerInformations.scss';
import ApproveReject from '../GameBoard/Votes/ApproveReject';
import { SocketContext } from '../../App';
const CLIENT_ACTION = require('../../AppConstants');

export default function PlayerInformation({ players, active, numQuestParticipants }) {
    const socket = useContext(SocketContext);
    const character = require('../../pictures/characters/loyalty-back.jpg');
    const [selectedPlayers, showVotePhase, setShowVotePhase, handlePlayerClick, handleConfirmClick] = useCustomState(socket);


    // If activePlayer -> Presentation must change to allow for clicking

    return (
        showVotePhase ? <ApproveReject setShowVotePhase={setShowVotePhase} /> :
            <div className="player-informations" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
                {players.map((player, index) => (
                    <Player
                        key={index}
                        playerName={player.playerName}
                        cardImage={player.cardImage}
                        onClick={active ? () => handlePlayerClick(player.playerName) : undefined}
                        selected={selectedPlayers.includes(player.playerName)}
                    />
                ))}
                {selectedPlayers.length === numQuestParticipants && active &&
                    (<button onClick={handleConfirmClick} className="confirm-quest-players">Confirm</button>)}
            </div>
    );
}


const useCustomState = (socket) => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showVotePhase, setShowVotePhase] = useState(false);

    useEffect(() => {
        const handlePlayerChoices = (msg) => setSelectedPlayers(msg);
        socket.on(CLIENT_ACTION.PLAYER_SELECT, handlePlayerChoices);
        return () => socket.removeListener(CLIENT_ACTION.CONFIRM_SELECTED_PLAYERS, handlePlayerChoices);
    }, []);

    useEffect(() => {
        const handleConfirm = (msg) => {
            setShowVotePhase(msg)
            setSelectedPlayers([]);
        };
        socket.on('showVotePhase', handleConfirm);

        return () => socket.removeListener('showVotePhase', handleConfirm);
    }, [])

    const handlePlayerClick = (name) => {
        let nextState = selectedPlayers.slice();
        if (!selectedPlayers.includes(name)) {
            nextState.push(name);
            setSelectedPlayers(nextState);
        } else {
            nextState = nextState.filter((currentName) => currentName !== name);
            setSelectedPlayers(nextState);
        }
        socket.emit(CLIENT_ACTION.PLAYER_SELECT, nextState);
    }

    const handleConfirmClick = () => {
        setSelectedPlayers([]);
        socket.emit(CLIENT_ACTION.CONFIRM_SELECTED_PLAYERS, true);
    }

    return [selectedPlayers, showVotePhase, setShowVotePhase, handlePlayerClick, handleConfirmClick];
};