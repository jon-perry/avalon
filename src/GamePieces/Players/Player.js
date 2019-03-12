import React, { useContext } from 'react';
import { SocketContext } from '../../App';
import CookieService from '../../Util/CookieService';
import './Player.scss';
const APP_CONSTANTS = require('../../AppConstants');

const CardImage = ({ character, alignment }) => {
    if (character) {
        const src = require(`../../pictures/characters/${character}.jpg`);
        return (<img src={src} alt="character-card" title={character} />)
    } else if (alignment) {
        const src = require(`../../pictures/characters/loyalty-back.jpg`);
        return (<img src={src} alt="character-card" className={alignment} />)
    } else {
        const src = require(`../../pictures/characters/loyalty-back.jpg`);
        return (<img src={src} alt="character-card" />)
    }
};

export default function Player({ name, id, character, alignment, selectedPlayers = [], questLeaderId, numberOfParticipants }) {
    const socket = useContext(SocketContext);

    const currentPlayer = CookieService.GetPlayer();

    const handleSelectPlayer = (selectedPlayerId) => {
        if (currentPlayer.id === questLeaderId) {
            socket.emit(APP_CONSTANTS.PLAYER_SELECT, { selectedPlayerId });
        }
    }

    const handleConfirmSelection = () => {
        socket.emit(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, { id });
    };

    const classes = ['player'];
    if (selectedPlayers.includes(id)) {
        classes.push('selected');
    }
    if (id === questLeaderId) {
        classes.push('quest-leader');
    }

    return (
        <>
            <div className={classes.join(' ')} onClick={() => handleSelectPlayer(id)}>
                <div className={"name" + (alignment ? ` ${alignment}` : '')}>{name}</div>
                <div className="card-image">
                    <CardImage character={character} alignment={alignment} />
                </div>

            </div>
            {((currentPlayer.id === questLeaderId) && (id === currentPlayer.id)) && (
                <button
                    className="confirm-quest-players"
                    onClick={() => handleConfirmSelection()}
                    disabled={selectedPlayers.length !== numberOfParticipants}
                >
                    Confirm
                </button>
            )}
        </>
    )
}

