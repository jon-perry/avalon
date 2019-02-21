import React, { Component } from 'react';


class TeamToken extends Component {
    render() {
        const source = require('../../pictures/tokens/team-token.png');
        
        return (
            <img className="team-token-img" alt="" src={source}/>
        );
    }
}

export default TeamToken;