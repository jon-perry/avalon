import React, { useState, useEffect } from 'react';

export default function Player(props) {
    const {playerName, cardImage} = props;    

    return (
        <div className="player">
            <div className="name">{playerName}</div>
            <div className="card-image" >
                <img src={cardImage} id={playerName} alt="character-card"/>
            </div>
        </div>
    )
}