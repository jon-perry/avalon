import React from 'react';

const success = require("../../../pictures/vote/success.jpg");
const back = require("../../../pictures/vote/success-fail-back.jpg");

export default function (props) {

    return (
        <img 
            className={"success-img" + (props.selected ? ' selected' : '')}
            alt="success-img" 
            src={props.orientation === 'front' ? success : back}
        />
    )
}