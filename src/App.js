import React, { Component } from 'react';
import GameBoard from './GamePieces/GameBoard/GameBoard';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameBoard playerCount={10}/>
      </div>
    );
  }
}

export default App;
