import { useState, useEffect } from 'react';
import { getWeeklyInsights } from '../api';
import {
  TrendingUp,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyInsightsView() {
  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getWeeklyInsights();
      if (res?.data) {
        setInsight(res.data);
      }
    } catch (err) {
      console.error('[WeeklyInsights Error]:', err);
      setError(err?.message || 'Failed to load weekly insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
        <p className="font-bold text-slate-700 text-sm">Generating AI Weekly Insights...</p>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-700">{error || 'Unable to load insight data.'}</p>
        <button
          onClick={fetchInsights}
          className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-slate-400 hover:text-slate-700">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Weekly AI Insights</h2>
            <p className="text-xs text-slate-500 font-medium">Week ending {insight.weekEndingDate}</p>
          </div>
        </div>
        <span className="bg-teal-100 text-teal-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /> AI Report
        </span>
      </div>

      {/* Headline Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-teal-400 font-bold uppercase tracking-wider">
          <span>Executive Summary</span>
          <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-md">{insight.fairnessRating}</span>
        </div>
        <p className="text-base font-bold leading-snug">{insight.headlineSummary}</p>
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-300">Top Performing Platform:</span>
          <span className="font-extrabold text-teal-300 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-400" /> {insight.topPlatform}
          </span>
        </div>
      </div>

      {/* Highlights */}
      {insight.highlights?.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Earnings Highlights
          </h3>
          <ul className="space-y-2">
            {insight.highlights.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks & Anomalies */}
      {insight.anomaliesOrRisks?.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2">
          <h3 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Detected Pay Anomalies & Risks
          </h3>
          <ul className="space-y-2">
            {insight.anomaliesOrRisks.map((item, idx) => (
              <li key={idx} className="text-xs text-amber-900 flex items-start gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {insight.recommendations?.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic Recommendations
          </h3>
          <ul className="space-y-2">
            {insight.recommendations.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-teal-600 shrink-0">#{idx + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projected Monthly Earnings */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-teal-700 font-bold uppercase tracking-wider">Projected Monthly Earnings</p>
          <p className="text-2xl font-black text-teal-950 mt-0.5">${insight.projectedMonthlyEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-teal-500 text-white p-3 rounded-2xl shadow-md">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
