const uuidv4 = require('uuid/v4');

class Player {

    constructor(name) {
        this.id = uuidv4();
        this.name = name;
        this.ready = false;
        this.clientId = undefined;
        this.character = undefined;
        this.alignment = undefined;
    }

    getPlayerData() {
        return {
            id: this.id,
            name: this.name,
            ready: this.ready,
        }
    }

    setClientId(clientId) {
        this.clientId = clientId
    }

    asSeenBy(viewingPlayer) {
        if (this.id === viewingPlayer.id) {
            return {
                id: this.id,
                name: this.name,
                character: this.character,
                alignment: this.alignment,
            }
        } else {
            if (viewingPlayer.character === 'merlin' && this.alignment === 'evil' && this.character !== 'mordred') {
                return {
                    id: this.id,
                    name: this.name,
                    alignment: this.alignment,
                }
            } else if (viewingPlayer.character === 'percival') {
                return {
                    id: this.id,
                    name: this.name,
                    character: (this.character === 'merlin') || (this.character === 'morgana') ? 'merlin' : undefined,
                }
            } else if (viewingPlayer.alignment === 'evil' && viewingPlayer.character !== 'oberon' && this.character !== 'oberon' && this.alignment === 'evil') {
                return {
                    id: this.id,
                    name: this.name,
                    alignment: this.alignment,
                }
            } else {
                return {
                    id: this.id,
                    name: this.name,
                }
            }
        }
    }

}

module.exports = Player;