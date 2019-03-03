import React, { useState, useEffect } from "react";
import Success from './Success'
import Fail from './Fail'
import './SuccessFail.scss';


export default function ({socket, isOnQuest, isGood }) {
  const [decision, setDecision] = useState(undefined);
  
  const onClick = (choice) => {
    setDecision(choice);
  }



  const handleConfirm = () => {
    // let server know choice made and to update us to not being on quest
    socket.emit('successFailConfirmed', decision);
    setDecision(undefined);
  }


  return (
    isOnQuest ?
      <div className="success-fail-vote">
        <div className="title">Vote Success or Fail</div>
        <Success orientation="front" onClick={() => onClick('success')} selected={decision === 'success'} />
        {!isGood && <Fail orientation="front" onClick={() => onClick('fail')} selected={decision === 'fail'} />}
        {decision && <button onClick={() => handleConfirm()} style={{ gridRow: "2 / 2" }}>Confim</button>}
      </div> : null
  );
}
