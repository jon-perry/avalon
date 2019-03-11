const io = require('socket.io')();
const Game = require('./src/Model/Game');
const Lobby = require('./src/Model/Lobby');
const Player = require('./src/Model/Player');
const configureLobbyActions = require('./LobbyActions');

const CLIENT_ACTION = require('./src/AppConstants');

/* Content Information */
const QUEST_INFO = require('./src/GamePieces/GameBoard/Quests/QuestInfo');
const WHO_CHARACTER_CAN_SEE = require('./src/GamePieces/Characters/WhoCharacterCanSee');
const CHARACTER_GAME_VARIANTS = require('./src/GamePieces/Characters/GameVariants');


// need to set up to have playersInformation in players to keep track of who voted for what as well as their character

const PLAYER_COUNT = 5;

let PRESET_CHARACTERS = CHARACTER_GAME_VARIANTS[PLAYER_COUNT][0];

// const game = new Game(undefined, PRESET_CHARACTERS);

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
        io.emit(CLIENT_ACTION.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
        lobby.players.forEach(player => {
            console.log({ clientId: player.clientId });
            io.to(`${player.clientId}`).emit(CLIENT_ACTION.SET_GAME, game.asSeenBy(player.id))
        });
    });

    client.on(CLIENT_ACTION.GET_GAME, ({ playerId }) => {
        const game = findGame(playerId);
        if (game) {
            client.emit(CLIENT_ACTION.SET_GAME, game.asSeenBy(playerId));
        }
    })

});

const port = 8888;
io.listen(port);
console.log('server running...');