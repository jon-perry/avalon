import React, { useState } from "react";
import Success from './Success'
import Fail from './Fail'
import './SuccessFail.scss';


export default function ({ isOnQuest }) {
  const [decision, setDecision] = useState(undefined);
  const [onQuest, setIsOnQuest] = useState(isOnQuest);
  
  const onClick = (choice) => {
    setDecision(choice);
  }

  const handleConfirm = () => {
    setIsOnQuest(false);
    // let server know choice made and to update us to not being on quest
  }


  return (
    (isOnQuest && onQuest) ?
      <div className="success-fail-vote">
        <div className="title">Vote Success or Fail</div>
        <Success orientation="front" onClick={() => onClick('success')} selected={decision === 'success'} />
        <Fail orientation="front" onClick={() => onClick('fail')} selected={decision === 'fail'} />
        {decision && <button onClick={() => handleConfirm()} style={{ gridRow: "2 / 2" }}>Confim</button>}
      </div> : null
  );
}
