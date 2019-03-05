const QUEST_INFO = require('./src/GamePieces/GameBoard/Quests/QuestInfo');
const WHO_CHARACTER_CAN_SEE = require('./src/GamePieces/Characters/WhoCharacterCanSee');
const CHARACTER_GAME_VARIANTS = require('./src/GamePieces/Characters/GameVariants');
const io = require('socket.io')();
let ids = [];
// need to set up to have playersInformation in players to keep track of who voted for what as well as their character

let presetCharacters0 = CHARACTER_GAME_VARIANTS[5][2];
const defaultGameVariant = { ladyInTheWater: false, questSelecting: false, characters: presetCharacters0 }

let gameState = {
    gameVariant: defaultGameVariant,
    players: {},
    selectedQuestPlayers: [],
    approveRejectVotes: [],
    successFailVotes: [],
    failedTeamVotes: 0,
};


const questPassFail = [undefined, undefined, undefined, undefined, undefined];

let history = [];
let questNumber = 0;
let numPlayersConnected = 0;
io.on('connection', (client) => {
    // handles client disconnecting then reconnecting -- uses their name (which will be unique) to update them in the players object -- needs
    client.on('login', info => {
        const players = gameState.players;
        if (info.name.value in players) {
            players[info.name.value] = { ...players[info.name.value], clientId: client.id };
            numPlayersConnected++;
        } else {
            players[info.name.value] = { name: info.name.value, clientId: client.id, character: undefined }
            numPlayersConnected === 5 ? postWhoClientCanSee(players[info.name.value]) : null;
            numPlayersConnected++;
        }
        // TODO change this to say true or false
        client.emit('loggedIn', true);
        console.log(numPlayersConnected);
        if (numPlayersConnected % 5 === 0) {
            assignCharacters(gameState.players);
            emitNumQuestParticipants(QUEST_INFO[5].quests[0]);
        }
    });

    client.on('disconnect', () => {
        numPlayersConnected--;
    });

    client.on('playerChoice', playerChoices => {
        gameState = { ...gameState, selectedQuestPlayers: playerChoices };
        client.broadcast.emit('playerChoices', gameState.selectedQuestPlayers);
    });

    client.on('confirmPlayerChoices', msg => {
        io.emit('showVotePhase', true);
    });

    client.on('voteChoice', choice => {
        // loop over to find the appropiate client
        console.log('received vote from' + client.id);
        for (playerName in gameState.players) {
            if (gameState.players[playerName].clientId === client.id) {
                gameState.players[playerName].vote = choice;
                gameState.approveRejectVotes.push(choice);
            }
        }

        const playerCount = Object.keys(gameState.players).length;
        console.log(playerCount, gameState.approveRejectVotes);
        if (gameState.approveRejectVotes.length === playerCount) {
            console.log('should show quest phase');
            let rejectVotes = gameState.approveRejectVotes.filter((vote) => vote === 'reject');
            if (rejectVotes.length < Math.ceil(playerCount / 2)) {
                // TODO only emit to clients players selected
                // io.emit('showQuestPhase', true);
                emitShowQuestPhase();
            } else {
                io.emit('failedTeamVote', undefined);
                gameState.failedTeamVotes++;
                endRound();
            }
        }
    })

    client.on('successFailConfirmed', (choice) => {
        let successFailVotes = gameState.successFailVotes
        successFailVotes.push(choice);
        if (successFailVotes.length === QUEST_INFO[5/*playerCount*/].quests[questNumber]) {
            const result = checkIfQuestPassFail(2, questNumber, gameState.successFailVotes);
            io.emit('questResult', { questNumber: questNumber, result: result })
            questPassFail[questNumber] = result;
            if (gameState.gameVariant.questSelecting) {

            } else {
                questNumber = (questNumber + 1) % 5;
                emitNumQuestParticipants(QUEST_INFO[5].quests[questNumber]);
            }
            endRound();
        }
        client.emit('showQuestPhase', false);
    });

    io.emit('gameStarted', true);


});


const port = 8888;
io.listen(port);
console.log('servering running...');


const emitNumQuestParticipants = (num) => {
    io.emit('numQuestParticipants', num);
}

const checkIfWinner = () => {
    if (gameState.failedTeamVotes === 5 || questPassFail.filter((quest) => quest === false).length === 3) {
        return 'Evil';
    }
};

const checkIfQuestPassFail = (numPlayers, questNumber, successFailVotes) => {
    const requiredFailVotes = (numPlayers > 6 && questNumber === 3) ? 2 : 1;
    let failVotes = 0;
    successFailVotes.forEach((vote) => vote === 'fail' ? failVotes++ : undefined);
    return failVotes < requiredFailVotes;
};

const endRound = () => {
    history.push(gameState);
    gameState = { ...gameState, approveRejectVotes: [], selectedQuestPlayers: [], successFailVotes: [] }
    // console.log(gameState);
    const winningTeam = checkIfWinner();
    if (winningTeam) {
        console.log(winningTeam);
    }
};

const shuffle = (array) => {
    // taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

}

const assignCharacters = (players) => {
    const characters = shuffle(presetCharacters0);
    let characterIndex = 0;
    // assign a character to players
    for (nameKey in players) {
        players[nameKey].character = characters[characterIndex++];
    }

    // tell each client who they can and cannot see
    for (nameKey in players) {
        postWhoClientSees(players[nameKey]);
    }

}

const postWhoClientSees = (client) => {
    const playersInfo = [];
    const players = gameState.players;
    for (nameKey in players) {
        if (client.clientId === players[nameKey].clientId || WHO_CHARACTER_CAN_SEE[client.character].includes(players[nameKey].character)) {
            // handle the case of percival seeing morgana as merlin
            if (client.character === 'percival' && players[nameKey].character === 'morgana') {
                playersInfo.push({ name: players[nameKey].name, cardImage: 'merlin' })
            } else {
                playersInfo.push({ name: players[nameKey].name, cardImage: players[nameKey].character })
            }
        } else {
            playersInfo.push({ name: players[nameKey].name, cardImage: 'loyalty-back' })
        }
    }
    io.to(`${client.clientId}`).emit('gamePlayers', playersInfo);
    // client.emit('players', testPlayers);
};

const emitShowQuestPhase = () => {

    const playersToEmitTo = gameState.selectedQuestPlayers;
    console.log(playersToEmitTo);
    for (player in gameState.players) {
        console.log(player, playersToEmitTo.includes(player))
        if (playersToEmitTo.includes(player)) {
            io.to(`${gameState.players[player].clientId}`).emit('showQuestPhase', true);
        }
    }
};