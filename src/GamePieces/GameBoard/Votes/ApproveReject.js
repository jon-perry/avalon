import React, { useState, useEffect } from 'react';
import Approve from '../../Tokens/Approve';
import Reject from '../../Tokens/Reject';
import './ApproveReject.scss';


export default function ApproveReject({ socket }) {
    const [voteChoice, setVoteChoice] = useState();

    const handleClick = (choice) => {
        setVoteChoice(choice);
    }
    
    const handleConfirm = () => {
        socket.emit('voteChoice', voteChoice);
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