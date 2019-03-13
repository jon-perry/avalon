const io = require('socket.io')();
const Game = require('./src/Model/Game');
const Lobby = require('./src/Model/Lobby');
const Player = require('./src/Model/Player');
const configureLobbyActions = require('./LobbyActions');

const CLIENT_ACTION = require('./src/AppConstants');

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

    client.on(CLIENT_ACTION.LOGIN, ({ name }) => { // TODO: Store password
        const currentPlayer = findPlayer(name) || new Player(name); // Move new player to Registration
        players.push(currentPlayer);
        if (currentPlayer) {
            currentPlayer.setClientId(client.id);
            client.emit(CLIENT_ACTION.LOGGED_IN, currentPlayer.getPlayerData());
        } else {
            // TODO: Error: No user exists
        }
    });

    client.on(CLIENT_ACTION.CHECK_LOGGED_IN, ({ uuid }) => {
        const currentPlayer = findPlayer(uuid);
        if (currentPlayer) {
            currentPlayer.setClientId(client.id);
            client.emit(CLIENT_ACTION.LOGGED_IN, currentPlayer.getPlayerData());
        } else {
            client.emit(CLIENT_ACTION.LOGGED_IN, undefined);
        }
    });

    configureLobbyActions({ io, client, findLobby, findPlayer, lobbies });

    client.on(CLIENT_ACTION.GAME_START, ({ id }) => {
        const lobby = findLobby(id);
        const game = new Game(lobby.players);
        lobby.addGame(game);
        lobby.started = true;
        game.phase = CLIENT_ACTION.GAME_PHASES.QUEST_PLAYER_SELECTION;
        io.emit(CLIENT_ACTION.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
        lobby.players.forEach(player => {
            io.to(`${player.clientId}`).emit(CLIENT_ACTION.SET_GAME, game.asSeenBy(player.id))
        });
    });

    client.on(CLIENT_ACTION.GET_GAME, ({ playerId }) => {
        const game = findGame(playerId);
        if (game) {
            client.emit(CLIENT_ACTION.SET_GAME, game.asSeenBy(playerId));
        }
    });

    client.on(CLIENT_ACTION.PLAYER_SELECT, ({ selectedPlayerId }) => {
        const game = findGame(selectedPlayerId);
        if (game) {
            game.toggleSelectedPlayer(selectedPlayerId);
            game.players.forEach((player) => io.to(player.clientId).emit(CLIENT_ACTION.SET_GAME, game.asSeenBy(player.id)));
        }
    });

    client.on(CLIENT_ACTION.CONFIRM_SELECTED_PLAYERS, ({ id }) => {
        const game = findGame(id);
        if (game) {
            game.phase = CLIENT_ACTION.GAME_PHASES.QUEST_PLAYER_APPROVAL;
            game.emitGameStateToPlayers(io);
        }
    });

    client.on(CLIENT_ACTION.SELECT_APPROVE_REJECT, ({ id, voteChoice }) => {
        const game = findGame(id);
        if (game) {

            const voteComplete = game.quests[game.questNumber].addApproveRejectResult(id, voteChoice, game.players.length);
            if (voteComplete) {
                const currentRoundVotes = game.quests[game.questNumber].approveRejectVotes[game.quests[game.questNumber].approveRejectVotes.length - 1];

                // TODO: emit player votes before caculating if it passes or fails
                const rejectVotes = currentRoundVotes.filter(({voteChoice, id}) => voteChoice === 'reject');
                const votePassed = rejectVotes < Math.ceil(game.players.length / 2);
                console.log(votePassed);
                game.phase = CLIENT_ACTION.GAME_PHASES.RESULT_APPROVE_REJECT;
            }
            game.emitGameStateToPlayers(io);
        }
    })

});

const port = 8888;
io.listen(port);
console.log('server running...');