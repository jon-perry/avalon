import React from 'react';

const success = require("../../../pictures/vote/success.jpg");
const back = require("../../../pictures/vote/success-fail-back.jpg");

export default function ({selected, orientation, onClick, isGood}) {
    
    const classes = ['success-img']
    if (selected) {
        classes.push('selected');
    }
    if (isGood) {
        classes.push('good-guy')
    }

    return (
        <img 
            className={classes.join(' ')}
            alt="success-img" 
            src={orientation === 'front' ? success : back}
            onClick={onClick}
        />
    )
}