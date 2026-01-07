import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/user/Home'; // Make sure this path matches where you put Home.jsx!
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import ManagePlans from './pages/admin/ManagePlans';
import Enquiries from './pages/admin/Enquiries';   // Was "Dashboard"
import MemberLogin from './pages/member/MemberLogin';
import MemberDashboard from './pages/member/MemberDashboard';
import Gallery from './pages/user/Gallery';
function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home Page */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/enquiries" element={<Enquiries />} />
        <Route path="/admin/dashboard" element={<Dashboard />} /> {/* Linked to Dashboard Button */}
        <Route path="/admin/plans" element={<ManagePlans />} />
        <Route path="/member/login" element={<MemberLogin />} />  
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;