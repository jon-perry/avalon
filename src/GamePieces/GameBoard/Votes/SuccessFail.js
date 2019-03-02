import React from "react";
import Success from './Success'
import Fail from './Fail'
import './SuccessFail.scss';


export default function(props) {
  return (
      <div className="success-fail-vote">
          <div className="title">Vote Success or Fail</div>
          <Success orientation="front"/>
          <Fail orientation="front"/>
      </div>
  );
}
