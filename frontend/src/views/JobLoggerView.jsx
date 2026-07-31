import { useState, useContext } from 'react';
import { EarningsContext } from '../context/EarningsContext';
import { UploadCloud, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JobLoggerView() {
  const { logJob } = useContext(EarningsContext);
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [fare, setFare] = useState('');
  const [time, setTime] = useState('');

  const handleScan = () => {
    setIsScanning(true);
    // Simulate OCR delay
    setTimeout(() => {
      setIsScanning(false);
      setFare('145');
      setTime('2.5');
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logJob({
      id: Date.now(),
      platform: 'Auto-Scanned',
      fare: Number(fare),
      time: Number(time),
      distance: 10,
      isFlagged: (Number(fare) / Number(time)) < 70
    });
    navigate('/');
  };

  return (
    <div className="p-5 animate-fade-in">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Log a Shift</h2>
      
      <div 
        onClick={handleScan}
        className="border-2 border-dashed border-teal-200 bg-teal-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-100 transition-colors mb-8"
      >
        {isScanning ? (
          <>
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
            <p className="font-bold text-teal-900">Scanning Receipt AI...</p>
          </>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-teal-600 mb-3" />
            <p className="font-bold text-teal-900">Tap to Smart Scan Receipt</p>
            <p className="text-xs text-teal-600 mt-1">Upload a screenshot from Uber, Zomato, etc.</p>
          </>
        )}
      </div>

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or enter manually</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Total Fare (₹)</label>
          <input 
            type="number" 
            required
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            placeholder="e.g. 150"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Time Taken (Hours)</label>
          <input 
            type="number" 
            required
            step="0.1"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            placeholder="e.g. 1.5"
          />
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white font-bold rounded-xl p-4 flex justify-center items-center gap-2 mt-6">
          <CheckCircle className="w-5 h-5" /> Save Shift Record
        </button>
      </form>
    </div>
  );
}