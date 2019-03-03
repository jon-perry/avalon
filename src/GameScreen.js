import React, { useState, useEffect } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import './GameScreen.scss';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import SuccessFail from './GamePieces/GameBoard/Votes/SuccessFail';

const defaultQuestPassFail = [undefined, undefined, undefined, undefined, undefined];
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

export default function GameScreen({ socket, playerCount, clientIsQuestLeader }) {
    const [isOnQuest, setIsOnQuest] = useState(false);
    const [questPassFail, setQuestPassFail] = useState(defaultQuestPassFail);

    useEffect(() => {
        const handle = msg => {
            setIsOnQuest(msg);
        };

        socket.on('showQuestPhase', handle);

        return () => socket.removeListener('showQuestPhase', handle);
    }, [])

    useEffect(() => {
        const handle = msg => {
            const questNumber = msg.questNumber;
            const result = msg.result;
            const newState = questPassFail.slice();
            newState[questNumber] = result;
            setQuestPassFail(newState);
        };

        socket.on('questResult', handle);
        return () => socket.removeListener('questResult', handle);
    }, [])

    return (
        <div className="game-screen">
            <SuccessFail socket={socket} isOnQuest={isOnQuest} isGood={true} />
            <PlayerInformations socket={socket} players={createPlayers(playerCount)} active={clientIsQuestLeader} numQuestParticipants={2} />
            {/* <Test /> */}
            <GameBoard
                socket={socket}
                players={createPlayers(playerCount)}
                playerCount={playerCount}
                questPassFail={questPassFail}
            />
        </div>
    )
}

