module.exports = class Game {
    defaultGameVariant = { ladyInTheWater: false, questSelecting: false, characters: presetCharacters0 }

    constructor(players, characters, gameVariant) {
        this.players = players;
        this.characters = characters;
        this.selectedQuestPlayers = [];
        this.approveRejectVotes = [];
        this.successFailVotes = [];
        this.failedTeamVotes = [];
        this.history = [];

        if (gameVariant) {
            this.gameVariant = gameVariant;
        } else {
            this.gameVariant = defaultGameVariant;
        }

    }
    getPlayers() {
        return this.players;
    }

    updatePlayer(player) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name === player.name) {
                this.players[i] = player;
                return true;
            }
        }
        return false;
    }

    getHistory() {
        return this.history;
    }

    appendHistory(info) {
        this.history.push(info);
    }

    




}