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
        super(props)
        this.state = {
            currentVoteIndex: -1,
            playerCount: this.props.playerCount,
            questPassFail: [true, false, undefined, undefined, undefined],
        }
    }

    incrementVoteIndex = () => {
        this.setState((prevState) => ({
            ...prevState,
            currentVoteIndex: prevState.currentVoteIndex + 1
        }))
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
                <Quests questPassFail={this.state.questPassFail} playerCount={this.state.playerCount}/>
                <Votes currentVoteIndex={this.state.currentVoteIndex} incrementVoteIndex={this.incrementVoteIndex} />
                <Details playerCount={this.state.playerCount}/>
            </div>
        );
    }
}

export default GameBoard;