import React from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import './GameScreen.scss';
import ApproveReject from './GamePieces/GameBoard/Votes/ApproveReject';
import ApproveRejectResult from './GamePieces/GameBoard/Votes/ApproveRejectResult';


const CLIENT_ACTION = require('./AppConstants');


export default function GameScreen({ game }) {
    console.log(game.failedVotes);
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
            {
                (game.phase === CLIENT_ACTION.GAME_PHASES.RESULT_APPROVE_REJECT) && (<ApproveRejectResult players={game.players} quest={game.quests[game.questNumber]} />)
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
                        numFailedVotes={game.failedVotes}
                    />
                </>
            )}
        </div>
    )
}
