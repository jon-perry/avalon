import React from 'react';
import Player from './Player';
import './PlayerInformations.scss';
// import ApproveReject from '../GameBoard/Votes/ApproveReject';

export default function PlayerInformation({ gamePhase, players, questLeaderIndex, selectedPlayers, numberOfParticipants }) {
    const questLeaderId = players[questLeaderIndex].id;
    return (
        <div className="player-informations" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
            {players.map((player, index) => {
                return (
                    <Player
                        key={player.id}
                        {...player}
                        questLeaderId={questLeaderId}
                        selectedPlayers={selectedPlayers}
                        numberOfParticipants={numberOfParticipants}
                        gamePhase={gamePhase}
                    />
                )
            })}
        </div>
    );
}
