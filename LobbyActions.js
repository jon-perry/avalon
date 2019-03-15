const Lobby = require('./src/Model/Lobby');
const CLIENT_ACTION = require('./src/AppConstants');

configureLobbyActions = ({ io, client, findPlayer, findLobby, lobbies }) => {

    const emitLobbySync = () => {
        io.emit(CLIENT_ACTION.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
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

    client.on(CLIENT_ACTION.GET_LOBBIES, () => {
        client.emit(CLIENT_ACTION.SET_LOBBIES, lobbies.filter((lobby) => !lobby.started).map((lobby) => lobby.getLobbyData()));
    });

    client.on(CLIENT_ACTION.JOIN_LOBBY, ({ id }) => {
        const currentPlayer = findPlayer(client.id);
        const lobby = findLobby(id);
        if (currentPlayer && lobby) {
            lobby.addPlayer(currentPlayer)
            client.emit(CLIENT_ACTION.JOINED_LOBBY, lobby);
            emitLobbySync();
        }
    });

    client.on(CLIENT_ACTION.IS_READY_CHANGE, ({ id, ready }) => {
        const lobby = findLobby(id);
        if (lobby) {
            const player = lobby.findPlayer(client.id);
            if (player) {
                player.ready = ready;
                emitLobbySync();
            }
        }
    });

}

module.exports = configureLobbyActions;