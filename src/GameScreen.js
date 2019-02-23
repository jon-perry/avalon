import React, { useState, useEffect } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import './GameScreen.scss';
import PlayerInformations from './GamePieces/Players/PlayerInformations';


const defaultQuestPassFail = [undefined, undefined, undefined, undefined, undefined];
const TeamToken = require('./pictures/tokens/team-token.png');
const character = require('./pictures/characters/loyalty-back.jpg');


const createPlayers = (playerCount) => {
    const players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push({ playerName: `test ${i}`, cardImage: character })
    }
    return players
}

export default function GameScreen(props) {

    const playerCount = props.playerCount;
    const [players, setPlayers] = useState(createPlayers(playerCount));
    const [questParticipants, setQuestParticipants] = useState(3);

    const [currentVoteIndex, setVoteIndex] = useState(-1);
    const [questPassFail, setQuestPassFail] = useState(defaultQuestPassFail);

    const handleQuestConfirmation = () => {

    }

    return (
        <div className="game-screen">
            <PlayerInformations players={createPlayers(playerCount)} active={true} numberOfParticipants={5}/>
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

