import React, { useState, useEffect, useContext } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import SuccessFail from './GamePieces/GameBoard/Votes/SuccessFail';
import { SocketContext } from './App';
import './GameScreen.scss';
const CLIENT_ACTION = require('./AppConstants');

const defaultQuestPassFail = [undefined, undefined, undefined, undefined, undefined];

export default function GameScreen({ game }) {
    const socket = useContext(SocketContext);
    const [isOnQuest, setIsOnQuest] = useState(false);
    const [questPassFail, setQuestPassFail] = useState(defaultQuestPassFail);
    const gamePhase = useGamePhase(socket);
    useEffect(() => {
        const handle = msg => {
            setIsOnQuest(msg);
        };

        socket.on(CLIENT_ACTION.SHOW_QUEST_PHASE, handle);

        return () => socket.removeListener(CLIENT_ACTION.SHOW_QUEST_PHASE, handle);
    }, [])

    useEffect(() => {
        const handle = msg => {
            const questNumber = msg.questNumber;
            const result = msg.result;
            const newState = questPassFail.slice();
            newState[questNumber] = result;
            setQuestPassFail(newState);
        };

        socket.on(CLIENT_ACTION.QUEST_RESULT, handle);
        return () => socket.removeListener(CLIENT_ACTION.QUEST_RESULT, handle);
    }, [questPassFail])

    return (
        <div className="game-screen">
            <SuccessFail isOnQuest={gamePhase === CLIENT_ACTION.GAME_PHASES.QUEST} isGood={false} />
            {game.players && (
                <>
                    <PlayerInformations
                        gamePhase={gamePhase}
                        players={game.players}
                        active={true}
                        numQuestParticipants={game.quests[game.questNumber].numberOfParticipants}
                    />
                    <GameBoard
                        players={game.players}
                        quests={game.quests}
                    />
                </>
            )}
        </div>
    )
}

const useGamePhase = (socket) => {
    const [gamePhase, setGamePhase] = useState();

    const handleNewGamePhase = (phase) => {
        setGamePhase(phase);
    }
    useEffect(() => {
        socket.on(CLIENT_ACTION.SET_GAME_PHASE, handleNewGamePhase);
        return () => socket.removeListener(CLIENT_ACTION.SET_GAME_PHASE, handleNewGamePhase);
    }, [gamePhase]);

    return gamePhase;
};
