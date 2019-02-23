import React, { Component } from 'react';
import './GameBoard.scss';
import Votes from './Votes/Votes.js';
import Quests from './Quests/Quests';

const Details = ({playerCount}) => {
    const combinations = {
        5: ["5 Players", "2 Minions of Morderd"],
        6: ["6 Players", "2 Minions of Morderd"],
        7: ["7 Players", "3 Minions of Mordred"],
        8: ["8 Players", "3 Minions of Mordred"],
        9: ["9 Players", "3 Minions of Mordred"],
        10: ["10 Players", "4 Minions of Mordred"],
    }

    return (
        <div className="details">
            <div id="player-count">{combinations[playerCount][0]}</div>
            <div id="mininons-of-mordred">{combinations[playerCount][1]}</div> 
        </div>
    );
}

class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = props;
    }    

    render() {
        const source = require('../../pictures/game-boards/custom-variant.jpg')
        const style = {
            backgroundImage: `url(${source})`,
            height: "749px",
            backgroundSize: "cover"
        }

        return (
            <div className="game-board" style={style}>
                <div className="buffer"></div>
                <Quests questPassFail={this.props.questPassFail} playerCount={this.props.playerCount} />
                <Votes currentVoteIndex={this.props.currentVoteIndex} incrementVoteIndex={this.props.incrementVoteIndex} />
                <Details playerCount={this.props.playerCount}/>
            </div>
        );
    }
}

export default GameBoard;