import React, { useState } from 'react';
import Approve from '../../Tokens/Approve';
import Reject from '../../Tokens/Reject'

export default function VoteResults({ players, showVotes }) {
    return (
        (
            <div className="vote-results">
                {showVotes && players.map((player, index) => (
                    player.vote === 'approve' ?
                        (<Approve key={index} orientation="front" />) :
                        (<Reject key={index} orientation="front" />)
                ))}
            </div>
        )
    )
}