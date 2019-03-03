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
}
let history = [];
let questNumber = 1;

io.on('connection', (client) => {
    ids.push(client.id);

    // handles client disconnecting then reconnecting -- uses their name (which will be unique) to update them in the players object
    client.on('login', info => {
        const players = gameInformation.players;
        if (info.name.value in players) {
            console.log(players);
            players[info.name.value] = { ...players[info.name.value], id: client.id };
            console.log(players);
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
        io.emit('showSuccessFailPhase', true);
    });

    client.on('voteChoice', choice => {
        client.emit('showVotePhase', false);
        gameInformation.players = { ...gameInformation.players }
    })

    client.on('successFailConfirmed', (choice) => {
        gameInformation.successFailVotes.push(choice);
        let successFailVotes = gameInformation.successFailVotes
        // console.log(gameInformation.successFailVotes);
        if (successFailVotes.length === 2) {
            if (successFailVotes[0] === 'fail' || successFailVotes[1] === 'fail') {
                io.emit('questResult', { questNumber: questNumber, result: false })
                questNumber = (questNumber + 1) % 6;
                gameInformation.successFailVotes = [];
            } else {
                io.emit('questResult', { questNumber: questNumber, result: true })
                questNumber = (questNumber + 1) % 6;
                gameInformation.successFailVotes = [];
            }
            // used to handle after all successFail votes received
        }
    });



});


const port = 8888;
io.listen(port);
console.log('servering running...');