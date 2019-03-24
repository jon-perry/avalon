import React, { useState, useContext } from "react";
import Success from './Success'
import Fail from './Fail'
import './SuccessFail.scss';
import { SocketContext } from "../../../App";
import Modal from 'react-modal';
import CookieService from "../../../Util/CookieService";
const APP_CONSTANTS = require('../../../AppConstants');


export default function ({ isOnQuest, isGood }) {
  const clientPlayer = CookieService.GetPlayer();
  const socket = useContext(SocketContext);
  const [choice, setDecision] = useState(undefined);
  const [hasChosen, setHasChosen] = useState(false);

  const onClick = (choice) => {
    setDecision(choice);
  }



  const handleConfirm = () => {
    const id = clientPlayer.id;
    socket.emit(APP_CONSTANTS.CONFIRM_SUCCESS_FAIL, { choice, id });
    setHasChosen(true);
    setDecision(undefined);
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };



  return (
    isOnQuest &&
    (
      <Modal ariaHideApp={false} isOpen={true} style={customStyles}>
        {
          (!hasChosen) ?
            <div className="success-fail-vote">
              <div className="title">Vote Success or Fail</div>
              <Success isGood={isGood} orientation="front" onClick={() => onClick('success')} selected={choice === 'success'} />
              {!isGood && <Fail orientation="front" onClick={() => onClick('fail')} selected={choice === 'fail'} />}
              <button disabled={!choice} onClick={() => handleConfirm()}>Confim</button>
            </div> :
            <div>Waiting for other players</div>
        }
      </Modal>
    )
  );
}
