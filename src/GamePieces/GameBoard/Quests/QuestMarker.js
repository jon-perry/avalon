import React from 'react';

const questPass = require('../../../pictures/tokens/quest-pass(level-balance).png');
const questFail = require('../../../pictures/tokens/quest-fail(level-balance).png');

const QuestMarker = ({ questIndex, questPassed, gameQuestInfo }) => {
    const questImage = questPassed !== undefined ? (questPassed ? questPass : questFail) : undefined;
    const twoFailRequired = gameQuestInfo.twoFailRequired;
    const questPlayerRequirement = gameQuestInfo.quests[questIndex];
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