const io = require('socket.io')();
const Game = require('./src/Model/Game');
const Lobby = require('./src/Model/Lobby');
const Player = require('./src/Model/Player');
const configureLobbyActions = require('./LobbyActions');

const APP_CONSTANTS = require('./src/AppConstants');

const lobbies = [new Lobby()];
const players = [];

const findPlayer = (nameOrId) => {
    return players.find((player) => (
        (player.name === nameOrId) ||
        (player.id === nameOrId) ||
        (player.clientId === nameOrId)
    ));
}

const findLobby = (id) => {
    return lobbies.find((lobby) => lobby.id === id);
}

const findGame = (playerId) => {
    const lobby = lobbies.find((lobby) => (lobby.players.some((player) => player.id === playerId)));
    return lobby ? lobby.game : undefined;
}

io.on('connection', (client) => {

    client.on(APP_CONSTANTS.LOGIN, ({ name }) => { // TODO: Store password
        const currentPlayer = findPlayer(name) || new Player(name); // Move new player to Registration
        players.push(currentPlayer);
        if (currentPlayer) {
            currentPlayer.setClientId(client.id);
            client.emit(APP_CONSTANTS.LOGGED_IN, currentPlayer.getPlayerData());
        } else {
            // TODO: Error: No user exists
        }
    });

    client.on(APP_CONSTANTS.CHECK_LOGGED_IN, ({ uuid }) => {
        const currentPlayer = findPlayer(uuid);
        if (currentPlayer) {
            currentPlayer.setClientId(client.id);
            client.emit(APP_CONSTANTS.LOGGED_IN, currentPlayer.getPlayerData());
        } else {
            client.emit(APP_CONSTANTS.LOGGED_IN, undefined);
        }
    });

    configureLobbyActions({ io, client, findLobby, findPlayer, lobbies });

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
            game.players.forEach((player) => io.to(player.clientId).emit(APP_CONSTANTS.SET_GAME, game.asSeenBy(player.id)));
        }
    });

    client.on(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, ({ id }) => {
        const game = findGame(id);
        if (game) {
            game.phase = APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_APPROVAL;
            game.emitGameStateToPlayers(io);
        }
    });

    client.on(APP_CONSTANTS.SELECT_APPROVE_REJECT, ({ id, voteChoice }) => {
        const game = findGame(id);
        if (game) {

            const voteComplete = game.quests[game.questNumber].addApproveRejectResult(id, voteChoice, game.players.length);
            if (voteComplete) {
                setTimeout(() => {
                    // TODO: hanldle moving onto next appropiate phase
                    if (game.voteDidPass()) {

                    } else {
                        game.voteFailed();
                        
                    }
                    game.phase = APP_CONSTANTS.PLAYER_SELECT;
                    game.emitGameStateToPlayers(io);

                }, 2000);
                game.phase = APP_CONSTANTS.GAME_PHASES.RESULT_APPROVE_REJECT;
            }
            game.emitGameStateToPlayers(io);
        }
    });

});

const port = 8888;
io.listen(port);
console.log('server running...');