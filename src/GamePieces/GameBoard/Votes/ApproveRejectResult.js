import React from 'react';
import Player from '../../Players/Player'
import Approve from '../../Tokens/Approve';
import Reject from '../../Tokens/Reject';
import Modal from 'react-modal'
import './ApproveRejectResult.scss';

export default function ApproveRejectResult({ players, results }) {
    const playerData = players.map((player) => {
        const voteChoice = results.find((result) => result.id === player.id).voteChoice;
        return { ...player, id: undefined, voteChoice: voteChoice }
    });

    return (
        <Modal isOpen={true}>
            <div className="approve-reject-result">
                {
                    playerData.map((player, index) => (
                        <React.Fragment key={index}>
                            <Player {...player} />
                            {(player.voteChoice === 'approve') ? (<Approve orientation="front" />) : <Reject orientation="front" />}
                        </React.Fragment>
                    ))

                }
            </div>
        </Modal>
    )
}