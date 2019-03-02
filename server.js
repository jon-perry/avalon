const io = require('socket.io')();
let ids = [];
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
    console.log(ids)
    client.on('disconnect', () => {
        console.log(client.id + ' disconnected');
        const newIds = ids.slice().filter((id) => id != client.id);
        ids = newIds;
    });
    client.on('playerChoice', (playerChoices) => {
        gameInformation = { ...gameInformation, selectedPlayers: playerChoices };
        client.broadcast.emit('playerChoices', { selectedPlayers: gameInformation.selectedPlayers });
    });
    client.on('confirmPlayerChoices', (message) => {
        io.emit('showVotePhase', undefined);
    });
});


const port = 8888;
io.listen(port);
console.log('server setss up!!!!!');