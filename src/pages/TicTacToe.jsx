import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../Firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import gameicon from '../assets/gameicon.png';
import bgImage from '../assets/background.jpg';

// Simple Navbar component
const Navbar = () => (
  <nav className="w-full bg-[#7e4a35] text-white px-6 py-4 flex justify-between items-center">
    <img src={gameicon} alt="icon" className="w-40 h-10 object-cover shadow-lg" />
    <Link to="/" className="bg-[#4f3222] hover:bg-[#8b6f47] font-arcade px-4 py-2 rounded text-white font-arcade ">
      Home
    </Link>
  </nav>
);

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null); // 'X' or 'O'
  const [computerSymbol, setComputerSymbol] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [lastScore, setLastScore] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const scores = docSnap.data().scores || {};
          setLastScore(scores.ticTacToe ?? null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isPlayerTurn && gameStarted && !winner) {
      setTimeout(() => makeComputerMove(), 500); // Delay for realism
    }
  }, [isPlayerTurn, gameStarted]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner || round >= 3) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    checkOutcome(newBoard, playerSymbol, true);
  };

  const makeComputerMove = () => {
    const emptyIndices = board.map((val, i) => val === null ? i : null).filter(v => v !== null);
    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = computerSymbol;
    setBoard(newBoard);
    checkOutcome(newBoard, computerSymbol, false);
  };

  const checkOutcome = (updatedBoard, symbol, isPlayer) => {
    const win = calculateWinner(updatedBoard);
    if (win) {
      setWinner(win);
      if (isPlayer && win === playerSymbol) {
        setScore(prev => prev + 1);
      }
      setTimeout(() => nextRound(), 1000);
    } else if (!updatedBoard.includes(null)) {
      setWinner("Draw");
      setTimeout(() => nextRound(), 1000);
    } else {
      setIsPlayerTurn(!isPlayer); // Switch turn
    }
  };

  const nextRound = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setRound(prev => prev + 1);
    setIsPlayerTurn(true);

    if (round === 2 && user) {
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, {
        scores: {
          ticTacToe: score,
        }
      }, { merge: true });
    }
  };

  const startGame = () => {
    if (!playerSymbol) {
      alert("Please choose X or O to start.");
      return;
    }
    setComputerSymbol(playerSymbol === 'X' ? 'O' : 'X');
    setGameStarted(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayerSymbol(null);
    setComputerSymbol(null);
    setGameStarted(false);
    setWinner(null);
    setScore(0);
    setRound(0);
    setIsPlayerTurn(true);
  };

  return (
    <>
      <Navbar />
      <div
    className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
     >
      
        <h1 className="text-4xl font-arcade mb-4 ">Tic Tac Toe</h1>
        
        {user && lastScore !== null && (
          <div className="text-lg font-arcade text-gray-700 mb-2">
            Last Score: <strong>{lastScore}/3</strong>
          </div>
        )}

        {!gameStarted && (
          <>
            <div className="flex gap-4 mb-4 font-arcade ">
              <button
                onClick={() => setPlayerSymbol('X')}
                className={`px-4 py-2 rounded ${playerSymbol === 'X' ? 'bg-[#4f3222] text-white' : 'bg-[#8b6f47]'}`}
              >
                Play as X
              </button>
              <button
                onClick={() => setPlayerSymbol('O')}
                className={`px-4 py-2 rounded ${playerSymbol === 'O' ? 'bg-[#4f3222] text-white' : 'bg-[#8b6f47]'}`}
              >
                Play as O
              </button>
            </div>
            <button
              onClick={startGame}
              className="bg-[#4f3222] text-white font-arcade px-6 py-3 rounded mb-6"
            >
              Start Game
            </button>
          </>
        )}

        {gameStarted && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className="w-20 h-20 text-2xl font-arcade font-bold bg-white rounded shadow"
                >
                  {cell}
                </button>
              ))}
            </div>

            {winner && (
              <div className="text-xl font-arcade mb-2">
                {winner === "Draw" ? "It's a draw!" : `Winner: ${winner}`}
              </div>
            )}

            <div className="text-xl font-arcade mb-4">
              Round: {round}/3 | Score: {score}
            </div>
          </>
        )}

        {round >= 3 && (
          <div className="text-2xl font-arcade text-green-800 font-bold mb-4">
            Game Over! Your Score: {score}/3
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={resetGame} className="font-arcade bg-[#4f3222] px-4 py-2 rounded text-white">
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default TicTacToe;
