const QUEST_INFO = require('./src/GamePieces/GameBoard/Quests/QuestInfo');
const WHO_CHARACTER_CAN_SEE = require('./src/GamePieces/Characters/WhoCharacterCanSee');
const CHARACTER_GAME_VARIANTS = require('./src/GamePieces/Characters/GameVariants');
const io = require('socket.io')();
const CLIENT_ACTION = require('./src/AppConstants');
const GAME = require('./src/GamePieces/Game');
let ids = [];
// need to set up to have playersInformation in players to keep track of who voted for what as well as their character

const PLAYER_COUNT = 5;

let PRESET_CHARACTERS = CHARACTER_GAME_VARIANTS[5][2];
const defaultGameVariant = { ladyInTheWater: false, questSelecting: false, characters: PRESET_CHARACTERS }

const game = new GAME(undefined, PRESET_CHARACTERS);
console.log(game.getCharacters());

const questPassFail = [undefined, undefined, undefined, undefined, undefined];

let history = [];
let questNumber = 0;
let numPlayersConnected = 0;
io.on('connection', (client) => {
    // handles client disconnecting then reconnecting -- uses their name (which will be unique) to update them in the players object -- needs
    client.on(CLIENT_ACTION.LOGIN, info => {
        const existIndex = game.getPlayers().findIndex((player) => player.name === info.name.value);
        if (existIndex !== -1) {
            const players = game.getPlayers();
            players[existIndex] = { ...players[existIndex], clientId: client.id };
            game.setPlayers(players);
            numPlayersConnected++;
        } else {
            game.addPlayer({ name: info.name.value, clientId: client.id, character: undefined });
            numPlayersConnected++;
        }



        console.log(game.getPlayers());
        client.emit(CLIENT_ACTION.LOGGED_IN, true);
        console.log(numPlayersConnected);
        if (numPlayersConnected % 5 === 0) {
            assignCharacters();
            emitNumQuestParticipants(QUEST_INFO[5].quests[0]);
        }
    });

    client.on('disconnect', () => {

    });

    // TODO server side checks
    client.on(CLIENT_ACTION.PLAYER_SELECT, playerChoices => {
        game.setSelectedQuestPlayers(playerChoices);
        client.broadcast.emit(CLIENT_ACTION.PLAYER_SELECT, game.getSelectedQuestPlayers());
    });

    client.on(CLIENT_ACTION.CONFIRM_SELECTED_PLAYERS, msg => {
        io.emit('showVotePhase', msg);
    });


    // TODO ensure each client can only vote once
    client.on(CLIENT_ACTION.VOTE_CONFIRMATION, vote => {
        const players = game.getPlayers();
        const index = players.findIndex((player) => player.clientId === client.id);
        players[index].vote = vote;
        game.addApproveRejectVote(vote);
        game.setPlayers(players);


        if (game.getApproveRejectVotes().length === players.length) {
            const rejectVotes = game.getApproveRejectVotes().filter((vote) => vote === 'reject');
            if (rejectVotes.length < Math.ceil(players.length / 2)) {
                emitShowQuestPhase();
            } else {
                io.emit(CLIENT_ACTION.FAILED_TEAM_VOTE, game.getFailedTeamVotes());
                game.incrementFailedTeamVotes();
                game.endRound();
            }
        }
    });

    // TODO server side checks
    client.on(CLIENT_ACTION.SUCCESS_FAIL_CONFIRMED, (vote) => {
        game.addSuccessFailVote(vote);
        client.emit(CLIENT_ACTION.SHOW_QUEST_PHASE, false);
        if (game.getSuccessFailVotes().length === QUEST_INFO[game.getPlayers().length].quests[game.getQuestNumber()]) {
            const result = game.determineQuestResult();
            io.emit(CLIENT_ACTION.QUEST_RESULT, { questNumber: game.getQuestNumber(), result: result });
            const newResults = game.getQuestPassFailResults();
            newResults[game.getQuestNumber()] = result;
            game.setQuestPassFailResults(newResults);

            // TODO if time permits
            if (false/*game.gameVariant.questSelecting*/) {

            } else {
                game.endRound();
                game.incrementQuestNumber();
                //TODO emit numquest participants
                emitNumQuestParticipants(QUEST_INFO[PLAYER_COUNT].quests[game.getQuestNumber()]);
            }
            game.endRound();
        }


    });
});

const port = 8888;
io.listen(port);
console.log('server running...');



const emitNumQuestParticipants = num => {
    io.emit(CLIENT_ACTION.NUM_QUEST_PARTICIPANTS, num);
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

};

const assignCharacters = () => {
    const characters = shuffle(PRESET_CHARACTERS);
    const newStatePlayers = game.getPlayers();

    newStatePlayers.map((player, index) => player.character = characters[index]);
    game.setPlayers(newStatePlayers);

    // tell each client who they can and cannot see
    newStatePlayers.forEach(player => emitWhoClientSees(player));

};

const emitWhoClientSees = (client) => {
    const playersInfo = [];
    const players = game.getPlayers();

    players.forEach(player => {
        // clients always know themselves as well as the possibility of others
        if (client.clientId === player.clientId || WHO_CHARACTER_CAN_SEE[client.character].includes(player.character)) {
            if (client.character === 'percival' && player.character === 'morgana') {
                playersInfo.push({ name: player.name, cardImage: 'merlin' })
            } else {
                playersInfo.push({ name: player.name, cardImage: player.character })
            }
        } else {
            playersInfo.push({ name: player.name, cardImage: 'loyalty-back' });
        }

    });
    io.to(`${client.clientId}`).emit(CLIENT_ACTION.GAME_PLAYERS, playersInfo);
};

const emitShowQuestPhase = () => {
    const playersToEmitTo = game.getSelectedQuestPlayers();

    game.getPlayers().forEach(player => {
        if (playersToEmitTo.includes(player.name)) {
            io.to(`${player.clientId}`).emit(CLIENT_ACTION.SHOW_QUEST_PHASE, true);
        }
    });
}