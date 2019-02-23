import React, { Component } from 'react';


class Approve extends Component {
    render() {
        const front = require('../../pictures/tokens/approve(level-balance).png');
        const back = require('../../pictures/tokens/approve-reject-back(level-balance).png');
        
        return (
            <img className="approve-img" alt="" src={this.props.orientation === 'front' ? front : back}/>
        );
    }
}

export default Approve;