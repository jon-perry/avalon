import React from 'react';
import Player from '../../Players/Player'
import Approve from '../../Tokens/Approve';
import Reject from '../../Tokens/Reject';
import Modal from 'react-modal'
import './ApproveRejectResult.scss';

export default function ApproveRejectResult({ players, quest }) {
    const results = quest.approveRejectVotes[quest.approveRejectVotes.length - 1];
    const playerData = players.map((player) => {
        const voteChoice = results.find((result) => result.id === player.id).voteChoice;
        return { ...player, id: undefined, voteChoice: voteChoice }
    });

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    return (
        <Modal isOpen={true} style={customStyles}>
            <div className="approve-reject-result">
                {
                    playerData.map((player, index) => (
                        <div className="player-approve-reject" key={index}>
                            <Player {...player} />
                            {(player.voteChoice === 'approve') ? (<Approve orientation="front" />) : <Reject orientation="front" />}
                        </div>
                    ))

                }
            </div>
        </Modal>
    )
}