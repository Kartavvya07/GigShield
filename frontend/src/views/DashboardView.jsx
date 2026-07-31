import { useContext } from 'react';
import { EarningsContext } from '../context/EarningsContext';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Trash2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardView() {
  const { jobs, dashboardSummary, flaggedJobs, isLoading, error, refreshData, removeJob } =
    useContext(EarningsContext);

  if (isLoading && !dashboardSummary) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
        <p className="font-bold text-slate-700 text-sm">Loading GigShield Dashboard...</p>
      </div>
    );
  }

  const totalEarnings = dashboardSummary?.totalEarnings ?? jobs.reduce((acc, j) => acc + (j.totalEarnings || j.fare || 0), 0);
  const totalHours = dashboardSummary?.totalHoursWorked ?? jobs.reduce((acc, j) => acc + (j.hoursWorked || j.time || 0), 0);
  const hourlyRate = dashboardSummary?.overallHourlyRate ?? (totalHours > 0 ? (totalEarnings / totalHours).toFixed(2) : '0.00');
  const flaggedCount = dashboardSummary?.underpaidJobsCount ?? flaggedJobs.length;

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Weekly Overview</h2>
          <p className="text-xs text-slate-500 font-medium">Aggregated Shift & Earnings Telemetry</p>
        </div>
        <button
          onClick={refreshData}
          className="text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refreshData} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-teal-600" /> Total Earnings
            </p>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">${Number(totalEarnings).toFixed(2)}</p>
          <p className="text-[11px] text-teal-600 font-bold mt-1">Avg ${hourlyRate}/hr net</p>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-teal-600" /> Active Hours
          </p>
          <p className="text-3xl font-black text-slate-900">{Number(totalHours).toFixed(1)}h</p>
          <p className="text-[11px] text-slate-400 font-bold mt-1">{jobs.length} shifts logged</p>
        </div>
      </div>

      {/* Underpaid Fairness Alert Banner */}
      {flaggedCount > 0 && (
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-500 text-white p-2 rounded-xl shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-red-600 uppercase tracking-wider">Fairness Protection Alert</p>
              <p className="font-bold text-red-950 text-sm">
                {flaggedCount} shift{flaggedCount > 1 ? 's' : ''} flagged for underpayment
              </p>
            </div>
          </div>
          <p className="text-xs text-red-800 mt-2 font-medium leading-relaxed">
            Net hourly pay fell below minimum wage floors after vehicle gas expenses.
          </p>
          <Link
            to="/advisor"
            className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 mt-2 underline"
          >
            Draft dispute with AI Advisor <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Platform Breakdown */}
      {dashboardSummary?.platformBreakdown && dashboardSummary.platformBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-teal-600" /> Platform Payout Distribution
          </h3>
          <div className="space-y-2">
            {dashboardSummary.platformBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <span className="font-semibold text-slate-700">{item.platform}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{item.jobCount} shifts ({item.hoursWorked}h)</span>
                  <span className="font-bold text-slate-900">${item.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Earnings Trend */}
      {dashboardSummary?.dailyEarningsTrend && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-teal-600" /> Daily Earnings Trend
          </h3>
          <div className="flex items-end justify-between h-24 gap-2 pt-2">
            {dashboardSummary.dailyEarningsTrend.map((d, idx) => {
              const maxVal = Math.max(...dashboardSummary.dailyEarningsTrend.map((x) => x.earnings)) || 1;
              const heightPct = Math.max(15, Math.round((d.earnings / maxVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-600">${Math.round(d.earnings)}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-teal-500 hover:bg-teal-600 rounded-t-md transition-all"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Shifts List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-base text-slate-900">Recent Shift Logs</h3>
          <Link to="/log" className="text-xs font-bold text-teal-600 hover:underline">
            + Log New Shift
          </Link>
        </div>

        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-400 text-xs">
              No shifts logged yet. Tap "+ Log New Shift" to scan or manually add a record.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900">{job.platform}</p>
                    {job.isFair === false || job.isFlagged ? (
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" /> Underpaid
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Fair
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {job.date} • {job.hoursWorked || job.time}h • ${Number(job.totalEarnings || job.fare || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigation Quick Link Cards */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          to="/advisor"
          className="bg-slate-900 text-white rounded-2xl p-4 shadow-md text-center font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-teal-400" /> Ask AI Advisor
        </Link>
        <Link
          to="/weekly-insights"
          className="bg-teal-600 text-white rounded-2xl p-4 shadow-md text-center font-bold text-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-1.5"
        >
          <TrendingUp className="w-4 h-4 text-teal-200" /> Weekly Insights
        </Link>
      </div>
    </div>
  );
}