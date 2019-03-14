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
        this.failedVotes = 0;
        this.assignCharacters();
        this.winner = undefined;
    }

    setPlayers(player) {
        this.players.push(player)
    }

    toggleSelectedPlayer(selectedPlayerId) {
        const nextState = this.selectedPlayers.slice();
        if (!nextState.includes(selectedPlayerId)) {
            nextState.push(selectedPlayerId);
            this.selectedPlayers = nextState;
        } else {
            this.selectedPlayers = nextState.filter((playerId) => playerId !== selectedPlayerId);
        }
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
            quests: this.quests.map((quest) => quest.asSeenBy(id)),
            phase: this.phase,
            players: this.players.map((player) => player.asSeenBy(viewingPlayer)),
            questLeaderIndex: this.questLeaderIndex,
            questNumber: this.questNumber,
            selectedPlayers: this.selectedPlayers,
            currentQuest: this.quests[this.questNumber],
            failedVotes: this.failedVotes,
            winner: this.winner,
        }
    }

    getQuestInfo() {
        const questInfos = QUEST_INFO[this.players.length];
        const quests = questInfos.quests.map((questInfo) => {
            return new Quest(questInfo, this.players.length > 6 && index === 3);
        });
        return quests;
    }

    getVoteResult() {
        const currentRoundVotes = this.quests[this.questNumber].approveRejectVotes[this.quests[this.questNumber].approveRejectVotes.length - 1];
        const rejectVotes = currentRoundVotes.filter(({ voteChoice, id }) => voteChoice === 'reject');
        return rejectVotes < Math.ceil(this.players.length / 2);
    }

    setVotePassed() {
        this.phase = APP_CONSTANTS.GAME_PHASES.QUEST;
    }

    setVoteFailed() {
        this.failedVotes += 1;
        this.questLeaderIndex = (this.questLeaderIndex + 1) % this.players.length;
        this.phase = APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION;
        const currentQuest = this.quests[this.questNumber];
        currentQuest.questCounter++;
        currentQuest.approveRejectVotes.push([]);
        this.selectedPlayers = [];
    }

    getSuccessFailResult() {
        const currentQuest = this.quests[this.questNumber];
        const failedVotes = currentQuest.successFailVotes.filter((vote) => vote === 'fail');
        const failedRequirement = currentQuest.twoFailsRequired ? 2 : 1;
        return (failedVotes.length < failedRequirement);
    }

    setQuestPassed() {
        this.questLeaderIndex = (this.questLeaderIndex + 1) % this.players.length;
        this.phase = APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION;
        this.quests[this.questNumber].didPass = true;
        this.selectedPlayers = [];
        this.questNumber++;
    }

    setQuestFailed() {
        this.questLeaderIndex = (this.questLeaderIndex + 1) % this.players.length;
        this.phase = APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION;
        this.quests[this.questNumber].didPass = false;
        this.selectedPlayers = [];
        this.questNumber++;
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

    getWinner() {
        const questFails = this.quests.map(quest => quest.didPass)
            .filter(result => result === false);
        const questSuccesses = this.quests.map(quest => quest.didPass)
            .filter(result => result === true);
        // .filter(result => result === 'success'));                                 
        if (this.failedVotes === 5) {
            return APP_CONSTANTS.WINNER.EVIL_VOTES
        } else if (questFails.length === 3) {
            return APP_CONSTANTS.WINNER.EVIL_QUESTS;
        } else if (questSuccesses.length === 3) {
            const gameCharacters = this.players.map(player => player.character);
            if (gameCharacters.find(character => character === 'assassin')) {
                return APP_CONSTANTS.WINNER.ASSASSIN_EXISTS
            } else {
                return APP_CONSTANTS.WINNER.GOOD
            }
        }
        return undefined;
    }


}

module.exports = Game;