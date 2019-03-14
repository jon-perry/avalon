class Quest {
    constructor(questParticipants, failsRequired) {
        this.didPass = undefined;
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
            didPass: this.didPass,
            successFailVotes: this.successFailVotes,
        }
    }

    shuffleResult() {
        this.successFailVotes = this.Shuffle(this.successFailVotes);
    }

    Shuffle(array) {
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

module.exports = Quest;