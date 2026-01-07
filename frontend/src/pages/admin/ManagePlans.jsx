import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which plan is being edited
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationInMonths: '',
    featuresString: '' // We will split this by comma
  });

  // --- FETCH PLANS ---
  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/plans');
      setPlans(data);
    } catch (error) {
      toast.error('Failed to load plans');
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // --- HANDLERS ---
  
  // Handle Input Change
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Edit Click (Populate Form)
  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name,
      price: plan.price,
      durationInMonths: plan.durationInMonths,
      featuresString: plan.features.join(', ')
    });
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', durationInMonths: '', featuresString: '' });
  };

  // Handle Submit (Create OR Update)
  const onSubmit = async (e) => {
    e.preventDefault();
    const featuresArray = formData.featuresString.split(',').map(f => f.trim());
    const payload = { ...formData, features: featuresArray };

    try {
      if (editingId) {
        // UPDATE MODE
        await api.put(`/plans/${editingId}`, payload);
        toast.success('Protocol Updated');
      } else {
        // CREATE MODE
        await api.post('/plans', payload);
        toast.success('Protocol Created');
      }
      
      cancelEdit(); // Reset form and mode
      fetchPlans(); // Refresh list
    } catch (error) {
      toast.error('Operation Failed');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Delete this plan permanently?')) {
      try {
        await api.delete(`/plans/${id}`);
        toast.success('Protocol Deleted');
        fetchPlans();
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
        <h1 className="text-4xl font-black italic text-white mb-8">
          MANAGE <span className="text-[#ccff00]">PROTOCOLS</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* --- LEFT: CREATE / EDIT FORM --- */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-[#00f0ff] uppercase tracking-widest">
              {editingId ? 'Edit Protocol' : 'Create New Plan'}
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Plan Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={onChange} 
                  placeholder="e.g. SILVER TIER" 
                  className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-bold" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={onChange} 
                    placeholder="5000" 
                    className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-mono" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">Duration (Months)</label>
                  <input 
                    name="durationInMonths" 
                    type="number" 
                    value={formData.durationInMonths} 
                    onChange={onChange} 
                    placeholder="3" 
                    className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none font-mono" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Features (Comma Separated)</label>
                <textarea 
                  name="featuresString" 
                  value={formData.featuresString} 
                  onChange={onChange} 
                  placeholder="Gym Access, Free T-Shirt, Steam Bath" 
                  rows="3" 
                  className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-[#ccff00] outline-none" 
                  required
                ></textarea>
                <p className="text-[10px] text-gray-500 mt-1">Separate features with a comma.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-widest rounded transition-all"
                >
                  {editingId ? 'Save Changes' : 'Launch Protocol'}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit} 
                    className="px-6 py-4 border border-red-500 text-red-500 font-bold uppercase rounded hover:bg-red-500 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* --- RIGHT: EXISTING PLANS --- */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Active Protocols</h2>
            {plans.map((plan) => (
              <div key={plan._id} className="group bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-[#00f0ff] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black italic">{plan.name}</h3>
                    <div className="text-[#00f0ff] font-mono text-lg font-bold">
                      ₹{plan.price} <span className="text-sm text-gray-500">/ {plan.durationInMonths} Mo</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(plan)} 
                      className="p-2 bg-zinc-800 text-[#ccff00] hover:bg-white hover:text-black rounded transition-colors" 
                      title="Edit Plan"
                    >
                      ✎
                    </button>
                    <button 
                      onClick={() => handleDelete(plan._id)} 
                      className="p-2 bg-zinc-800 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors" 
                      title="Delete Plan"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-gray-400">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagePlans;