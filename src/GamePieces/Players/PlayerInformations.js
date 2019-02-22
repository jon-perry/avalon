import React from 'react';
import Player from './Player';
import './PlayerInformations.scss';

export default function PlayerInformation(props) {
    const players = props.players;
    const character = require('../../pictures/characters/loyalty-back.jpg');

    return (
        <div className="player-informations" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
            {players.map((player, characterCard) =>
                (<Player key={characterCard} playerName={player.playerName} cardImage={character} />)
            )}
        </div>
    );
}