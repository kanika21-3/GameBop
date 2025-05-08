import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TicTacToe from './pages/TicTacToe';
import EvenOdd from './pages/EvenOdd';
import RockPaperScissors from './pages/RockPaperScissors';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/even-odd" element={<EvenOdd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
      </Routes>
    </Router>
  );
}

export default App;
