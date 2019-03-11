import React, { Component } from 'react';
import QuestMarker from './QuestMarker';
import './Quests.scss'

const gameQuestInfo = require('./QuestInfo.json');

class Quests extends Component {
    handleClick = (event) => {
        console.log(event.target);
    }
    render() {
        const { questPassFail, playerCount } = this.props;
        console.log({playerCount});
        return (
            <div className="quests">
                <div className="quest-title">QUESTS</div>
                <div className="quest-markers">
                    {
                        [0, 1, 2, 3, 4].map((questIndex) => (
                            <QuestMarker
                                key={questIndex}
                                questIndex={questIndex}
                                questPassed={questPassFail[questIndex]}
                                gameQuestInfo={gameQuestInfo[playerCount]}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Quests;