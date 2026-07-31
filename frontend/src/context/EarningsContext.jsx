import { createContext, useState, useEffect, useCallback } from 'react';
import { getJobs, createJob, deleteJob, getDashboardSummary } from '../api';

export const EarningsContext = createContext();

export const EarningsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [jobsRes, dashboardRes] = await Promise.all([
        getJobs(),
        getDashboardSummary(),
      ]);

      if (jobsRes.data) {
        setJobs(jobsRes.data);
      }
      if (dashboardRes.data) {
        setDashboardSummary(dashboardRes.data);
      }
    } catch (err) {
      console.error('[EarningsContext Error]:', err);
      setError(err?.message || 'Failed to sync earnings data from server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const logJob = async (jobInput) => {
    setIsLoading(true);
    try {
      const res = await createJob(jobInput);
      if (res.data) {
        await loadData();
      }
      return res.data;
    } catch (err) {
      console.error('[logJob Error]:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeJob = async (id) => {
    setIsLoading(true);
    try {
      await deleteJob(id);
      await loadData();
    } catch (err) {
      console.error('[removeJob Error]:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Flagged jobs filter
  const flaggedJobs = jobs.filter((j) => j.isFair === false);

  return (
    <EarningsContext.Provider
      value={{
        jobs,
        dashboardSummary,
        flaggedJobs,
        isLoading,
        error,
        refreshData: loadData,
        logJob,
        removeJob,
      }}
    >
      {children}
    </EarningsContext.Provider>
  );
};