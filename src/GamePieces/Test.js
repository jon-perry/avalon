import React, { useState } from 'react';
import './Test.scss';

const loyaltyBack = require('../pictures/characters/loyalty-back.jpg');
const merlin = require('../pictures/characters/merlin.jpg');
// const io = require('socket.io-client');
// const socket = io('localhost:8888');

// socket.on('connect' , () => {
//     console.log(socket.connected);
// });

const playerInformations = [
    ['Alpha', merlin],
    ['Beta', loyaltyBack],
    ['Charlie', loyaltyBack],
    ['Delta', loyaltyBack],
    // ['Echo', loyaltyBack],
    // ['Foxtrot', loyaltyBack],
    // ['Gamma', loyaltyBack],
    // ['Hotel', loyaltyBack],
    // ['India', loyaltyBack],
    // ['Juliet', loyaltyBack],
]

const Cell = ({ name, image }) => (
    <div className="player">
        <div className="name">{name}</div>
        <div className="player-image">
            <img className="image" src={image} alt="Unknown" />
        </div>
    </div>
)

export default function Test(props) {
    const [numberCells, setNumberCells] = useState(5);
    return (
        <div className="grid" style={{gridTemplateColumns: `repeat(${playerInformations.length}, 1fr)`}}>
            {
                playerInformations.map(([name, image], index) => (<Cell key={name} name={name} image={image} />))
            }
        </div>
    );
}