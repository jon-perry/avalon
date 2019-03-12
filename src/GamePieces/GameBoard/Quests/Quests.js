import React, { Component } from 'react';
import QuestMarker from './QuestMarker';
import './Quests.scss'

const gameQuestInfo = require('./QuestInfo.json');

class Quests extends Component {
    handleClick = (event) => {
        console.log(event.target);
    }
    render() {
        const { quests, playerCount } = this.props;
        return (
            <div className="quests">
                <div className="quest-title">QUESTS</div>
                <div className="quest-markers">
                    {
                       quests.map((quest, index) => (
                            <QuestMarker
                                key={index}
                                questIndex={index}
                                questPassed={quest.passFailed}
                                numberOfParticipants={quest.numberOfParticipants}
                                twoFailRequired={quest.twoFailRequired}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Quests;