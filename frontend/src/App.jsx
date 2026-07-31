import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { EarningsProvider } from './context/EarningsContext';
import DashboardView from './views/DashboardView';
import JobLoggerView from './views/JobLoggerView';
import AdvisorChatView from './views/AdvisorChatView';
import WeeklyInsightsView from './views/WeeklyInsightsView';
import { Shield, Home, PlusCircle, MessageSquare, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-white');

  return (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
          <Shield className="text-teal-400 w-6 h-6" /> GigShield
        </Link>
        <div className="flex gap-4 text-xs font-semibold">
          <Link to="/" className={`flex items-center gap-1 ${isActive('/')}`}>
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <Link to="/log" className={`flex items-center gap-1 ${isActive('/log')}`}>
            <PlusCircle className="w-3.5 h-3.5" /> Log
          </Link>
          <Link to="/advisor" className={`flex items-center gap-1 ${isActive('/advisor')}`}>
            <MessageSquare className="w-3.5 h-3.5" /> AI Chat
          </Link>
          <Link to="/weekly-insights" className={`flex items-center gap-1 ${isActive('/weekly-insights')}`}>
            <TrendingUp className="w-3.5 h-3.5" /> Insights
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <EarningsProvider>
      <Router>
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex justify-center">
          <main className="w-full max-w-md min-h-screen bg-white shadow-2xl relative">
            <Navbar />
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/log" element={<JobLoggerView />} />
              <Route path="/advisor" element={<AdvisorChatView />} />
              <Route path="/weekly-insights" element={<WeeklyInsightsView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EarningsProvider>
  );
}