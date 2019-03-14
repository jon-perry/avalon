class Quest {
    constructor(questParticipants, failsRequired) {
        this.passFailed = undefined;
        this.participants = [];
        this.approveRejectVotes = [[]];
        this.successFailVotes = [];
        this.numberOfParticipants = questParticipants;
        this.twoFailsRequired = failsRequired;
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

    addSuccessFailResult(choice) {
        this.successFailVotes.push(choice);
        return this.successFailVotes.length === this.numberOfParticipants;
    }

    asSeenBy(_id) {
        return {
            participants: this.participants,
            approveRejectVotes: this.approveRejectVotes,
            numberOfParticipants: this.numberOfParticipants,
            passFailed: this.passFailed,
        }
    }

    addParticipants(participants) {
        
    }

}

module.exports = Quest;