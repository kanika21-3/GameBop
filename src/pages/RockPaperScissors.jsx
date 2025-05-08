import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../Firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import rockImg from '../assets/rock.jpg';
import paperImg from '../assets/five.jpg';
import scissorsImg from '../assets/two.jpg';
import gameicon from '../assets/gameicon.png';
import bgImage from '../assets/background.jpg';

// Navbar Component
const Navbar = () => (
  <nav className="w-full bg-[#7e4a35] text-white px-6 py-4 flex justify-between items-center">
    <img src={gameicon} alt="icon" className="w-40 h-10 object-cover shadow-lg" />
    <Link to="/" className="bg-[#4f3222] hover:bg-[#8b6f47] font-arcade px-4 py-2 rounded text-white">
      Home
    </Link>
  </nav>
);

// Choice Images
const choiceImages = {
  Rock: rockImg,
  Paper: paperImg,
  Scissors: scissorsImg,
};

const RockPaperScissors = () => {
  const [choice, setChoice] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [user, setUser] = useState(null);
  const [lastScore, setLastScore] = useState(null);
  const [shuffleDisplay, setShuffleDisplay] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const scores = docSnap.data().scores || {};
          setLastScore(scores.rockPaperScissors ?? null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const getResult = (player, computer) => {
    if (player === computer) return "Draw";
    if (
      (player === 'Rock' && computer === 'Scissors') ||
      (player === 'Scissors' && computer === 'Paper') ||
      (player === 'Paper' && computer === 'Rock')
    ) return 'Win!';
    return 'Lose!';
  };

  const playRound = () => {
    if (!choice) {
      alert("Choose Rock, Paper, or Scissors first!");
      return;
    }

    if (round >= 3) {
      alert("Game Over! Click reset to play again.");
      return;
    }

    setShuffling(true);
    setResult('');
    setComputerChoice('');
    setShuffleDisplay('');

    const shuffleInterval = setInterval(() => {
      const tempChoice = ['Rock', 'Paper', 'Scissors'][Math.floor(Math.random() * 3)];
      setShuffleDisplay(tempChoice);
    }, 100);

    setTimeout(async () => {
      clearInterval(shuffleInterval);
      const compChoice = ['Rock', 'Paper', 'Scissors'][Math.floor(Math.random() * 3)];
      setComputerChoice(compChoice);
      const outcome = getResult(choice, compChoice);
      setResult(outcome);
      if (outcome === 'Win!') {
        setScore((prev) => prev + 1);
      }
      setRound((prev) => prev + 1);
      setShuffling(false);

      if (round === 2 && user) {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
          scores: {
            rockPaperScissors: outcome === 'You Win!' ? score + 1 : score
          }
        }, { merge: true });
      }
    }, 1500);
  };

  const resetGame = () => {
    setChoice(null);
    setShuffling(false);
    setComputerChoice('');
    setResult('');
    setScore(0);
    setRound(0);
    setShuffleDisplay('');
  };

  return (
    <>
      <Navbar />
      <div
    className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
     >
        <h1 className="text-4xl font-arcade font-bold mb-4">Rock Paper Scissors</h1>

        {user && lastScore !== null && (
          <div className="text-lg font-arcade text-gray-700 mb-2">
            Last Score: <strong>{lastScore}/3</strong>
          </div>
        )}

        <div className="flex gap-4 mb-4 font-arcade">
          {['Rock', 'Paper', 'Scissors'].map((item) => (
            <button
              key={item}
              onClick={() => setChoice(item)}
              className={`px-4 py-2 rounded ${
                choice === item ? 'bg-[#4f3222] text-white' : 'bg-[#8b6f47]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={playRound}
          className="bg-[#4f3222] font-arcade text-white px-6 py-3 rounded mb-6"
          disabled={shuffling || round >= 3}
        >
          {round >= 3 ? 'Game Over' : shuffling ? 'Shuffling...' : `Start Round ${round + 1}`}
        </button>

        {shuffling && shuffleDisplay && (
          <img
            src={choiceImages[shuffleDisplay]}
            alt="Shuffling"
            className="w-40 h-60 rounded shadow-md mb-4 animate-pulse"
          />
        )}

        {computerChoice && (
          <div className="flex gap-4 mb-4 font-arcade ">
            <div className="flex flex-col items-center">
              <p>You</p>
              <img
                src={choiceImages[choice]}
                alt="Your Choice"
                className="w-40 h-60 rounded shadow-md"
              />
            </div>
            <div className="flex flex-col items-center">
              <p>Computer</p>
              <img
                src={choiceImages[computerChoice]}
                alt="Computer Choice"
                className="w-40 h-60 rounded shadow-md"
              />
            </div>
          </div>
        )}

        {result && (
          <div className="text-2xl font-arcade text-red mb-4">{result}</div>
        )}

        {round >= 3 && (
          <div className="text-2xl font-arcade font-bold mb-4">
            Game Over! Your score: {score}/3
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={resetGame} className=" bg-[#4f3222] font-arcade px-4 py-2 rounded text-white">
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default RockPaperScissors;
