import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // We use direct axios here for custom header
import Navbar from '../../components/common/Navbar';
import { toast, ToastContainer } from 'react-toastify';

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('memberToken');
      
      if (!token) {
        navigate('/member/login');
        return;
      }

      try {
        // Manually attaching token since our api.js is set up for Admins
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        const res = await axios.get('http://localhost:5001/api/members/profile', config);
        setData(res.data);
      } catch (error) {
        toast.error('Session Expired');
        localStorage.removeItem('memberToken');
        navigate('/member/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Lab Data...</div>;

  const { member, attendance } = data;
  const isExpired = new Date(member.endDate) < new Date();
  
  // Calculate Days Left
  const today = new Date();
  const end = new Date(member.endDate);
  const diffTime = Math.abs(end - today);
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar />
      <ToastContainer theme="dark" />

      <div className="max-w-4xl mx-auto px-6 py-24">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black italic">WELCOME BACK, <span className="text-[#ccff00] uppercase">{member.name}</span></h1>
          <p className="text-gray-500 font-mono text-sm mt-2">ID: {member._id.slice(-6).toUpperCase()}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* --- CARD 1: DIGITAL ID --- */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase ${isExpired ? 'bg-red-600' : 'bg-[#ccff00] text-black'}`}>
              {isExpired ? 'EXPIRED' : 'ACTIVE ACCESS'}
            </div>
            
            <div className="flex flex-col items-center mt-6">
              {/* Fake QR Code */}
              <div className="w-48 h-48 bg-white p-2 rounded-lg mb-4">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${member._id}`} alt="QR Code" className="w-full h-full" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Scan at Entrance</p>
            </div>

            <div className="mt-6 border-t border-zinc-800 pt-6 grid grid-cols-2 gap-4">
               <div>
                 <div className="text-[10px] text-gray-500 uppercase font-bold">Current Plan</div>
                 <div className="text-white font-bold">{member.plan}</div>
               </div>
               <div>
                 <div className="text-[10px] text-gray-500 uppercase font-bold">Valid Until</div>
                 <div className="text-[#00f0ff] font-mono">{new Date(member.endDate).toLocaleDateString()}</div>
               </div>
            </div>
          </div>

          {/* --- CARD 2: STATS & HISTORY --- */}
          <div className="space-y-6">
            
            {/* Days Left Ticker */}
            <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl">
               <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Membership Status</div>
               <div className="flex items-end gap-2">
                 <span className="text-5xl font-black text-white">{isExpired ? 0 : daysLeft}</span>
                 <span className="text-gray-500 font-bold mb-1">Days Remaining</span>
               </div>
               {isExpired && <div className="text-red-500 text-sm font-bold mt-2">⚠️ PLEASE RENEW YOUR PLAN</div>}
            </div>

            {/* Attendance Log */}
            <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl h-80 overflow-y-auto custom-scrollbar">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 sticky top-0 bg-[#111] pb-2">Recent Activity</h3>
              
              {attendance.length === 0 ? (
                <div className="text-gray-600 text-sm">No workouts logged yet. Go lift!</div>
              ) : (
                <div className="space-y-3">
                  {attendance.map((log) => (
                    <div key={log._id} className="flex justify-between items-center p-3 bg-zinc-900 rounded border border-zinc-800">
                       <span className="text-sm font-bold text-white">Gym Visit</span>
                       <span className="text-xs font-mono text-[#ccff00]">
                         {new Date(log.createdAt).toLocaleString()}
                       </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;