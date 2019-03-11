const uuidv4 = require('uuid/v4');

class Lobby {

    constructor() {
        this.id = uuidv4();
        this.players = [];
        this.leader = undefined;
        this.game = undefined;
        this.started = false;
    }

    getLobbyData() {
        return {
            id: this.id,
            players: this.players.map((player) => player.getPlayerData()),
            leader: this.leader,
        }
    }

    promoteLeader(candidate) {
        // TODO: Promote to leader
    }

    addPlayer(player) {
        this.players.push(player);
        if (!this.leader) {
            this.leader = player;
        }
    }

    findPlayer(nameOrId) {
        return this.players.find((player) => (
            (player.name === nameOrId) ||
            (player.id === nameOrId) ||
            (player.clientId === nameOrId)
        ));
    }

    addGame(game) {
        this.game = game;
    }

}

module.exports = Lobby;