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
                        onClick={active ? () => handlePlayerClick(player.name, player.id) : undefined}
                        selected={selectedPlayers.some((playerName) => player.name === playerName)}
                    />
                ))}
                {selectedPlayers.length === numQuestParticipants && active &&
                    /* TODO: Fix this possibly */
                    (<button onClick={() => handleConfirmClick(players[0].id)} className="confirm-quest-players">Confirm</button>)}
            </div>)
    );
}


const useSelectedPlayers = (socket) => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    /* Sync Selected Players */
    useEffect(() => {
        const handlePlayerChoices = ({ nextState }) => {
            setSelectedPlayers(nextState)
        };
        socket.on(APP_CONSTANTS.PLAYER_SELECT, handlePlayerChoices);
        return () => socket.removeListener(APP_CONSTANTS.PLAYER_SELECT, handlePlayerChoices);
    }, [selectedPlayers]);

    const handlePlayerClick = (selectedPlayerName, playerId) => {
        let nextState = selectedPlayers.slice();
        if (!selectedPlayers.some(name => name === selectedPlayerName)) {
            nextState.push(selectedPlayerName);
            setSelectedPlayers(nextState);
        } else {
            nextState = nextState.filter((currentPlayerName) => currentPlayerName !== selectedPlayerName);
            setSelectedPlayers(nextState);
        }
        socket.emit(APP_CONSTANTS.PLAYER_SELECT, { nextState, playerId });
    }

    const handleConfirmClick = (playerId) => {
        socket.emit(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, { playerId, selectedPlayers });
    }

    return [selectedPlayers, handlePlayerClick, handleConfirmClick];
};