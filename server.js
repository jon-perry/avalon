const QUEST_INFO = require('./src/GamePieces/GameBoard/Quests/QuestInfo');
const WHO_CHARACTER_CAN_SEE = require('./src/GamePieces/Characters/WhoCharacterCanSee');
const CHARACTER_GAME_VARIANTS = require('./src/GamePieces/Characters/GameVariants');
const io = require('socket.io')();
const CLIENT_ACTION = require('./src/AppConstants');
const GAME = require('./src/GamePieces/Game');
let ids = [];
// need to set up to have playersInformation in players to keep track of who voted for what as well as their character

const PLAYER_COUNT = 5;

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

const game = new GAME(undefined, presetCharacters0);
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
            assignCharacters(gameState.players);
            emitNumQuestParticipants(QUEST_INFO[5].quests[0]);
        }
    });

    client.on('disconnect', () => {

    });

    // TODO server side checks
    client.on(CLIENT_ACTION.PLAYER_SELECT, playerChoices => {
        // gameState = { ...gameState, selectedQuestPlayers: playerChoices };
        game.selectedQuestPlayers(playerChoices);
        client.broadcast.emit('playerChoices', game.getSelectedQuestPlayers());
    });

    client.on(CLIENT_ACTION.CONFIRM_SELECTED_PLAYERS, msg => {
        io.emit('showVotePhase', msg);
    });


    // TODO ensure each client can only vote once
    client.on(CLIENT_ACTION.VOTE_CONFIRMATION, vote => {
        // loop over to find the appropiate client
        console.log('received vote from' + client.id);
        // for (playerName in gameState.players) {
        //     if (gameState.players[playerName].clientId === client.id) {
        //         gameState.players[playerName].vote = choice;
        //         gameState.approveRejectVotes.push(choice);
        //     }
        // }
        const players = game.getPlayers()
        const index = players.findIndex((player) => player.clientId === client.id);
        players[index].vote = vote;
        game.addApproveRejectVote(vote);
        game.setPlayers(players);


        if (game.getApproveRejectVotes().length === players.length) {
            const rejectVotes = game.getApproveRejectVotes().filter((vote) => vote === 'reject');
            if (rejectVotes.length < Math.ceil(players.length / 2)) {
                emitShowQuestPhase();
            } else {
                game.incrementFailedTeamVotes();
                io.emit(CLIENT_ACTION.FAILED_TEAM_VOTE, game.getFailedTeamVotes());
                endRound();
            }
        }
        // const playerCount = Object.keys(gameState.players).length;
        // console.log(playerCount, gameState.approveRejectVotes);
        // if (gameState.approveRejectVotes.length === playerCount) {
        //     console.log('should show quest phase');
        //     let rejectVotes = gameState.approveRejectVotes.filter((vote) => vote === 'reject');
        //     if (rejectVotes.length < Math.ceil(playerCount / 2)) {
        //         // TODO only emit to clients players selected
        //         // io.emit('showQuestPhase', true);
        //         emitShowQuestPhase();
        //     } else {
        //         io.emit(CLIENT_ACTION.FAILED_TEAM_VOTE, undefined);
        //         gameState.failedTeamVotes++;
        //         endRound();
        //     }
        // }
    })

    client.on(CLIENT_ACTION.SUCCESS_FAIL_CONFIRMED, (vote) => {
        //     let successFailVotes = gameState.successFailVotes
        //     successFailVotes.push(choice);
        //     if (successFailVotes.length === QUEST_INFO[PLAYER_COUNT].quests[questNumber]) {
        //         const result = checkIfQuestPassFail(2, questNumber, gameState.successFailVotes);
        //         io.emit(CLIENT_ACTION.QUEST_RESULT, { questNumber: questNumber, result: result })
        //         questPassFail[questNumber] = result;
        //         if (gameState.gameVariant.questSelecting) {

        //         } else {
        //             questNumber = (questNumber + 1) % 5;
        //             emitNumQuestParticipants(QUEST_INFO[5].quests[questNumber]);
        //         }
        //         endRound();
        //     }
        //     client.emit(CLIENT_ACTION.SHOW_QUEST_PHASE, false);
        // });

        // io.emit(CLIENT_ACTION.GAME_STARTED, true);
        game.addSuccessFailVote(vote);
        if (game.getSuccessFailVotes().length === QUEST_INFO[game.getPlayers().length].quests[game.getQuestNumber]) {
            const result = game.determineQuestResult();
            io.emit(CLIENT_ACTION.QUEST_RESULT, {questNumber: game.getQuestNumber(), result: result});
            const newResults = game.getQuestPassFailResults();
            newResults[game.getQuestNumber()] = result;
            game.setQuestPassFailResults(newResults);

            //TODO
            if (game.gameVariant.questSelecting) {

            } else {
                game.incrementQuestNumber();
                //TODO emit numquest participants
            }
            
        }


    });


    const port = 8888;
    io.listen(port);
    console.log('servering running...');


    const emitNumQuestParticipants = (num) => {
        io.emit(CLIENT_ACTION.NUM_QUEST_PARTICIPANTS, num);
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
            emitWhoClientSees(players[nameKey]);
        }

    }

    const emitWhoClientSees = (client) => {
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
        io.to(`${client.clientId}`).emit(CLIENT_ACTION.GAME_PLAYERS, playersInfo);
        // client.emit('players', testPlayers);
    };

    const emitShowQuestPhase = () => {

        const playersToEmitTo = gameState.selectedQuestPlayers;
        console.log(playersToEmitTo);
        for (player in gameState.players) {
            console.log(player, playersToEmitTo.includes(player))
            if (playersToEmitTo.includes(player)) {
                io.to(`${gameState.players[player].clientId}`).emit(CLIENT_ACTION.SHOW_QUEST_PHASE, true);
            }
        }
    };