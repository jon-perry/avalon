import React, { } from 'react';

export default function Player({ playerName, cardImage, selected, onClick}) {

    return (
        <div className={"player" + (selected ? ' selected' : '')} onClick={onClick}>
            <div className="name">{playerName}</div>
            <div className="card-image" >
                <img src={cardImage} id={playerName} alt="character-card" />
            </div>
        </div>
    )
}