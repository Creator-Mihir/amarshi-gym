import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  // Toggle State: 'member' or 'admin'
  const [role, setRole] = useState('member'); 
  
  // Form States
  const [identifier, setIdentifier] = useState(''); // Email (Admin) or Phone (Member)
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (role === 'admin') {
        // --- ADMIN LOGIN ---
        response = await api.post('/auth/login', { email: identifier, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('WELCOME BOSS');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        // --- MEMBER LOGIN ---
        response = await api.post('/members/login', { phone: identifier, password });
        localStorage.setItem('memberToken', response.data.token);
        localStorage.setItem('memberData', JSON.stringify(response.data));
        toast.success('ACCESS GRANTED');
        setTimeout(() => navigate('/member/dashboard'), 1500);
      }

    } catch (error) {
      toast.error('Invalid Credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar />
      <ToastContainer theme="dark" position="bottom-center" />

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
        
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10">
          
          <h1 className="text-3xl font-black italic text-center mb-8 tracking-tighter">
            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00f0ff]">ACCESS</span>
          </h1>

          {/* --- ROLE TOGGLE SWITCH --- */}
          <div className="flex bg-black p-1 rounded-lg mb-8 border border-zinc-800">
            <button 
              onClick={() => { setRole('member'); setIdentifier(''); setPassword(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded transition-all ${role === 'member' ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]' : 'text-gray-500 hover:text-white'}`}
            >
              Member
            </button>
            <button 
              onClick={() => { setRole('admin'); setIdentifier(''); setPassword(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded transition-all ${role === 'admin' ? 'bg-[#00f0ff] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'text-gray-500 hover:text-white'}`}
            >
              Owner / Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Field (Changes based on Role) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {role === 'admin' ? 'Admin Email' : 'Phone Number'}
              </label>
              <input 
                type={role === 'admin' ? 'email' : 'text'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`w-full bg-black border border-zinc-700 rounded-lg px-5 py-4 text-white placeholder-zinc-700 outline-none transition-all font-mono ${role === 'admin' ? 'focus:border-[#00f0ff]' : 'focus:border-[#ccff00]'}`}
                placeholder={role === 'admin' ? 'owner@gym.com' : '9876543210'}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black border border-zinc-700 rounded-lg px-5 py-4 text-white placeholder-zinc-700 outline-none transition-all font-mono ${role === 'admin' ? 'focus:border-[#00f0ff]' : 'focus:border-[#ccff00]'}`}
                placeholder="••••••••"
                required
              />
              {role === 'member' && (
                <p className="text-[10px] text-gray-500 text-right mt-1">First time? Use your phone number as password.</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-black text-lg py-4 rounded-lg uppercase tracking-widest transition-all mt-4 ${role === 'admin' ? 'bg-[#00f0ff] hover:bg-white text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'bg-[#ccff00] hover:bg-white text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'}`}
            >
              {loading ? 'Authenticating...' : 'Enter System'}
            </button>

          </form>

          {/* Helper Link */}
          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-gray-500 hover:text-white transition-colors underline">
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;