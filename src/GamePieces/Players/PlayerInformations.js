import React, { useState } from 'react';
import Player from './Player';
import './PlayerInformations.scss';

export default function PlayerInformation({ players, active, numQuestParticipants }) {
    const character = require('../../pictures/characters/loyalty-back.jpg');
    const [selectedPlayers, setSelectedPlayers] = useState([]);


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
        console.log('Confirmed')
        // keep track of selected players for history of this quest phase possibly
        // io.sendMessage ('questConfirm', {message});
    }

    return (
        <div className="player-informations" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
            {players.map((player, characterCard) => (
                <Player
                    key={characterCard}
                    playerName={player.playerName}
                    cardImage={character}
                    onClick={active ? () => handlePlayerClick(player.playerName) : undefined}
                    selected={selectedPlayers.includes(player.playerName)}
                />
            ))}
            {selectedPlayers.length === numQuestParticipants && <button onClick={handleConfirmClick} className="confirm-quest-players">Confirm</button>}
        </div>
    );
}