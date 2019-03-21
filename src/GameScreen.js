import React from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import PlayerInformations from './GamePieces/Players/PlayerInformations';
import './GameScreen.scss';
import ApproveReject from './GamePieces/GameBoard/Votes/ApproveReject';
import ApproveRejectResult from './GamePieces/GameBoard/Votes/ApproveRejectResult';
import SuccessFail from './GamePieces/GameBoard/Votes/SuccessFail';
import CookieService from './Util/CookieService';
import SuccessFailResults from './GamePieces/GameBoard/Votes/SuccessFailResults';
import GameOver from './GamePieces/GameBoard/GameOver';
import AssassinPhase from './GamePieces/GameBoard/AssassinPhase';


const APP_CONSTANTS = require('./AppConstants');



export default function GameScreen({ game }) {
    const clientPlayer = CookieService.GetPlayer();
    const isClientGood = game.players.find((player) => player.id === clientPlayer.id).alignment === 'good';

    // this let's us see the end game sceeen without crashing 
    if (game.questNumber === 5) {
        game.questNumber -= 1;
        game.currentQuest = game.quests[game.questNumber];
    }
    const successFailVotes = game.quests[game.questNumber].successFailVotes;

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
                (game.phase === APP_CONSTANTS.GAME_PHASES.RESULT_APPROVE_REJECT) && 
                    (<ApproveRejectResult players={game.players} quest={game.quests[game.questNumber]} />)
            }
            {
                (game.phase === APP_CONSTANTS.GAME_PHASES.QUEST) &&
                    (<SuccessFail
                        isOnQuest={game.selectedPlayers.some((playerId) => playerId === clientPlayer.id)}
                        isGood={isClientGood}
                    />)
            }
            {
                (game.phase === APP_CONSTANTS.GAME_PHASES.RESULT_SUCCESS_FAIL) &&
                    (<SuccessFailResults successFailVotes={successFailVotes} />)
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
                        questLeader={game.players[game.questLeaderIndex].name}
                    />
                </>
            )}
            {game.phase === APP_CONSTANTS.GAME_PHASES.ASSASSIN &&
                (<AssassinPhase
                    players={game.players}
                    questLeaderIndex={game.questLeaderIndex}
                    selectedPlayers={game.selectedPlayers}
                    gamePhase={game.phase}
                />)
            }
            {game.phase === APP_CONSTANTS.GAME_PHASES.WINNER_EXISTS &&
                (
                    <GameOver winner={game.winner} />
                )
            }
        </div>
    )
}
