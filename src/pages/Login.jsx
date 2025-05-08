import React, { useState } from 'react';
import { auth } from '../Firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/background.jpg';
import bgImage2 from '../assets/bgnd.jpg';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert("Login failed. Attempting registration...");
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } catch (err) {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
    <div className="min-h-screen flex items-center justify-center from-yellow-100 to-blue-100 p-4">
      <div className="w-full max-w-md p-8 rounded shadow-md"
      style={{ backgroundImage: `url(${bgImage2})` }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login to Game Bop</h2>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white font-semibold mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#8b6f47] hover:bg-[#d4ac6e] text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login / Register'}
        </button>
      </div>
    </div>
    </div>
  );
}

export default Login;
