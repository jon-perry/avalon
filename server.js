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

io.on('connection', (client) => {
    ids.push(client.id);
    gameInformation.players[client.id] = {name: client.id, character: 'test'};
    gameInformation.players = {...gameInformation.players };
    console.log(ids)
    
    client.on('disconnect', () => {
        console.log(client.id + ' disconnected');
        const newIds = ids.slice().filter((id) => id != client.id);
        ids = newIds;
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
        gameInformation.players = {...gameInformation.players}
    })

    client.on('successFailConfirmed', (choice) => {
        gameInformation.successFailVotes.push(choice);
        console.log(gameInformation.successFailVotes);
        if (gameInformation.successFailVotes.length === 2) {
            console.log('received two choices');
        }
        history.push(gameInformation);
        // console.log(history);
        console.log(gameInformation.players[client.id]);
    });
});


const port = 8888;
io.listen(port);
console.log('server setss up!!!!!');