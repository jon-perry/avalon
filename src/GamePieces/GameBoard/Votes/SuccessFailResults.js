import React from 'react';
import Success from './Success';
import Fail from './Fail';
import Modal from 'react-modal';
import './SuccessFailResults.scss';

export default function ({ successFailVotes }) {
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
        <Modal isOpen={true} style={customStyles}>
            <div className="success-fail-results">
                {successFailVotes.map((result, index) => (
                    result === 'success' ?
                        (<Success key={index} orientation="front" />) :
                        (<Fail key={index * -1} orientation="front" />)
                ))}
            </div>
        </Modal>
    )
}