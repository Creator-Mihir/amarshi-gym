import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import logo from '../../assets/gymlogo.png'; // Make sure filename matches!
const Navbar = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [memberUser, setMemberUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // To check current page

  // Check login status
  useEffect(() => {
    const storedAdmin = localStorage.getItem('user');
    const storedMember = localStorage.getItem('memberData');

    if (storedAdmin) setAdminUser(JSON.parse(storedAdmin));
    if (storedMember) setMemberUser(JSON.parse(storedMember));
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all storage
    setAdminUser(null);
    setMemberUser(null);
    navigate('/'); 
  };

  // --- SMART SCROLL FUNCTION ---
  const scrollToSection = (id) => {
    setIsMenuOpen(false);

    // 1. If we are already on Home Page, just scroll
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 2. If elsewhere (e.g., Dashboard), go Home first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to let page load
    }
  };

  return (
    <nav className="fixed w-full z-50 px-6 py-4 bg-white/ backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        
        <Link to="/" className="flex items-center gap-3 group">
  
              {/* The Image Container */}
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_15px_rgba(204,255,0,0.6)] transition-all duration-300">
              <img 
                src={logo} 
                alt="Amarshi Fitness" 
                className="w-full h-full object-contain" 
              />
            </div>
            
            {/* The Text */}
            <div className="text-2xl font-black italic tracking-tighter flex items-center">
              <span className="text-[#ccff00]">AMARSHI</span>
              <span className="text-[#00f0ff]">.FITNESS</span>
            </div>
          </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          
          {/* PUBLIC LINKS (Hidden if Member is logged in) */}
          {!memberUser && (
            <>
              <button onClick={() => scrollToSection('formats')} className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
                Training
              </button>
              <button onClick={() => scrollToSection('plans')} className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
                Membership
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-white hover:text-[#ccff00] uppercase tracking-widest transition-colors">
              Contact Us
            </button>
            </>
          )}

          {/* MEMBER CONTACT BUTTON (Now works from Dashboard too!) */}
          

          {/* DYNAMIC AUTH BUTTONS */}
          
          {/* --- SCENARIO A: ADMIN LOGGED IN --- */}
          {adminUser ? (
            <div className="flex items-center gap-6">
              <Link to="/admin/enquiries" className="relative group">
                <div className="text-white hover:text-[#ccff00] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f0ff]"></span>
                </span>
              </Link>

              <span className="text-white text-sm font-bold">
                Hi, <span className="text-[#ccff00]">{adminUser.name || 'Admin'}</span>
              </span>

              <Link to="/admin/dashboard" className="px-5 py-2 bg-[#00f0ff] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                Dashboard
              </Link>
              <Link to="/admin/plans" className="text-white hover:text-[#ccff00] text-xs font-bold uppercase tracking-widest mr-6">
                Manage Plans
              </Link>
              
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase underline">
                Logout
              </button>
            </div>
          ) : memberUser ? (
            
            /* --- SCENARIO B: MEMBER LOGGED IN --- */
            <div className="flex items-center gap-6">
              <span className="text-white text-sm font-bold">
                Hi, <span className="text-[#ccff00]">{memberUser.name}</span>
              </span>

              <Link to="/member/dashboard" className="px-5 py-2 bg-[#ccff00] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                My Dashboard
              </Link>
              
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase underline">
                Logout
              </button>
            </div>
          ) : (
            
            /* --- SCENARIO C: NOT LOGGED IN --- */
            <Link 
              to="/login" 
              className="px-6 py-2 border border-[#ccff00] text-[#ccff00] text-xs font-bold tracking-widest hover:bg-[#ccff00] hover:text-black transition-all uppercase"
            >
              Login / Join
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-zinc-900 border-b border-white/10 p-6 flex flex-col gap-4 text-center shadow-2xl">
          
          {!memberUser && (
            <>
              <button onClick={() => scrollToSection('formats')} className="text-white font-bold uppercase">Training</button>
              <button onClick={() => scrollToSection('plans')} className="text-white font-bold uppercase">Membership</button>
            </>
          )}

          {memberUser && (
            <button onClick={() => scrollToSection('contact')} className="text-white font-bold uppercase">Contact Us</button>
          )}

          {adminUser ? (
            <>
              <Link to="/admin/dashboard" className="text-[#00f0ff] font-bold uppercase">Admin Dashboard</Link>
              <button onClick={handleLogout} className="text-red-500 font-bold uppercase">Logout</button>
            </>
          ) : memberUser ? (
            <>
              <Link to="/member/dashboard" className="text-[#ccff00] font-bold uppercase">My Dashboard</Link>
              <button onClick={handleLogout} className="text-red-500 font-bold uppercase">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-[#ccff00] font-bold uppercase">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;