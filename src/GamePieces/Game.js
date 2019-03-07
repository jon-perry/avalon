module.exports = class Game {

    constructor(players, characters) {
        this.players = players ? players : [];
        this.characters = characters;
        this.selectedQuestPlayers = [];
        this.approveRejectVotes = [];
        this.successFailVotes = [];
        this.failedTeamVotes = 0;
        this.history = [];
        this.questPassFailResults = [undefined, undefined, undefined, undefined, undefined];
        this.questNumber = 0;

        // TODO once working with normal game variant, allow new game variants if time permits
        // if (gameVariant) {
        //     this.gameVariant = gameVariant;
        // } else {
        //     this.gameVariant = { ladyInTheWater: false, questSelecting: false, characters: presetCharacters0 }; // default game variant
        // }

    }
    getPlayers() {
        return this.players;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    setPlayers(players) {
        this.players = players;
    }

    getCharacters() {
        return this.characters;
    }

    getSelectedQuestPlayers() {
        return this.selectedQuestPlayers;
    }

    setSelectedQuestPlayers(questPlayers) {
        this.selectedQuestPlayers = questPlayers;
    }

    getApproveRejectVotes() {
        return this.approveRejectVotes;
    }

    addApproveRejectVote(vote) {
        this.approveRejectVotes.push(vote);
    }

    getFailedTeamVotes() {
        return this.failedTeamVotes;
    }

    incrementFailedTeamVotes() {
        this.failedTeamVotes++;
    }

    getSuccessFailVotes() {
        return this.successFailVotes;
    }

    addSuccessFailVote(vote) {
        this.successFailVotes.push(vote);
    }

    getQuestNumber() {
        return this.questNumber;
    }

    incrementQuestNumber() {
        this.questNumber++;
    }

    setQuestNumber(selectedQuestNum) {
        this.questNumber = selectedQuestNum;
    }

    determineQuestResult() {
        const requiredFailVotes = (this.players.length > 6 && this.questNumber === 3) ? 2 : 1;
        const failedVotes = this.successFailVotes.filter((vote) => vote === 'fail');
        return failedVotes.length < requiredFailVotes;
    }

    getHistory() {
        return this.history;
    }

    appendHistory(info) {
        this.history.push(info);
    }

    getQuestPassFailResults() {
        return this.questPassFailResults;
    }

    setQuestPassFailResults(results) {
        this.questPassFailResults = results;
    }







}