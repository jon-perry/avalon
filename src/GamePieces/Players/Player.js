import React from 'react';

const CardImage = ({ character, alignment }) => {
    if (character) {
        const src = require(`../../pictures/characters/${character}.jpg`);
        return (<img src={src} alt="character-card" title={character} />)
    } else if (alignment) {
        const src = require(`../../pictures/characters/loyalty-back.jpg`);
        return (<img src={src} alt="character-card" className={alignment} />)
    } else {
        const src = require(`../../pictures/characters/loyalty-back.jpg`);
        return (<img src={src} alt="character-card" />)
    }
};

export default function Player({ name, character, alignment, selected, onClick }) {

    return (
        <div className={"player" + (selected ? ' selected' : '')} onClick={onClick}>
            <div className="name">{name}</div>
            <div className="card-image">
                <CardImage character={character} alignment={alignment} />
            </div>
        </div>
    )
} 