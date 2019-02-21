import React, { Component } from 'react';
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

class Votes extends Component {

    render() {
        const { currentVoteIndex, incrementVoteIndex } = this.props
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
                <button onClick={incrementVoteIndex}>Click Me</button>
            </div>
        );
    }
}

export default Votes;