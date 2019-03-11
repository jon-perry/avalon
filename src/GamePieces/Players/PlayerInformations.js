import React, { useState, useEffect, useContext } from 'react';
import Player from './Player';
import './PlayerInformations.scss';
import ApproveReject from '../GameBoard/Votes/ApproveReject';
import { SocketContext } from '../../App';
const APP_CONSTANTS = require('../../AppConstants');

export default function PlayerInformation({ gamePhase, players, active, numQuestParticipants }) {
    const socket = useContext(SocketContext);
    const [selectedPlayers, handlePlayerClick, handleConfirmClick] = useSelectedPlayers(socket);

    return (
        gamePhase === APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_APPROVAL ?
            (<ApproveReject />) :
            (<div className="player-informations" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
                {players.map((player) => (
                    <Player
                        key={player.id}
                        {...player}
                        onClick={active ? () => handlePlayerClick(player.name) : undefined}
                        selected={selectedPlayers.includes(player.name)}
                    />
                ))}
                {selectedPlayers.length === numQuestParticipants && active &&
                    (<button onClick={handleConfirmClick} className="confirm-quest-players">Confirm</button>)}
            </div>)
    );
}


const useSelectedPlayers = (socket) => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    /* Sync Selected Players */
    useEffect(() => {
        const handlePlayerChoices = (selectedPlayersResponse) => setSelectedPlayers(selectedPlayersResponse);
        socket.on(APP_CONSTANTS.PLAYER_SELECT, handlePlayerChoices);
        return () => socket.removeListener(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, handlePlayerChoices);
    });

    const handlePlayerClick = (name) => {
        let nextState = selectedPlayers.slice();
        if (!selectedPlayers.includes(name)) {
            nextState.push(name);
            setSelectedPlayers(nextState);
        } else {
            nextState = nextState.filter((currentName) => currentName !== name);
            setSelectedPlayers(nextState);
        }
        socket.emit(APP_CONSTANTS.PLAYER_SELECT, { selectedPlayers: nextState });
    }

    const handleConfirmClick = () => {
        socket.emit(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, { selectedPlayers });
    }

    return [selectedPlayers, handlePlayerClick, handleConfirmClick];
};