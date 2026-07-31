import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { EarningsProvider } from './context/EarningsContext';
import DashboardView from './views/DashboardView';
import JobLoggerView from './views/JobLoggerView';
import AdvisorChatView from './views/AdvisorChatView';
import { Shield, Home, PlusCircle, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-teal-400" : "text-slate-400 hover:text-white";

  return (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Shield className="text-teal-400 w-6 h-6" /> GigShield
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <Link to="/" className={`flex items-center gap-1 ${isActive('/')}`}><Home className="w-4 h-4"/> Home</Link>
          <Link to="/log" className={`flex items-center gap-1 ${isActive('/log')}`}><PlusCircle className="w-4 h-4"/> Log</Link>
          <Link to="/advisor" className={`flex items-center gap-1 ${isActive('/advisor')}`}><MessageSquare className="w-4 h-4"/> AI</Link>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <EarningsProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="max-w-md mx-auto min-h-[calc(100vh-60px)] bg-white shadow-xl relative">
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/log" element={<JobLoggerView />} />
              <Route path="/advisor" element={<AdvisorChatView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EarningsProvider>
  );
}