import React, { useState, useEffect } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import './GameScreen.scss';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import Test from './GamePieces/Test';
import SuccessFail from './GamePieces/GameBoard/Votes/SuccessFail';


const defaultQuestPassFail = [undefined, undefined, undefined, undefined, undefined];
const character = require('./pictures/characters/loyalty-back.jpg');
const createCharacter = (name) => require(`./pictures/characters/${name}.jpg`);
const characters = ['assassin', 'loyal-servant-0', 'merlin', 'minion-of-mordred-0', 'mordred', 'morgana', 'oberon', 'percival',
    'loyal-servant-1', 'loyal-servant-2'];

const createPlayers = (playerCount) => {
    const players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push({ playerName: `Player ${i}`, cardImage: createCharacter(characters[i]), vote: i % 2 === 0 ? 'approve' : 'reject' })
    }
    return players
}

export default function GameScreen({socket, playerCount, clientIsQuestLeader }) {
    const [players, setPlayers] = useState(createPlayers(playerCount));
    const [questParticipants, setQuestParticipants] = useState(3);

    const [currentVoteIndex, setVoteIndex] = useState(-1);
    const [questPassFail, setQuestPassFail] = useState(defaultQuestPassFail);

    const handleQuestConfirmation = () => {

    }

    return (
        <div className="game-screen">
            <SuccessFail isOnQuest={clientIsQuestLeader} />
            <PlayerInformations socket={socket} players={createPlayers(playerCount)} active={clientIsQuestLeader} numQuestParticipants={2} />
            {/* <Test /> */}
            <GameBoard
                players={createPlayers(playerCount)}
                currentVoteIndex={currentVoteIndex}
                playerCount={playerCount}
                questPassFail={questPassFail}
                incrementVoteIndex={incrementVoteIndex}
            />
        </div>
    )

    function incrementVoteIndex() {
        setVoteIndex((currentVoteIndex + 1) % 6);
    }
}

