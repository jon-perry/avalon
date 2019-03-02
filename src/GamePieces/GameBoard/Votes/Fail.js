import React from 'react';

const success = require("../../../pictures/vote/fail.jpg");
const back = require("../../../pictures/vote/success-fail-back.jpg");

export default function (props) {

    return (
        <img 
            className={"fail-img" + (props.selected ? ' selected' : '')}
            alt="fail-img" 
            src={props.orientation === 'front' ? success : back}
        />
    )
}