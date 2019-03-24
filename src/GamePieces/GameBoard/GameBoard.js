import React from 'react';
import './GameBoard.scss';
import Votes from './Votes/Votes.js';
import Quests from './Quests/Quests';
import PlayerInformations from '../Players/PlayerInformations';

const Details = ({ playerCount, questLeader, gameCharacters }) => {

    const names = gameCharacters.map((character) => character.match(/([A-Z]+)/gi).join(' ').toUpperCase());

    return (
        <div className="details">
            <div className="player-count">{playerCount} Players</div>
            <div className="quest-leader">{`Quest Leader: ${questLeader}`}</div>
            <div className="game-characters" title={names.join(', ')}>{names.join(', ')}</div>
        </div>
    );
}

export default function GameBoard({ game }) {
    const {
        players,
        quests,
        failedVotes,
        questLeaderIndex,
        selectedPlayers,
        currentQuest,
        phase
    } = game;
    const questLeader = players[questLeaderIndex]

    return (
        <div className="game-board" >
            <PlayerInformations
                players={players}
                questLeaderIndex={questLeaderIndex}
                selectedPlayers={selectedPlayers}
                numberOfParticipants={currentQuest.numberOfParticipants}
                gamePhase={phase}
            />
            <Quests quests={quests} playerCount={players.length} />
            <Votes numFailedVotes={failedVotes} />
            <Details playerCount={players.length} questLeader={questLeader.name} gameCharacters={game.characters}/>
        </div>
    );
}
