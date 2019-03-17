const Lobby = require('./src/Model/Lobby');
const APP_CONSTANTS = require('./src/AppConstants');

configureLobbyActions = ({ io, client, findPlayer, findLobby, lobbies }) => {

    const emitLobbySync = () => {
        io.emit(APP_CONSTANTS.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
    }

    client.on('RESET', ({ }) => {
        lobbies.forEach((lobby) => {
            lobby.players.forEach(player => {
                io.to(`${player.clientId}`).emit('setGame', undefined);
            });
        })
        lobbies.splice(0);
        lobbies.push(new Lobby());
        emitLobbySync();
    });

    client.on(APP_CONSTANTS.GET_LOBBIES, () => {
        client.emit(APP_CONSTANTS.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
    });

    client.on(APP_CONSTANTS.JOIN_LOBBY, ({ id }) => {
        const currentPlayer = findPlayer(client.id);
        const lobby = findLobby(id);
        if (currentPlayer && lobby) {
            lobby.addPlayer(currentPlayer)
            client.emit(APP_CONSTANTS.JOINED_LOBBY, lobby);
            emitLobbySync();
        }
    });

    client.on(APP_CONSTANTS.IS_READY_CHANGE, ({ id, ready }) => {
        const lobby = findLobby(id);
        if (lobby) {
            const player = lobby.findPlayer(client.id);
            if (player) {
                player.ready = ready;
                emitLobbySync();
            }
        }
    });
};

module.exports = configureLobbyActions;