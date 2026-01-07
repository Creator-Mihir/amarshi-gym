import { useEffect, useState, useRef } from 'react'; // 1. IMPORT useRef
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  
  // UI States
  const [selectedMember, setSelectedMember] = useState(null); // For Popup Modal
  const [editingMember, setEditingMember] = useState(null); // For Edit Form Mode
  
  // Ref for File Input
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    selectedPlanId: '',
    customStartDate: ''
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const membersRes = await api.get('/members');
      const plansRes = await api.get('/plans');
      setMembers(membersRes.data);
      setPlans(plansRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Error loading data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- STATS CALCULATIONS ---
  const isExpired = (dateString) => new Date(dateString) < new Date();

  // 1. Total Active
  const activeCount = members.filter(m => !isExpired(m.endDate)).length;
  
  // 2. Total Revenue
  const totalRevenue = members.reduce((acc, member) => acc + (member.price || 0), 0);
  
  // 3. Total Visits
  const totalVisits = members.reduce((acc, member) => acc + (member.attendanceCount || 0), 0);

  // --- HANDLERS ---

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // NEW: HANDLE PHOTO UPDATE
  const handlePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedMember) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Send only the image to the update route
      const res = await api.put(`/members/${selectedMember._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update local state instantly so the UI changes without reload
      setSelectedMember({ ...selectedMember, image: res.data.image });
      setMembers(members.map(m => m._id === selectedMember._id ? res.data : m));
      
      toast.success('Photo Updated 📸');
    } catch (error) {
      console.error(error);
      toast.error('Photo Upload Failed');
    }
  };

  const markAttendance = async (id, e) => {
    e.stopPropagation();
    try {
      await api.post('/attendance', { memberId: id });
      toast.success('Marked Present ✅');
      setMembers(prev => prev.map(m => m._id === id ? {...m, attendanceCount: (m.attendanceCount || 0) + 1} : m));
    } catch (error) {
      toast.info('Already marked today');
    }
  };

  const startEdit = (member) => {
    const plan = plans.find(p => p.name === member.plan);
    const formattedDate = member.startDate ? member.startDate.split('T')[0] : '';
    setEditingMember(member._id);
    setFormData({
      name: member.name,
      phone: member.phone,
      selectedPlanId: plan ? plan._id : '',
      customStartDate: formattedDate
    });
    setSelectedMember(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setFormData({ name: '', phone: '', selectedPlanId: '', customStartDate: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedPlanId) return toast.error('Please select a plan');
    const selectedPlan = plans.find(p => p._id === formData.selectedPlanId);

    try {
      if (editingMember) {
        await api.put(`/members/${editingMember}`, {
          name: formData.name,
          phone: formData.phone,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          durationInMonths: selectedPlan.durationInMonths,
          customStartDate: formData.customStartDate
        });
        toast.success('Member Updated');
        cancelEdit();
      } else {
        await api.post('/members', {
          name: formData.name,
          phone: formData.phone,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          durationInMonths: selectedPlan.durationInMonths,
          customStartDate: formData.customStartDate
        });
        toast.success('Member Registered');
        setFormData({ name: '', phone: '', selectedPlanId: '', customStartDate: '' });
      }
      fetchData();
    } catch (error) {
      toast.error('Operation Failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member completely?')) {
      try {
        await api.delete(`/members/${id}`);
        toast.success('Member Deleted');
        fetchData();
        setSelectedMember(null);
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar />
      <ToastContainer theme="dark" />

      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Active Members */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Active Members</div>
              <div className="text-4xl font-black text-[#ccff00]">{activeCount}</div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💪</div>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</div>
              <div className="text-4xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl text-[#00f0ff]">💰</div>
          </div>

          {/* Card 3: Total Footfall */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Visits</div>
              <div className="text-4xl font-black text-[#00f0ff]">{totalVisits}</div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl text-white">👟</div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-[#00f0ff] uppercase tracking-widest">
              {editingMember ? 'Edit Details' : 'Register / Import'}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Full Name</label>
                <input name="name" value={formData.name} onChange={onChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-bold" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Phone</label>
                <input name="phone" value={formData.phone} onChange={onChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-mono" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Start Date (Optional)</label>
                <input type="date" name="customStartDate" value={formData.customStartDate} onChange={onChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-mono uppercase" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Plan</label>
                <select name="selectedPlanId" value={formData.selectedPlanId} onChange={onChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-bold">
                  <option value="">-- Select Protocol --</option>
                  {plans.map(p => (
                    <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 py-4 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-widest rounded transition-all">
                  {editingMember ? 'Save Updates' : 'Add Member'}
                </button>
                {editingMember && (
                  <button type="button" onClick={cancelEdit} className="px-4 py-4 border border-red-500 text-red-500 font-bold uppercase rounded hover:bg-red-500 hover:text-white transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: TABLE */}
          <div className="lg:col-span-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-gray-400 text-xs uppercase font-bold tracking-widest">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Expiry</th>
                  <th className="p-4">Visits</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {members.map((m) => {
                   const expired = isExpired(m.endDate);
                   return (
                    <tr key={m._id} onClick={() => setSelectedMember(m)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="p-4 font-bold group-hover:text-[#ccff00] transition-colors">{m.name}</td>
                      <td className="p-4 text-sm text-gray-300">{m.plan}</td>
                      <td className="p-4 font-mono text-sm text-[#00f0ff]">{new Date(m.endDate).toLocaleDateString()}</td>
                      <td className="p-4 font-black text-xl text-white">{m.attendanceCount || 0}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${expired ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                          {expired ? 'EXPIRED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button onClick={(e) => markAttendance(m._id, e)} className="px-3 py-1 bg-zinc-700 hover:bg-[#00f0ff] hover:text-black text-[10px] font-bold uppercase rounded transition-all">
                          Mark Present
                        </button>
                      </td>
                    </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP MODAL (ID CARD) */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
            
            {/* Header Band */}
            <div className={`h-24 flex items-center justify-center ${isExpired(selectedMember.endDate) ? 'bg-red-600' : 'bg-[#ccff00]'}`}>
              <h2 className={`text-3xl font-black italic tracking-tighter ${isExpired(selectedMember.endDate) ? 'text-white' : 'text-black'}`}>
                {isExpired(selectedMember.endDate) ? 'MEMBERSHIP EXPIRED' : 'ACTIVE MEMBER'}
              </h2>
            </div>

            <div className="p-8 text-center -mt-10">
              
              {/* --- PHOTO SECTION WITH CAMERA BUTTON --- */}
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                {/* The Image */}
                <div className="w-full h-full bg-zinc-800 rounded-full border-4 border-zinc-900 overflow-hidden flex items-center justify-center">
                  {selectedMember.image ? (
                    <img 
                      src={`http://localhost:5001${selectedMember.image}`} 
                      alt="Member" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>

                {/* The Camera Overlay Button */}
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-[#00f0ff] text-black p-2 rounded-full hover:scale-110 transition-transform shadow-lg border-2 border-zinc-900"
                  title="Change Photo"
                >
                  📷
                </button>

                {/* The Hidden Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpdate} 
                  hidden 
                  accept="image/*" 
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{selectedMember.name}</h3>
              <p className="font-mono text-[#00f0ff] mb-6">{selectedMember.phone}</p>
              
              <div className="grid grid-cols-2 gap-4 text-left bg-black/50 p-4 rounded-xl border border-zinc-800">
                <div><div className="text-[10px] text-gray-500 uppercase font-bold">Plan</div><div className="text-white font-bold">{selectedMember.plan}</div></div>
                <div><div className="text-[10px] text-gray-500 uppercase font-bold">Fee Paid</div><div className="text-white font-bold">₹{selectedMember.price}</div></div>
                <div><div className="text-[10px] text-gray-500 uppercase font-bold">Joined On</div><div className="text-gray-400 text-sm font-mono">{new Date(selectedMember.startDate).toLocaleDateString()}</div></div>
                <div><div className="text-[10px] text-gray-500 uppercase font-bold">Expires On</div><div className={`font-mono font-bold ${isExpired(selectedMember.endDate) ? 'text-red-500' : 'text-[#ccff00]'}`}>{new Date(selectedMember.endDate).toLocaleDateString()}</div></div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button onClick={() => startEdit(selectedMember)} className="flex-1 py-3 bg-[#ccff00] text-black font-bold rounded hover:bg-white transition-colors">Edit Details</button>
                <button onClick={() => handleDelete(selectedMember._id)} className="px-4 py-3 border border-red-500/50 text-red-500 rounded hover:bg-red-600 hover:text-white transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;