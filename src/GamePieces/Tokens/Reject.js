import React, { Component } from 'react';


class Reject extends Component {
    render() {
        const front = require('../../pictures/tokens/reject(level-balance).png');
        const back = require('../../pictures/tokens/approve-reject-back(level-balance).png');

        return (
            <img className="reject-img" alt="" src={this.props.orientation ? front : back}/>
        );
    }
}

export default Reject;