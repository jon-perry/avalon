const questInfo = require('./src/GamePieces/GameBoard/Quests/QuestInfo');
const io = require('socket.io')();
let ids = [];
// need to set up to have playersInformation in players to keep track of who voted for what as well as their character

let gameInformation = {
    players: {},
    questSelected: undefined,
    selectedPlayers: [],
    questPlayers: [],
    approveRejectVotes: [],
    successFailVotes: [],
    failedTeamVotes: 0,
}
let history = [];
let questNumber = 0;

io.on('connection', (client) => {
    gameInformation.players[client.id] = { name: client.id, id: client.id, character: `test ${client.id}` }
    // handles client disconnecting then reconnecting -- uses their name (which will be unique) to update them in the players object
    client.on('login', info => {
        const players = gameInformation.players;
        if (info.name.value in players) {
            players[info.name.value] = { ...players[info.name.value], id: client.id };
        } else {
            players[info.name.value] = { name: info.name.value, id: client.id, character: `test ${info.name.value}` }
            console.log(players);
        }
        client.emit('loggedIn', undefined);
    });

    client.on('disconnect', () => {

    });

    client.on('playerChoice', playerChoices => {
        gameInformation = { ...gameInformation, selectedPlayers: playerChoices };
        client.broadcast.emit('playerChoices', { selectedPlayers: gameInformation.selectedPlayers });
    });

    client.on('confirmPlayerChoices', msg => {
        io.emit('showVotePhase', true);
    });

    client.on('voteChoice', choice => {
        for (player in gameInformation.players) {
            if (gameInformation.players[player].id === client.id) {
                gameInformation.players[player].vote = choice;
                gameInformation.approveRejectVotes.push(choice);
                console.log(gameInformation.approveRejectVotes);
            }
        }

        if (gameInformation.approveRejectVotes.length === 6)/*Object.keys(gameInformation.players).length)*/ {
            let rejectVotes = gameInformation.approveRejectVotes.filter((vote) => vote === 'reject');
            if (!(rejectVotes.length >= (/*playerCount*/6 / 2))) {
                io.emit('showQuestPhase', true);
            } else {
                io.emit('failedTeamVote', undefined);
                gameInformation.failedTeamVotes++;
            }
            gameInformation.approveRejectVotes = [];
        }
    })

    client.on('successFailConfirmed', (choice) => {
        let successFailVotes = gameInformation.successFailVotes
        successFailVotes.push(choice);
        // console.log(gameInformation.successFailVotes);
        console.log('checking if quests is of appropiate length', questInfo[5].quests[questNumber], successFailVotes.length);
        if (successFailVotes.length === questInfo[5/*playerCount*/].quests[questNumber]) {
            io.emit('questResult', { questNumber: questNumber, result: checkIfQuestPassFail(2, questNumber, gameInformation.successFailVotes) })
            questNumber = (questNumber + 1) % 5;
            endRound();
        }
        client.emit('showQuestPhase', false);
    });



});


const port = 8888;
io.listen(port);
console.log('servering running...');

const checkIfWinner = (state) => {

}

const checkIfQuestPassFail = (numPlayers, questNumber, successFailVotes) => {
    const requiredFailVotes = (numPlayers > 6 && questNumber === 3) ? 2 : 1;
    let failVotes = 0;
    successFailVotes.forEach((vote) => vote === 'fail' ? failVotes++ : undefined);
    return !(failVotes >= requiredFailVotes);
};

const endRound = () => {
    history.push(gameInformation);
}