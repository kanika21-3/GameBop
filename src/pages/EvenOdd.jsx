import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import img1 from '../assets/one.jpg';
import img2 from '../assets/two.jpg';
import img3 from '../assets/three.jpg';
import img4 from '../assets/four.jpg';
import img5 from '../assets/five.jpg';
import gameicon from '../assets/gameicon.png';
import bgImage from '../assets/background.jpg';
import { signOut } from 'firebase/auth';

const numberImages = {
  1: img1,
  2: img2,
  3: img3,
  4: img4,
  5: img5,
};

// Navbar Component
// Simple Navbar component (matching TicTacToe)
const Navbar = () => (
  <nav className="w-full bg-[#7e4a35] text-white px-6 py-4 flex justify-between items-center">
    <img src={gameicon} alt="icon" className="w-40 h-10 object-cover shadow-lg" />
    <Link to="/" className="bg-[#4f3222] hover:bg-[#8b6f47] font-arcade px-4 py-2 rounded text-white">
      Home
    </Link>
  </nav>
);


const EvenOdd = () => {
  const [choice, setChoice] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [result, setResult] = useState('');
  const [sum, setSum] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [user, setUser] = useState(null);
  const [lastScore, setLastScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const scores = docSnap.data().scores || {};
          setLastScore(scores.evenOdd ?? null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  const startGame = () => {
    if (!choice) {
      alert('Please select Even or Odd first!');
      return;
    }
    if (round >= 3) {
      alert('Game over. Please refresh or reset to play again.');
      return;
    }

    setShuffling(true);
    setResult('');
    setSum(null);

    let shuffleCount = 0;
    const interval = setInterval(async () => {
      const num1 = Math.ceil(Math.random() * 5);
      const num2 = Math.ceil(Math.random() * 5);
      setNumbers([num1, num2]);
      shuffleCount++;
      if (shuffleCount > 10) {
        clearInterval(interval);
        setShuffling(false);

        const total = num1 + num2;
        setSum(total);
        const parity = total % 2 === 0 ? 'Even' : 'Odd';
        const isCorrect = parity === choice;

        setResult(isCorrect ? 'Correct!' : 'Wrong!');
        setScore((prev) => isCorrect ? prev + 1 : prev);
        setRound((prev) => prev + 1);

        if (round === 2 && user) {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, {
            scores: {
              evenOdd: isCorrect ? score + 1 : score,
            }
          }, { merge: true });
        }
      }
    }, 150);
  };

  const resetGame = () => {
    setScore(0);
    setRound(0);
    setNumbers([]);
    setSum(null);
    setResult('');
    setChoice(null);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div
    className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
     >
        <h1 className="text-4xl font-arcade mb-4">Even Odd</h1>

        {user && lastScore !== null && (
          <div className="text-lg font-arcade text-gray-700 mb-2">
            Last Score: <strong>{lastScore}/3</strong>
          </div>
        )}

        <div className="flex gap-4 mb-4 font-arcade">
          <button
            onClick={() => setChoice('Even')}
            className={`px-4 py-2 rounded ${choice === 'Even' ? 'bg-[#4f3222] text-white' : 'bg-[#8b6f47]'}`}
          >
            Even
          </button>
          <button
            onClick={() => setChoice('Odd')}
            className={`px-4 py-2 rounded ${choice === 'Odd' ? 'bg-[#4f3222] text-white' : 'bg-[#8b6f47]'}`}
          >
            Odd
          </button>
        </div>

        <button
          onClick={startGame}
          className="bg-[#4f3222] font-arcade text-white px-6 py-3 rounded mb-6"
          disabled={shuffling || round >= 3}
        >
          {round >= 3 ? 'Game Over' : shuffling ? 'Shuffling...' : `Start Round ${round + 1}`}
        </button>

        <div className="flex gap-6 mb-4">
          {numbers.map((num, index) => (
            <img
              key={index}
              src={numberImages[num]}
              alt={`Number ${num}`}
              className="w-40 h-60 rounded shadow-md cursor-pointer hover:scale-105 transition"
            />
          ))}
        </div>

        {sum !== null && <div className="text-xl font-arcade mb-2">Sum: {sum}</div>}
        {result && <div className="text-2xl font-arcade font-semibold mb-4">{result}</div>}
        {round >= 3 && (
          <div className="text-2xl font-arcade font-bold mb-4">
            Game Over! Your score: {score}/3
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={resetGame} className="bg-[#4f3222] px-4 py-2 rounded font-arcade text-white">
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default EvenOdd;
