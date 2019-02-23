import React, { useState, useEffect } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import './GameScreen.scss';
import PlayerInformations from './GamePieces/Players/PlayerInformations';


const defaultQuestPassFail = [undefined, undefined, undefined, undefined, undefined];
const TeamToken = require('./pictures/tokens/team-token.png');

export default function Game(props) {

    const playerCount = props.playerCount;
    const players = props.players;

    const character = require('./pictures/characters/loyalty-back.jpg');
    const vote = require('./pictures/tokens/reject(level-balance).png')
    const testPlayers = []
    for (let i = 0; i < playerCount; i++) {
        testPlayers.push({ playerName: `test ${i}`, cardImage: character, lastVote: vote });
    }

    const [currentVoteIndex, setVoteIndex] = useState(-1);
    const [questPassFail, setQuestPassFail] = useState(defaultQuestPassFail);

    return (
        <div className="game-screen">
            <PlayerInformations players={testPlayers}/>
            {/* <Test /> */}
            <GameBoard
                currentVoteIndex={currentVoteIndex}
                playerCount={playerCount}
                questPassFail={questPassFail}
                incrementVoteIndex={incrementVoteIndex}
            />
        </div>
    )

    function incrementVoteIndex() {
        setVoteIndex((currentVoteIndex + 1) % 5);
    }
}

