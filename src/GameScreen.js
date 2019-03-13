import React from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import './GameScreen.scss';
import ApproveReject from './GamePieces/GameBoard/Votes/ApproveReject';
import ApproveRejectResult from './GamePieces/GameBoard/Votes/ApproveRejectResult';
import SuccessFail from './GamePieces/GameBoard/Votes/SuccessFail';
import CookieService from './Util/CookieService';


const APP_CONSTANTS = require('./AppConstants');



export default function GameScreen({ game }) {
    const clientPlayer = CookieService.GetPlayer();
    console.log(game.selectedPlayers);
    console.log(clientPlayer.id);
    console.log(game.selectedPlayers.some((playerId) => playerId === clientPlayer.id));
    console.log(game.players.find((player) => player.id === clientPlayer.id).alignment === 'good')
    return (

        <div className="game-screen">
            {
                (game.phase === APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_APPROVAL) &&
                (<ApproveReject
                    selectedPlayers={game.selectedPlayers}
                    players={game.players}
                    quest={game.quests[game.questNumber]}
                    questLeaderIndex={game.questLeaderIndex}
                />)
            }
            {
                (game.phase === APP_CONSTANTS.GAME_PHASES.QUEST) &&
                (<SuccessFail
                    isOnQuest={game.selectedPlayers.some((playerId) => playerId === clientPlayer.id)}
                    isGood={game.players.find((player) => player.id === clientPlayer.id).alignment === 'good'}
                />)
            }
            {
                (game.phase === APP_CONSTANTS.GAME_PHASES.RESULT_APPROVE_REJECT) && (<ApproveRejectResult players={game.players} quest={game.quests[game.questNumber]} />)
            }
            {game.players && (
                <>
                    <PlayerInformations
                        players={game.players}
                        questLeaderIndex={game.questLeaderIndex}
                        selectedPlayers={game.selectedPlayers}
                        numberOfParticipants={game.currentQuest.numberOfParticipants}
                        gamePhase={game.phase}
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
