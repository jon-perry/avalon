import React, { useState, useEffect, useContext } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import './GameScreen.scss';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import SuccessFail from './GamePieces/GameBoard/Votes/SuccessFail';
import { SocketContext } from './App';

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

export default function GameScreen({ playerCount, clientIsQuestLeader }) {
    const socket = useContext(SocketContext);
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
    }, [questPassFail])

    return (
        <div className="game-screen">
            <SuccessFail isOnQuest={true} isGood={false} />
            <PlayerInformations players={createPlayers(playerCount)} active={clientIsQuestLeader} numQuestParticipants={2} />
            {/* <Test /> */}
            <GameBoard
                players={createPlayers(playerCount)}
                playerCount={playerCount}
                questPassFail={questPassFail}
            />
        </div>
    )
}

