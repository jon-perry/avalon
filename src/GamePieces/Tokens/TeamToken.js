import React, { useEffect, useState } from 'react';


export default function TeamToken() {
    const source = require('../../pictures/tokens/team-token.png');
    const [style, setStyle] = useState({width: '120px'});
    
    return (
        <img id="one" className="team-token-img" alt="" src={source} style={style} />
    );

}
