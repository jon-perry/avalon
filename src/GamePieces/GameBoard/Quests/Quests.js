import React from 'react';
import QuestMarker from './QuestMarker';
import './Quests.scss'

function Quests({ quests }) {
    
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

export default Quests;