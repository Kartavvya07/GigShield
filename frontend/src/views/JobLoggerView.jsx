import { useState, useContext, useRef, useEffect } from 'react';
import { EarningsContext } from '../context/EarningsContext';
import { analyzeScreenshot, checkFairness } from '../api';
import {
  UploadCloud,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Fuel,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JobLoggerView() {
  const { logJob } = useContext(EarningsContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [platform, setPlatform] = useState('Uber');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [basePay, setBasePay] = useState('');
  const [tips, setTips] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [distanceMiles, setDistanceMiles] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Status & OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzingFairness, setIsAnalyzingFairness] = useState(false);
  const [ocrRawText, setOcrRawText] = useState('');
  const [ocrConfidence, setOcrConfidence] = useState(null);
  const [fairnessResult, setFairnessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle Image File Selection for Gemini OCR Pipeline
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const res = await analyzeScreenshot(file);
      if (res?.data) {
        const ocr = res.data;
        if (ocr.platform) setPlatform(ocr.platform);
        if (ocr.detectedPay) setBasePay(String(ocr.detectedPay));
        if (ocr.detectedTips) setTips(String(ocr.detectedTips));
        if (ocr.detectedHours) setHoursWorked(String(ocr.detectedHours));
        if (ocr.detectedDate) setDate(ocr.detectedDate);
        if (ocr.confidenceScore) setOcrConfidence(ocr.confidenceScore);
        if (ocr.rawText) setOcrRawText(ocr.rawText);

        // Auto-run fairness check with OCR values
        runFairnessAnalysis({
          platform: ocr.platform || platform,
          basePay: ocr.detectedPay || 0,
          tips: ocr.detectedTips || 0,
          hoursWorked: ocr.detectedHours || 1,
          distanceMiles: Number(distanceMiles) || 10,
        });
      }
    } catch (err) {
      console.error('[OCR Error]:', err);
      setErrorMessage(err?.message || 'Failed to scan image. Please enter shift details manually.');
    } finally {
      setIsScanning(false);
    }
  };

  // Run Real-Time Fairness Analysis
  const runFairnessAnalysis = async (params) => {
    if (!params.basePay || !params.hoursWorked) return;
    setIsAnalyzingFairness(true);

    try {
      const res = await checkFairness({
        platform: params.platform,
        basePay: Number(params.basePay) || 0,
        tips: Number(params.tips) || 0,
        hoursWorked: Number(params.hoursWorked) || 1,
        distanceMiles: Number(params.distanceMiles) || 0,
      });

      if (res?.data) {
        setFairnessResult(res.data);
      }
    } catch (err) {
      console.error('[Fairness Check Error]:', err);
    } finally {
      setIsAnalyzingFairness(false);
    }
  };

  // Trigger fairness check whenever numbers change
  useEffect(() => {
    const p = Number(basePay);
    const h = Number(hoursWorked);
    if (p > 0 && h > 0) {
      const timer = setTimeout(() => {
        runFairnessAnalysis({
          platform,
          basePay: p,
          tips: Number(tips) || 0,
          hoursWorked: h,
          distanceMiles: Number(distanceMiles) || 0,
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [basePay, tips, hoursWorked, distanceMiles, platform]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      await logJob({
        platform,
        title: title || `${platform} Shift`,
        date,
        basePay: Number(basePay) || 0,
        tips: Number(tips) || 0,
        hoursWorked: Number(hoursWorked) || 1,
        distanceMiles: Number(distanceMiles) || 0,
        location,
        notes,
      });
      navigate('/');
    } catch (err) {
      console.error('[Submit Error]:', err);
      setErrorMessage(err?.message || 'Failed to save shift record. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 animate-fade-in pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Log a Shift</h2>
          <p className="text-xs text-slate-500 font-medium">Smart AI OCR screenshot capture & fair pay verification</p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-teal-300 bg-gradient-to-b from-teal-50/60 to-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-100/50 transition-all shadow-sm mb-6 group"
      >
        {isScanning ? (
          <div className="flex flex-col items-center py-2">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
            <p className="font-bold text-teal-900 text-sm">Gemini AI Extracting Shift Details...</p>
            <p className="text-xs text-teal-600 mt-1">Analyzing platform, fare, tips, and duration</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="bg-teal-500 text-white p-3 rounded-full mb-3 shadow-md group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-900 text-base">Tap to Smart Scan Receipt</p>
            <p className="text-xs text-slate-500 mt-1">Upload screenshot from Uber, DoorDash, Zomato, Swiggy, etc.</p>
          </div>
        )}
      </div>

      {ocrConfidence !== null && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-6 flex items-center justify-between text-xs text-teal-900">
          <span className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-4 h-4 text-teal-600" /> OCR Confidence Score: {Math.round(ocrConfidence * 100)}%
          </span>
          <span className="bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-bold">Auto-Filled</span>
        </div>
      )}

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Uber">Uber</option>
              <option value="DoorDash">DoorDash</option>
              <option value="Swiggy">Swiggy</option>
              <option value="Zomato">Zomato</option>
              <option value="Instacart">Instacart</option>
              <option value="Lyft">Lyft</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Base Pay ($ / ₹)</label>
            <input
              type="number"
              step="0.01"
              required
              value={basePay}
              onChange={(e) => setBasePay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 35.00"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tips ($ / ₹)</label>
            <input
              type="number"
              step="0.01"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 8.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hours Worked</label>
            <input
              type="number"
              step="0.1"
              required
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Distance (Miles)</label>
            <input
              type="number"
              step="0.1"
              value={distanceMiles}
              onChange={(e) => setDistanceMiles(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 15.0"
            />
          </div>
        </div>

        {/* Live Fairness Analysis Result Box */}
        {isAnalyzingFairness && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" /> Computing AI Fairness Score...
          </div>
        )}

        {fairnessResult && !isAnalyzingFairness && (
          <div className={`border rounded-2xl p-4 space-y-3 ${
            fairnessResult.status === 'UNDERPAID'
              ? 'bg-red-50/70 border-red-200'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {fairnessResult.status === 'UNDERPAID' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
                <span className="font-bold text-slate-900 text-sm">AI Fairness Evaluation</span>
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                fairnessResult.status === 'UNDERPAID'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Score: {fairnessResult.fairnessScore}/100 ({fairnessResult.status})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/80 rounded-xl p-2 border border-slate-100">
                <p className="text-slate-400 font-medium">Net Rate</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">${fairnessResult.breakdown.netHourlyPay}/hr</p>
              </div>
              <div className="bg-white/80 rounded-xl p-2 border border-slate-100">
                <p className="text-slate-400 font-medium">Min Floor</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">${fairnessResult.regionalMinimumWage}/hr</p>
              </div>
              <div className="bg-white/80 rounded-xl p-2 border border-slate-100">
                <p className="text-slate-400 font-medium flex items-center justify-center gap-0.5">
                  <Fuel className="w-3 h-3 text-slate-500" /> Gas Cost
                </p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">${fairnessResult.breakdown.estimatedGasExpense}</p>
              </div>
            </div>

            {fairnessResult.warnings?.length > 0 && (
              <div className="space-y-1 pt-1">
                {fairnessResult.warnings.map((w, idx) => (
                  <p key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl p-4 flex justify-center items-center gap-2 shadow-lg transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
          ) : (
            <CheckCircle className="w-5 h-5 text-teal-400" />
          )}
          <span>{isSaving ? 'Saving Shift...' : 'Save Shift Record'}</span>
        </button>
      </form>
    </div>
  );
}