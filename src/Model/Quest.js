class Quest {
    constructor(questParticipants, failsRequired) {
        this.passFailed = undefined;
        this.participants = [];
        this.approveRejectVotes = [[]];
        this.successFailVotes = [];
        this.numberOfParticipants = questParticipants;
        this.failsRequired = failsRequired;
        this.questCounter = 0;
    }

    addApproveRejectResult(id, voteChoice, numberOfPlayers) {
        if (!this.approveRejectVotes[this.questCounter]) {
            this.approveRejectVotes[this.questCounter] = [];
        }
        const currentRoundVotes = this.approveRejectVotes[this.questCounter];
        currentRoundVotes.push({ id, voteChoice });
        return currentRoundVotes.length === numberOfPlayers;
    }

    asSeenBy(_id) {
        return {
            participants: this.participants,
            approveRejectVotes: this.approveRejectVotes,
            numberOfParticipants: this.numberOfParticipants,
        }
    }

    addParticipants(participants) {
        
    }

}

module.exports = Quest;