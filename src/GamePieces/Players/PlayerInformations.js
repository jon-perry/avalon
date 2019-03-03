import React, { useState, useEffect } from 'react';
import Player from './Player';
import './PlayerInformations.scss';
import ApproveReject from '../GameBoard/Votes/ApproveReject';

export default function PlayerInformation({ socket, players, active, numQuestParticipants }) {
    const character = require('../../pictures/characters/loyalty-back.jpg');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showVotePhase, setShowVotePhase] = useState(false);


    // If activePlayer -> Presentation must change to allow for clicking

    useEffect(() => {
        const handlePlayerChoices = (message) => setSelectedPlayers(message.selectedPlayers);
        socket.on('playerChoices', handlePlayerChoices);
        return () => socket.removeListener('playerChoices', handlePlayerChoices);
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
        socket.emit('playerChoice', nextState);
    }

    const handleConfirmClick = () => {
        setSelectedPlayers([]);
        socket.emit('confirmPlayerChoices', undefined);
    }

    return (
        true ? <ApproveReject socket={socket} setShowVotePhase={setShowVotePhase} /> :
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