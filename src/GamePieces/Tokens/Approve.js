import React from 'react';


export function Approve({ orientation, onClick, selected }) {
    const front = require('../../pictures/tokens/approve(level-balance).png');
    const back = require('../../pictures/tokens/approve-reject-back(level-balance).png');

    return (
        <img className={"approve-img" + (selected ? ' selected' : '')} alt="approve-img" src={orientation === 'front' ? front : back} onClick={onClick} />
    );

}

export default Approve;