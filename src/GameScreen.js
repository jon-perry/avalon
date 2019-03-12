import React from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import './GameScreen.scss';
import ApproveReject from './GamePieces/GameBoard/Votes/ApproveReject';
const CLIENT_ACTION = require('./AppConstants');

export default function GameScreen({ game }) {

    return (
        <div className="game-screen">
            {
                (game.phase === CLIENT_ACTION.GAME_PHASES.QUEST_PLAYER_APPROVAL) &&
                (<ApproveReject
                    selectedPlayers={game.selectedPlayers}
                    players={game.players}
                    quest={game.quests[game.questNumber]}
                    questLeaderIndex={game.questLeaderIndex}
                />)
            }
            {game.players && (
                <>
                    <PlayerInformations
                        players={game.players}
                        questLeaderIndex={game.questLeaderIndex}
                        selectedPlayers={game.selectedPlayers}
                        numberOfParticipants={game.currentQuest.numberOfParticipants}
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
