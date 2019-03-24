import React from 'react';

export default function GameOver({winner}) {
    const className = ['winner'];
    const alignment = (winner.includes('Evil') || winner.includes('Assassin')) ? 'evil' : 'good'; 
    className.push(alignment)
    return (
        <div className={className.join(' ')}>
            {winner}
        </div>
    )
}