import React from 'react';
import gameQuestInfo from './QuestInfo';

const questPass = require('../../../pictures/tokens/quest-pass(level-balance).png');
const questFail = require('../../../pictures/tokens/quest-fail(level-balance).png');

// const gameQuestInfo = require('./QuestInfo').default;

const QuestMarker = ({ questIndex, questPassed, playerCount, handleQuestClick }) => {
    const questImage = questPassed !== undefined ? (questPassed ? questPass : questFail) : undefined;
    const twoFailRequired = gameQuestInfo[playerCount].twoFailRequired;
    const questPlayerRequirement = gameQuestInfo[playerCount].quests[questIndex];
    return (
        <div className="quest-marker">
            {questImage && (<img className="quest-result" src={questImage} alt={`Quest ${questPassed ? 'Passed' : 'Failed'}`} />)}
            {(questIndex === 3 && twoFailRequired) && (<div className='two-fail-quest'>Two fails required</div>)}
            {(questImage === undefined) && (
                <div className="empty-quest-marker">
                    <div className="quest-number">Quest {questIndex + 1}</div>
                    <div className="quest-player-requirement">{questPlayerRequirement}</div>
                </div>
            )}
        </div>
    )
}

export default QuestMarker;