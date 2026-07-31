import { useContext } from 'react';
import { EarningsContext } from '../context/EarningsContext';
import { IndianRupee, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardView() {
  const { jobs, alerts } = useContext(EarningsContext);
  const flaggedCount = alerts.length;

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-20">
      
      <div>
        <h2 className="text-2xl font-black text-slate-900">Weekly Overview</h2>
        <p className="text-slate-500 font-medium">Last 7 days</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mb-2">
            <IndianRupee className="w-4 h-4 text-teal-600" /> Total earnings
          </p>
          <p className="text-3xl font-black">₹450</p>
          <p className="text-xs text-teal-600 font-bold mt-1">↗ 21% vs last week</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mb-2">
            <Clock className="w-4 h-4 text-teal-600" /> Active hours
          </p>
          <p className="text-3xl font-black">3.2h</p>
        </div>
      </div>

      {flaggedCount > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-500 text-white p-1.5 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Fairness Alert</p>
              <p className="font-bold text-red-900 text-sm">{flaggedCount} potential underpayment flagged</p>
            </div>
          </div>
          <p className="text-sm text-red-800 mt-2">{alerts[0].message}</p>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent Shifts</h3>
        </div>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
              <div>
                <p className="font-bold flex items-center gap-2">
                  {job.platform} 
                  {job.isFlagged ? (
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Underpaid</span>
                  ) : (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Fair</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">{job.time}h • ₹{job.fare}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))}
        </div>
      </div>

      <Link to="/advisor" className="block w-full bg-teal-600 text-white rounded-2xl p-4 shadow-lg text-center font-bold hover:bg-teal-700 transition-colors mt-6">
        Ask the Fair-Pay Advisor
      </Link>
    </div>
  );
}