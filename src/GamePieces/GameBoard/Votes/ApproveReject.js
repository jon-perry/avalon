import React, { useState, useContext } from 'react';
import Approve from '../../Tokens/Approve';
import Reject from '../../Tokens/Reject';
import './ApproveReject.scss';
import { SocketContext } from '../../../App'


export default function ApproveReject({ setShowVotePhase }) {
    const [voteChoice, setVoteChoice] = useState();
    const socket = useContext(SocketContext);

    const handleClick = (choice) => {
        setVoteChoice(choice);
    }

    const handleConfirm = () => {
        socket.emit('voteChoice', voteChoice);
        setVoteChoice(undefined);
        setShowVotePhase(false);
    };

    // useEffect to serd handleConfirm to server


    return (
        <div className="approve-reject">
            <Approve orientation="front" onClick={() => handleClick('approve')} selected={voteChoice === 'approve'} />
            <Reject orientation="front" onClick={() => handleClick('reject')} selected={voteChoice === 'reject'} />
            {voteChoice &&
                <div>
                    <button onClick={() => handleConfirm()} className="confirm-vote-choice">Confirm Vote</button>
                </div>
            }
        </div>
    )
}