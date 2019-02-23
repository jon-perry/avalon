import React, { useEffect } from 'react';
import Player from './Player';
import './PlayerInformations.scss';

export default function PlayerInformation(props) {
    const players = props.players;
    const character = require('../../pictures/characters/loyalty-back.jpg');
    
    // set up event listener here to listen for clicks
    function handleClick(event) {
        console.log(event.target);
        console.log(event.target.id);
    }
    useEffect(()=> {
        const playerInformations = document.getElementsByClassName('player-informations')[0];
        playerInformations.addEventListener('mousedown', handleClick);
        console.log(props.players.length)


        return () => playerInformations.removeEventListener('mousedown', handleClick);
    }); 

    return (
        <div className="player-informations" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
            {players.map((player, characterCard) =>
                (<Player key={characterCard} playerName={player.playerName} cardImage={character} />)
            )}
        </div>
    );
}