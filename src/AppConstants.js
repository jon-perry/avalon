module.exports = {

        /* Lobbies Actions */
        ENTER_LOBBY: 'enterLobby',
        GET_LOBBIES: 'getLobbies',
        SET_LOBBIES: 'setLobbies',
        JOIN_LOBBY: 'joinLobby',
        JOINED_LOBBY: 'joinedLobby',
        IS_READY_CHANGE: 'isReadyChange',

        /* Login Actions */
        LOGIN: 'login',
        LOGGED_IN: 'loggedIn',
        CHECK_LOGGED_IN: 'checkLoggedIn',

        /* Game Actions */
        GAME_START: 'gameStart',
        GET_GAME: 'getGame',
        SET_GAME: 'setGame',
        PLAYER_SELECT: 'playerSelect',
        CONFIRM_SELECTED_PLAYERS: 'confirmSelectedPlayers',
        SET_GAME_PHASE: 'setGamePhase',
        SELECT_APPROVE_REJECT: 'selectApproveReject',
        CONFIRM_SUCCESS_FAIL: 'confirmSucessFail',


        /* Game Phases */
        GAME_PHASES: {
                PENDING_START: 'pendingStart',
                QUEST_SELECTION: 'questSelection',
                QUEST_PLAYER_SELECTION: 'questPlayerSelection',
                QUEST_PLAYER_APPROVAL: 'questPlayerApproval',
                RESULT_APPROVE_REJECT: 'resultApproveReject',
                QUEST: 'quest',
                ASSASSIN: 'assassin',
                IS_WINNER: 'isWinner',
        }

        // AUTHORIZE: 'authorize',
        // CONFIRM_SELECTED_PLAYERS: 'confirmSelectedPlayers',
        // FAILED_TEAM_VOTE: 'failedTeamVote',
        // GAME_PLAYERS: 'gamePlayers',
        // GAME_STARTED: 'gameStarted',
        // GET_QUEST_LEADER: 'getQuestLeader',
        // IS_AUTHORIZED: 'isAuthorized',
        // IS_QUEST_LEADER: 'isQuestLeader',
        // NUM_QUEST_PARTICIPANTS: 'numQuestParticipants',
        // PLAYER_SELECT: 'playerSelect',
        // QUEST_LEADER_CHANGED: 'questLeaderChanged',
        // QUEST_RESULT: 'questResult',
        // SHOW_QUEST_PHASE: 'showQuestPhase',
        // SHOW_VOTE_PHASE: 'showVotePhase',
        // SUCCESS_FAIL_CONFIRMED: 'successFailConfirmed',
}