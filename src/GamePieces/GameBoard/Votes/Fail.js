import React from 'react';

const success = require("../../../pictures/vote/fail.jpg");
const back = require("../../../pictures/vote/success-fail-back.jpg");

export default function ({selected, orientation, onClick}) {
    return (
        <img 
            className={"fail-img" + (selected ? ' selected' : '')}
            alt="fail-img" 
            src={orientation === 'front' ? success : back}
            onClick={onClick}
        />
    )
}