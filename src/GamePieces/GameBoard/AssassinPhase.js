import React from 'react';
import Modal from 'react-modal';
import Player from '../Players/Player';
import './AssassinPhase.scss';

export default function ({ players, gamePhase, selectedPlayers = [], questLeaderIndex }) {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    }; // TODO: Fix me up
    const activePlayer = players[questLeaderIndex];
    const playersToSelectFrom = players.filter((player) => ((player.alignment !== 'evil') || 
                                                            (player.character === 'assassin') || 
                                                            (player.id === activePlayer.id)));
    return (
        <Modal ariaHideApp={false} isOpen={true} style={customStyles}>
            <div className="assassin-targets">
                {
                    playersToSelectFrom.map((player, index) =>
                        (<Player
                            index={index}
                            name={player.name}
                            gamePhase={gamePhase}
                            selectedPlayers={selectedPlayers}
                            questLeaderId={activePlayer.id}
                            numberOfParticipants={1}
                            character={player.character}
                            alignment={player.alignment}
                            id={player.id}
                        />))
                }
            </div>
        </Modal>
    )

}