import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

import tictactoeImg from '../assets/tictactoe.jpg';
import evenoddImg from '../assets/evenodd.jpg';
import rpsImg from '../assets/rockpper.jpg';
import bgImage from '../assets/background.jpg';
import gameicon from '../assets/gameicon.png'; // ✅ Make sure this image exists

// ✅ Navbar Component
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#7e4a35] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <img src={gameicon} alt="icon" className="w-40 h-10 object-cover shadow-lg" />
      <div className="flex items-center gap-4">
        {user && <span className="text-sm hidden sm:inline">Welcome, {user.email}</span>}
        {user ? (
          <button
            onClick={onLogout}
            className="bg-[#4f3222] hover:bg-[#8b6f47] px-4 py-2 rounded text-whit font-arcade"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#4f3222] hover:bg-[#8b6f47] px-4 py-2 rounded font-arcade text-white"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
      <div className="object-cover mb-6 shadow-lg transition-transform duration-300 hover:-translate-y-6">
        <img
  src={gameicon}
  alt="icon"
  className="w-65 h-28"
/>
<h1 className="font-arcade text-2xl">Old School Never Gets Old.</h1>
</div>


        <div className="flex flex-wrap justify-center gap-12 mt-6">
          <div
            className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center px-6"
            onClick={() => navigate('/tic-tac-toe')}
          >
            <img
              src={tictactoeImg}
              alt="Tic Tac Toe"
              className="rounded-full shadow-lg w-60 h-60 object-cover"
            />
            <p className="text-center mt-5 text-2xl font-arcade text-gray-700">Tic Tac Toe</p>
          </div>

          <div
            className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center px-6"
            onClick={() => navigate('/even-odd')}
          >
            <img
              src={evenoddImg}
              alt="Even Odd"
              className="rounded-full shadow-lg w-60 h-60 object-cover"
            />
            <p className="text-center mt-3 text-2xl font-arcade text-gray-700">Even Odd</p>
          </div>

          <div
            className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center px-6"
            onClick={() => navigate('/rock-paper-scissors')}
          >
            <img
              src={rpsImg}
              alt="Rock Paper Scissors"
              className="rounded-full shadow-lg w-60 h-60 object-cover"
            />
            <p className="text-center mt-3 text-2xl font-arcade text-gray-700">Rock Paper Scissors</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
