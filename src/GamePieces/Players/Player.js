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

export default function Player({ gamePhase, name, id, character, alignment, selectedPlayers = [], questLeaderId, numberOfParticipants }) {
    const socket = useContext(SocketContext);

    const currentPlayer = CookieService.GetPlayer();

    const handleSelectPlayer = (selectedPlayerId) => {
        if ((currentPlayer.id === questLeaderId)) {
            if (gamePhase === APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION) {
                socket.emit(APP_CONSTANTS.PLAYER_SELECT, { selectedPlayerId });
            } else if (gamePhase === APP_CONSTANTS.GAME_PHASES.ASSASSIN) {
                // don't allow the assassin to select themselves
                if (currentPlayer.id === id) {
                    return;
                }
                socket.emit(APP_CONSTANTS.ASSASSIN_PLAYER_SELECT, { selectedPlayerId });
            }
        }
    }

    const handleConfirmSelection = () => {
        if (gamePhase === APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION) {
            socket.emit(APP_CONSTANTS.CONFIRM_SELECTED_PLAYERS, { id });
        } else if (gamePhase === APP_CONSTANTS.GAME_PHASES.ASSASSIN) {
            socket.emit(APP_CONSTANTS.CONFIRM_ASSASSIN_SELECTION, { id })
        }
    };

    const classes = ['player'];
    if (selectedPlayers.includes(id)) {
        classes.push('selected');
    }
    if (id === questLeaderId) {
        classes.push('quest-leader');
    }

    return (
        <div className={classes.join(' ')}>
            <div className="player-content" onClick={() => handleSelectPlayer(id)}>
                <div className={"name" + (alignment ? ` ${alignment}` : '')}>{name}</div>
                <div className="card-image">
                    <CardImage character={character} alignment={alignment} />
                </div>
            </div>
            {
                ((currentPlayer.id === questLeaderId) && (id === currentPlayer.id)) && (
                    <button
                        className="confirm-quest-players"
                        onClick={() => handleConfirmSelection()}
                        disabled={(selectedPlayers.length !== numberOfParticipants) ||
                            ((gamePhase !== APP_CONSTANTS.GAME_PHASES.QUEST_PLAYER_SELECTION) && (gamePhase !== APP_CONSTANTS.GAME_PHASES.ASSASSIN))}
                    >
                        Confirm
                    </button>
                )
            }
        </div>
    )
}
