import React, { useState, useContext } from 'react';
import Approve from '../../Tokens/Approve';
import Reject from '../../Tokens/Reject';
import Modal from 'react-modal';
import './ApproveReject.scss';
import { SocketContext } from '../../../App'
import CookieService from '../../../Util/CookieService';
import Player from '../../Players/Player';
const CLIENT_ACTION = require('../../../AppConstants');

const ApproveRejectSelect = ({ questingPlayers, voteChoice, handleConfirm, handleClick }) => {
    // TODO: possibly handle highlighting actual quest leader
    return (
        <>
            <div className="questing-players">
                {
                    questingPlayers.map((questingPlayer, index) => (
                        <Player {...questingPlayer} id={null} questLeaderId={undefined} key={index} />
                    ))
                }
            </div>
            <div className="approve-reject">
                <Approve orientation="front" onClick={() => handleClick('approve')} selected={voteChoice === 'approve'} />
                <Reject orientation="front" onClick={() => handleClick('reject')} selected={voteChoice === 'reject'} />
                <button disabled={!voteChoice} onClick={handleConfirm} className="confirm-vote-choice">Confirm Vote</button>
            </div>
        </>
    )
}

export default function ApproveReject({ players, quest, selectedPlayers }) {
    const [voteChoice, setVoteChoice] = useState();
    const socket = useContext(SocketContext);
    const clientId = CookieService.GetPlayer().id;

    const handleClick = (choice) => {
        setVoteChoice(choice);
    }

    const handleConfirm = () => {
        socket.emit(CLIENT_ACTION.SELECT_APPROVE_REJECT, { id: clientId, voteChoice });
    };

    const questingPlayers = players
        .filter((player) => selectedPlayers.includes(player.id))
        .map((player) => ({
            ...player,
            id: undefined,
        }));

    const resultIndex = quest.approveRejectVotes.length - 1
    const clientHasVoted = quest.approveRejectVotes[resultIndex].some(({ id }) => clientId === id);

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

    return (
        <Modal ariaHideApp={false} isOpen={true} style={customStyles}>
            {
                (!clientHasVoted) ? (
                    <ApproveRejectSelect
                        questingPlayers={questingPlayers}
                        voteChoice={voteChoice}
                        handleConfirm={handleConfirm}
                        handleClick={handleClick}
                    />
                ) : (<div>Waiting for other players to vote</div>)
            }
        </Modal>
    )
}