import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the "Details Modal"
  const [selectedEnquiry, setSelectedEnquiry] = useState(null); 

  const fetchData = async () => {
    try {
      const { data } = await api.get('/enquiries'); 
      setEnquiries(data.reverse());
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this enquiry?')) {
      try {
        await api.delete(`/enquiries/${id}`);
        toast.success('Enquiry Removed');
        // Refresh the list without reloading page
        setEnquiries(enquiries.filter(enq => enq._id !== id));
        setSelectedEnquiry(null); // Close modal if open
      } catch (error) {
        toast.error('Could not delete');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar />
      <ToastContainer theme="dark" />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black italic text-white mb-8">
          COMMAND <span className="text-[#00f0ff]">CENTER</span>
        </h1>

        {/* --- ENQUIRIES TABLE --- */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left bg-zinc-900/30">
            <thead className="bg-zinc-900 text-gray-400 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="p-6">Name</th>
                <th className="p-6">Phone</th>
                <th className="p-6">Message Preview</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {enquiries.map((enq) => (
                <tr key={enq._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold">{enq.name}</td>
                  <td className="p-6 font-mono text-[#00f0ff]">{enq.phone}</td>
                  <td className="p-6 text-gray-400 max-w-xs truncate">{enq.message}</td>
                  <td className="p-6 flex gap-3">
                    {/* View Button */}
                    <button 
                      onClick={() => setSelectedEnquiry(enq)}
                      className="p-2 bg-zinc-800 hover:bg-white hover:text-black rounded transition-colors"
                      title="View Details"
                    >
                      👁️
                    </button>
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(enq._id)}
                      className="p-2 bg-zinc-800 hover:bg-red-600 hover:text-white rounded transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW (Cards) --- */}
        <div className="md:hidden space-y-4">
          {enquiries.map((enq) => (
            <div key={enq._id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{enq.name}</h3>
                <div className="flex gap-2">
                   <button onClick={() => setSelectedEnquiry(enq)} className="p-2 bg-zinc-800 rounded">👁️</button>
                   <button onClick={() => handleDelete(enq._id)} className="p-2 bg-zinc-800 text-red-500 rounded">🗑️</button>
                </div>
              </div>
              <div className="text-[#00f0ff] font-mono mb-2">{enq.phone}</div>
              <p className="text-gray-400 text-sm truncate">{enq.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- POPUP MODAL (DETAILS) --- */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl p-8 relative shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black italic mb-6 text-[#ccff00]">ENQUIRY DETAILS</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Client Name</label>
                <div className="text-xl font-bold text-white">{selectedEnquiry.name}</div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Contact Number</label>
                <div className="text-xl font-mono text-[#00f0ff]">{selectedEnquiry.phone}</div>
                <a href={`tel:${selectedEnquiry.phone}`} className="inline-block mt-2 text-xs border border-zinc-700 px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">
                  📞 Call Now
                </a>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Full Message</label>
                <div className="bg-black p-4 rounded-lg border border-zinc-800 text-gray-300 mt-2 leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Received On</label>
                <div className="text-sm text-gray-400">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold"
              >
                Close
              </button>
              <button 
                onClick={() => handleDelete(selectedEnquiry._id)}
                className="flex-1 py-3 bg-red-600/20 text-red-500 border border-red-600/50 hover:bg-red-600 hover:text-white rounded-lg font-bold transition-all"
              >
                Delete Permanently
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Enquiries;