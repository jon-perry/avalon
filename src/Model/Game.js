const CHARACTER_GAME_VARIANTS = require('../GamePieces/Characters/CharacterGameVariants.json');
const CHARACTER_ALIGNMENT = require('../GamePieces/Characters/CharacterAlignment.json');
const QUEST_INFO = require('../GamePieces/GameBoard/Quests/QuestInfo.json');
const Quest = require('../Model/Quest');
const APP_CONSTANTS = require('../AppConstants');

class Game {

    constructor(players) {
        this.players = players;
        this.quests = this.getQuestInfo();
        this.phase = APP_CONSTANTS.GAME_PHASES.PENDING_START;
        this.history = [];
        this.questNumber = 0;
        this.questLeaderIndex = Math.floor(Math.random() * this.players.length);
        this.selectedPlayers = [];
        this.assignCharacters();
    }

    setPlayers(player) {
        this.players.push(player)
    }

    assignCharacters() {
        const GAME_VARIANTS = CHARACTER_GAME_VARIANTS[this.players.length];
        const randomVariant = Math.floor(Math.random() * GAME_VARIANTS.length);
        const gameVariant = Game.Shuffle(GAME_VARIANTS[randomVariant]);
        this.players.forEach((player, index) => {
            player.character = gameVariant[index]
            player.alignment = CHARACTER_ALIGNMENT[player.character];
        });
    }

    asSeenBy(id) {
        const viewingPlayer = this.players.find((player) => player.id === id);
        return {
            quests: this.quests,
            phase: this.phase,
            players: this.players.map((player) => player.asSeenBy(viewingPlayer)),
            questLeaderIndex: this.questLeaderIndex,
            questNumber: this.questNumber,
        }
    }

    getQuestInfo() {
        const questInfos = QUEST_INFO[this.players.length];
        const quests = questInfos.quests.map((questInfo, index) => {
            return new Quest(questInfo, this.players.length > 6 && index === 3);
        });
        return quests;
    }

    static Shuffle(array) {
        // taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-tmpArray
        let tmpArray = array.slice();
        let currentIndex = tmpArray.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...                                                         
        while (0 !== currentIndex) {
            // Pick a remaining element...                                                                   
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.                                                         
            temporaryValue = tmpArray[currentIndex];
            tmpArray[currentIndex] = tmpArray[randomIndex];
            tmpArray[randomIndex] = temporaryValue;
        }
        return tmpArray;
    };

}

module.exports = Game;