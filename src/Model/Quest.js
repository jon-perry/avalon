class Quest {
    constructor(questParticipants, failsRequired, questNumber) {
        this.selected = false;
        this.passFailed = undefined;
        this.questNumber = questNumber ? questNumber : 0;
        this.participants = [];
        this.approveRejectVotes = [];
        this.successFailVotes = [];
        this.numberOfParticipants = questParticipants;
        this.failsRequired = failsRequired;
    }
}

module.exports = Quest;