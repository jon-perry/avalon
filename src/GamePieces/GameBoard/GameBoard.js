import React, { useState } from 'react';
import './GameBoard.scss';
import Votes from './Votes/Votes.js';
import Quests from './Quests/Quests';
import VoteResults from './Votes/VoteResults';

const Details = ({ playerCount, questLeader }) => {
    const combinations = {
        1: ["1 Player", "Test Mode"],
        2: ["2 Player", "Test Mode"],
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
            <div id="quest-leader">{`Quest Leader: ${questLeader}`}</div>
            <div id="mininons-of-mordred">{combinations[playerCount][1]}</div>
        </div>
    );
}

export default function GameBoard({ players, quests, questLeader }) {
    const [showVotes, setShowVotes] = useState(false);
    const source = require('../../pictures/game-boards/custom-variant.jpg')
    const style = {
        backgroundImage: `url(${source})`,
        height: "749px",
        backgroundSize: "cover"
    }

    return (
        <div className="game-board" style={style}>
            <VoteResults showVotes={showVotes} players={players} />
            <Quests quests={quests} playerCount={players.length} />
            <Votes />
            <Details playerCount={players.length} questLeader={questLeader} />
            <button className="details" onClick={() => setShowVotes(!showVotes)}>{!showVotes ? 'Show Votes' : 'Hide Votes'}</button>

        </div>
    );
}
