import React from 'react';
import Success from './Success';
import Fail from './Fail';
import './SuccessFailResults.scss';

export default function ({ resultsFinished, results }) {

    return (
        resultsFinished ?
        <div className="success-fail-results">
            {results.map((result, index) => (
                result === 'success' ?
                    (<Success key={index} orientation="front"/>) :
                    (<Fail key={index * -1} orientation="front"/>)
            ))}
        </div> :
        // fix this to display results after certain timeout
        <div className="success-fail-results">
                {[0, 1, 2].map((num, index) => <Success key={index} orientation="back"/>)}
        </div>
    )
}