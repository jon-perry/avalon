import React from 'react';

const success = require("../../../pictures/vote/success.jpg");
const back = require("../../../pictures/vote/success-fail-back.jpg");

export default function ({selected, orientation, onClick}) {

    return (
        <img 
            className={"success-img" + (selected ? ' selected' : '')}
            alt="success-img" 
            src={orientation === 'front' ? success : back}
            onClick={onClick}
        />
    )
}