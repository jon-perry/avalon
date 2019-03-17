const io = require('socket.io')();
const Lobby = require('./src/Model/Lobby');
const Player = require('./src/Model/Player');
const configureLobbyActions = require('./LobbyActions');
const configureGameActions = require('./GameActions');
const DatabaseHelper = require('./src/Util/DatabaseHelper');
const MongoClient = require('mongodb').MongoClient;
const APP_CONSTANTS = require('./src/AppConstants');

let databaseHelper = new DatabaseHelper(MongoClient);

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
    client.on(APP_CONSTANTS.CREATE_USER, async ({ name, password }) => {
        const user = await databaseHelper.getUser(name.toLowerCase());
        if (!user) {
            await databaseHelper.createUser(name.toLowerCase(), password);
            const currentPlayer = new Player(name);
            currentPlayer.setClientId(client.id);
            players.push(currentPlayer)
            client.emit(APP_CONSTANTS.LOGGED_IN, currentPlayer.getPlayerData());
        } else {
            client.emit(APP_CONSTANTS.ERROR, { error: APP_CONSTANTS.ERRORS.NAME_TAKEN });
        }
    });

    client.on(APP_CONSTANTS.LOGIN, async ({ name, password }) => { // TODO: Store password
        const verified = await databaseHelper.verifyCredentials(name.toLowerCase(), password);
        const currentPlayer = findPlayer(name) || new Player(name);
        if (verified) {
            players.push(currentPlayer);
            currentPlayer.setClientId(client.id);
            client.emit(APP_CONSTANTS.LOGGED_IN, currentPlayer.getPlayerData());
        } else {
            client.emit(APP_CONSTANTS.ERROR, { error: APP_CONSTANTS.ERRORS.WRONG_CREDENTIALS });
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

    configureGameActions({ io, client, findGame, findLobby, lobbies });
});

const port = 8888;
io.listen(port);
console.log('server running...');