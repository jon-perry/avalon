import React from 'react';


export default function Reject({ orientation, onClick, selected }) {
    const front = require('../../pictures/tokens/reject(level-balance).png');
    const back = require('../../pictures/tokens/approve-reject-back(level-balance).png');

    return (
        <img className={"reject-img" + (selected ? ' selected' : '')} alt="reject-img" src={orientation === 'front' ? front : back} onClick={onClick} />
    );
}
