import React, { useState, useEffect } from 'react';
import './Votes.scss'

const voteMarker = require("../../../pictures/tokens/vote-marker.png");

const VoteMarker = ({ currentVoteIndex, voteIndex }) => (
    <div className="vote-marker">
        {
            (currentVoteIndex === voteIndex) ? (<img src={voteMarker} alt="vote-marker" />) :
                (<div className="empty-vote-marker">{voteIndex + 1}</div>)
        }
    </div>
)

export default function Votes({ socket }) {
    const currentVoteIndex = useVoteIndex(socket);
    return (
        <div className="votes">
            <div className="vote-title">NUMBER OF FAILED VOTES</div>
            <div className="vote-markers">
                {
                    [0, 1, 2, 3, 4].map((voteIndex) => (
                        <VoteMarker key={voteIndex} currentVoteIndex={currentVoteIndex} voteIndex={voteIndex} />
                    ))
                }
            </div>
        </div>
    );
}


const useVoteIndex = (socket) => {
    const [voteIndex, setVoteIndex] = useState(-1);

    useEffect(() => {
        const handle = msg => {
            setVoteIndex(voteIndex + 1)
        };
        socket.on('failedTeamVote', handle);
        return () => socket.removeListener('failedTeamVote', handle);
    }, [voteIndex])

    return voteIndex;
}