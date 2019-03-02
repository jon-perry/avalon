import React, { useState } from 'react';
import Player from './Player';
import './PlayerInformations.scss';
import ApproveReject from '../GameBoard/Votes/ApproveReject';

export default function PlayerInformation({ players, active, numQuestParticipants }) {
    const character = require('../../pictures/characters/loyalty-back.jpg');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showVotePhase, setShowVotePhase] = useState(false);


    // If activePlayer -> Presentation must change to allow for clicking

    // useEffect(() => {
    //     io.on('messageType', (theMessage) => {
    //         setSelectedPlayers(theMessage.selectedPlayers)
    //     })
    //     io.on('questConfirm'), (theMessage) => { 
    //     }
    // });

    const handlePlayerClick = (name) => {
        const nextState = selectedPlayers.slice();
        if (!selectedPlayers.includes(name)) {
            nextState.push(name);
            setSelectedPlayers(nextState);
        } else {
            setSelectedPlayers(nextState.filter((currentName) => currentName !== name))
        }
        // io.sendMessage('messageType', {theMessage})
    }

    const handleConfirmClick = () => {
        setSelectedPlayers([]);
        setShowVotePhase(true);
        // keep track of selected players for history of this quest phase possibly
        // io.sendMessage ('questConfirm', {message});
    }

    return (
        showVotePhase ? <ApproveReject setShowVotePhase={setShowVotePhase}/> :
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