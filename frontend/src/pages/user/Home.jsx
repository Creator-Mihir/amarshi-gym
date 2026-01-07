import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom'; // Import Link
const Home = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/plans');
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/enquiries', formData);
      toast.success('Access Requested. We will contact you.');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      toast.error('System Error. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      <ToastContainer theme="dark" position="bottom-right" />

      <Navbar />

      {/* --- HERO SECTION (VIDEO BG) --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/10 z-10" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" /> 
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://www.pexels.com/download/video/5319759/" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-block px-3 py-1 mb-6 border border-[#ccff00] text-[#ccff00] text-[10px] font-bold tracking-[0.3em] uppercase">
            Future of Fitness
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic mb-6 leading-[0.9] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            SHAPE  <br />
            <span className="text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">THE BODY.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 font-light tracking-wide">
            Precision training. Data-driven results. Welcome to the lab.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('plans').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-[#ccff00] text-black font-black text-sm tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)] clip-path-slant"
            >
              Start Training
            </button>
            <Link 
                to="/gallery" 
                className="px-8 py-4 border border-zinc-700 text-white font-bold uppercase tracking-widest hover:border-[#00f0ff] hover:text-[#ccff00] transition-all rounded"
              >
                View Gallery
              </Link>
          </div>
        </div>
      </header>

      {/* --- STATS BAR (Replaces Sliding Text) --- */}
      {/* This creates a solid anchor of trust below the chaotic video */}
      <section className="relative z-30 bg-zinc-900/50 border-y border-zinc-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800">
          {[
            { label: "Active Members", value: "2,500+" },
            { label: "Expert Trainers", value: "50+" },
            { label: "Daily Classes", value: "35+" },
            { label: "Avg Rating", value: "4.9/5" }
          ].map((stat, index) => (
            <div key={index} className="py-8 text-center group cursor-default hover:bg-white/5 transition-colors">
              <div className="text-3xl md:text-4xl font-black italic text-white mb-1 group-hover:text-[#ccff00] transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-[#00f0ff] transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FORMATS GRID --- */}
      <section id="formats" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 border-b border-zinc-800 pb-4">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            TRAINING <span className="text-[#ccff00]">ZONES</span>
          </h2>
          <span className="hidden md:block text-[#00f0ff] font-mono text-sm">/// SCROLL TO EXPLORE</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "HYPERTROPHY", subtitle: "Muscle Building", img: "https://images.unsplash.com/photo-1744551472645-7fd56c0406ff?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fG11c2NsZXMlMjBidWxkaW5nfGVufDB8fDB8fHww" },
            { title: "ENDURANCE", subtitle: "Cardio & HIIT", img: "https://images.unsplash.com/photo-1765302886933-34d10c152af3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZW5kdXJhbmNlJTIwZ3ltfGVufDB8fDB8fHww" },
            { title: "MOBILITY", subtitle: "Yoga & Flow", img: "https://images.unsplash.com/photo-1639496908204-6f949b0f46e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fG1vYmlsaXR5JTIwZ3ltfGVufDB8fDB8fHww" },
            { title: "COMBAT", subtitle: "Boxing & MMA", img: "https://images.unsplash.com/photo-1765302828040-a96f119b99e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbWJhdCUyMGd5bXxlbnwwfHwwfHx8MA%3D%3D" }
          ].map((item, idx) => (
            <div key={idx} className="group relative h-[400px] border border-zinc-800 overflow-hidden cursor-pointer">
              <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 border-t border-[#ccff00]/0 group-hover:border-[#ccff00] bg-black/80 transition-all">
                <h3 className="text-2xl font-black italic text-white group-hover:text-[#ccff00]">{item.title}</h3>
                <p className="text-xs text-gray-400 font-mono mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MEMBERSHIP PLANS --- */}
      <section id="plans" className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-16 uppercase tracking-widest text-gray-500">Select Protocol</h2>
          
          {loading ? (
             <div className="text-center text-[#ccff00] font-mono animate-pulse">LOADING DATA...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, i) => (
                <div key={plan._id} className={`relative p-8 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 ${i === 1 ? 'bg-black border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.15)]' : 'bg-black/50 border-zinc-800 hover:border-[#ccff00]'}`}>
                  {i === 1 && <div className="absolute top-0 right-0 bg-[#00f0ff] text-black text-xs font-bold px-3 py-1">RECOMMENDED</div>}
                  
                  <h3 className={`text-xl font-black italic mb-2 ${i===1 ? 'text-[#00f0ff]' : 'text-white'}`}>{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-6">₹{plan.price}<span className="text-xl text-yellow-600 font-normal"> / {plan.durationInMonths} Mo</span></div>
                  
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                        <span className={`w-1.5 h-1.5 ${i===1 ? 'bg-[#00f0ff]' : 'bg-[#ccff00]'}`}></span> {f}
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-4 text-sm font-bold tracking-widest uppercase border transition-all ${i===1 ? 'bg-[#00f0ff] border-[#00f0ff] text-black hover:bg-white' : 'bg-transparent border-zinc-700 hover:border-[#ccff00] hover:text-[#ccff00]'}`}>
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CONTACT / FOOTER --- */}
      <section id="contact" className="py-24 border-t border-zinc-800 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ccff00]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-2xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl font-black italic mb-2 text-white">JOIN  <span className="text-[#ccff00]">US</span></h2>
          <p className="text-gray-500 mb-10">Leave your details. We build the rest.</p>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input name="name" value={formData.name} onChange={onChange} placeholder="NAME" className="w-1/2 bg-zinc-900/10 border border-zinc-800 p-4 text-white focus:border-[#ccff00] focus:outline-none placeholder:text-white font-mono text-sm" />
              <input name="phone" value={formData.phone} onChange={onChange} placeholder="CONTACT No." className="w-1/2 bg-zinc-900/50 border border-zinc-800 p-4 text-white focus:border-[#ccff00] focus:outline-none placeholder:text-white font-mono text-sm" />
            </div>
            <textarea name="message" value={formData.message} onChange={onChange} placeholder="Your Message" rows="3" className="w-full bg-zinc-900/50 border border-zinc-800 p-4 text-white focus:border-[#ccff00] focus:outline-none placeholder:text-white font-mono text-sm"></textarea>
            
            <button type="submit" className="w-full py-4 bg-[#ccff00] text-black font-black tracking-widest uppercase hover:bg-white transition-colors">
              Initiate
            </button>
          </form>
          
          <div className="mt-16 text-white text-xs font-mono">
            © 2025 IRON LAB INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;