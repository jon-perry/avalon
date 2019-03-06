import React, { useState, useEffect, useContext } from 'react';
import './Votes.scss';
import { SocketContext } from '../../../App';
const CLIENT_ACTION = require('../../../AppConstants');

const voteMarker = require("../../../pictures/tokens/vote-marker.png");

const VoteMarker = ({ currentVoteIndex, voteIndex }) => (
    <div className="vote-marker">
        {
            (currentVoteIndex === voteIndex) ? (<img src={voteMarker} alt="vote-marker" />) :
                (<div className="empty-vote-marker">{voteIndex + 1}</div>)
        }
    </div>
)

export default function Votes() {
    const socket = useContext(SocketContext);
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
        socket.on(CLIENT_ACTION.FAILED_TEAM_VOTE, handle);
        return () => socket.removeListener(CLIENT_ACTION.FAILED_TEAM_VOTE, handle);
    }, [voteIndex])

    return voteIndex;
}