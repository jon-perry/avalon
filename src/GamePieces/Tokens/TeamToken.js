import React, { useEffect, useState } from 'react';


export default function TeamToken() {
    const source = require('../../pictures/tokens/team-token.png');
    const [style, setStyle] = useState({width: '120px'});

    // useEffect(() => {
    //     const token = document.getElementById('one');

    //     function handleMouseClick(event) {
    //         if (event.button === 0) {
    //             console.log('it worked');
    //         } else if (event.button === 1) {
    //             setStyle({display: 'none'});
    //             console.log('hello');
    //         }
    //     }
    //     token.addEventListener('mousedown', handleMouseClick)
    //     return () => token.removeEventListener('mousedown', handleMouseClick)
    // })
    return (
        <img id="one" className="team-token-img" alt="" src={source} style={style} />
    );

}
