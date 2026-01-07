import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { toast, ToastContainer } from 'react-toastify';

const MemberLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Note: We use the specific member login route
      const { data } = await api.post('/members/login', { phone, password });
      
      // Save specific member token
      localStorage.setItem('memberToken', data.token);
      localStorage.setItem('memberData', JSON.stringify(data));

      toast.success('WELCOME TO THE LAB');
      setTimeout(() => navigate('/member/dashboard'), 1500);
    } catch (error) {
      toast.error('Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar />
      <ToastContainer theme="dark" position="bottom-center" />

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 rounded-full blur-[50px] pointer-events-none"></div>

          <h1 className="text-3xl font-black italic text-center mb-2">MEMBER <span className="text-[#ccff00]">ACCESS</span></h1>
          <p className="text-gray-500 text-center text-sm mb-8 font-mono">Use your Phone Number as Password</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-[#ccff00] outline-none font-mono mt-2"
                placeholder="9999999999"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-[#ccff00] outline-none font-mono mt-2"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#ccff00] hover:bg-white text-black font-black py-4 rounded-lg uppercase tracking-widest transition-all">
              Enter Gym
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default MemberLogin;