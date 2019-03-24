const APP_CONSTANTS = require('./src/AppConstants');
const Game = require('./src/Model/Game');
const TIME_OUT = 1750;



configureGameActions = ({ io, client, findGame, findLobby, lobbies }) => {
    client.on(APP_CONSTANTS.GAME_START, ({ id }) => {
        const lobby = findLobby(id);
        const game = new Game(lobby.players);
        lobby.addGame(game);
        lobby.started = true;
        game.phase = APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION;
        io.emit(APP_CONSTANTS.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
        lobby.players.forEach(player => {
            io.to(`${player.clientId}`).emit(APP_CONSTANTS.SET_GAME, game.asSeenBy(player.id))
        });
    });

    client.on(APP_CONSTANTS.GET_GAME, ({ playerId }) => {
        const game = findGame(playerId);
        if (game) {
            client.emit(APP_CONSTANTS.SET_GAME, game.asSeenBy(playerId));
        }
    });

    client.on(APP_CONSTANTS.PLAYER_SELECT, ({ selectedPlayerId }) => {
        const game = findGame(selectedPlayerId);
        if (game) {
            game.toggleSelectedPlayer(selectedPlayerId);
            // game.players.forEach((player) => io.to(player.clientId).emit(APP_CONSTANTS.SET_GAME, game.asSeenBy(player.id)));
            emitGameStateToPlayers(game);
        }
    });

    client.on(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, ({ id }) => {
        const game = findGame(id);
        if (game) {
            game.phase = APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_APPROVAL;
            emitGameStateToPlayers(game);
        }
    });

    client.on(APP_CONSTANTS.SELECT_APPROVE_REJECT, ({ id, voteChoice }) => {
        const game = findGame(id);
        if (game) {
            const voteComplete = game.quests[game.questNumber].addApproveRejectResult(id, voteChoice, game.players.length);
            if (voteComplete) {
                setTimeout(() => {
                    if (game.getVoteResult()) {
                        game.setVotePassed();
                    } else {
                        game.setVoteFailed();
                    }
                    handlePossibleWinner(game);
                    emitGameStateToPlayers(game);

                }, TIME_OUT);
                game.phase = APP_CONSTANTS.GAME_PHASES.RESULT_APPROVE_REJECT;
            }
            emitGameStateToPlayers(game);
        }
    });

    client.on(APP_CONSTANTS.CONFIRM_SUCCESS_FAIL, ({ id, choice }) => {
        const game = findGame(id);
        if (game) {
            const currentQuest = game.quests[game.questNumber]
            const successFailComplete = currentQuest.addSuccessFailResult(choice);
            if (successFailComplete) {
                setTimeout(() => {
                    const questPassed = game.getSuccessFailResult();
                    if (questPassed) {
                        game.setQuestPassed(true);
                    } else {
                        game.setQuestPassed(false);
                    }
                    handlePossibleWinner(game);
                    emitGameStateToPlayers(game);
                }, TIME_OUT);
                game.phase = APP_CONSTANTS.GAME_PHASES.RESULT_SUCCESS_FAIL;
                currentQuest.shuffleResult();
                emitGameStateToPlayers(game);
            }
        }
    });

    client.on(APP_CONSTANTS.ASSASSIN_PLAYER_SELECT, ({ selectedPlayerId }) => {
        const game = findGame(selectedPlayerId);
        if (game) {
            game.toggleSelectedPlayer(selectedPlayerId);
            emitGameStateToPlayers(game);
        }
    });

    client.on(APP_CONSTANTS.CONFIRM_ASSASSIN_SELECTION, ({ id }) => {
        const game = findGame(id);
        if (game) {
            const selectedPlayer = game.players.find((player) => player.id === game.selectedPlayers[0]);
            if (selectedPlayer.character === 'merlin') {
                game.selectedPlayers = [];
                game.winner = APP_CONSTANTS.WINNER.ASSASSIN_KILL;
                game.phase = APP_CONSTANTS.GAME_PHASES.WINNER_EXISTS;
            } else {
                game.selectedPlayers = [];
                game.winner = APP_CONSTANTS.WINNER.GOOD;
                game.phase = APP_CONSTANTS.GAME_PHASES.WINNER_EXISTS;
            }
            emitGameStateToPlayers(game);
        }
    });

    const emitGameStateToPlayers = (game) => {
        game.players.forEach((player) => io.to(player.clientId).emit(APP_CONSTANTS.SET_GAME, game.asSeenBy(player.id)));
    }

    const handlePossibleWinner = (game) => {
        const winner = game.getWinner();
        if (winner) {
            if (winner !== APP_CONSTANTS.WINNER.ASSASSIN_EXISTS) {
                game.selectedPlayers = [];
                game.phase = APP_CONSTANTS.GAME_PHASES.WINNER_EXISTS;
                game.winner = winner;
            } else {
                game.phase = APP_CONSTANTS.GAME_PHASES.ASSASSIN;
                game.questLeaderIndex = game.players.findIndex(player => player.character === 'assassin');
            }
        } else {
            return;
        }
    };
};

module.exports = configureGameActions;