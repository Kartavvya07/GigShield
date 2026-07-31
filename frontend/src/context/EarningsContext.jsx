import { createContext, useState } from 'react';

export const EarningsContext = createContext();

export const EarningsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([
    { id: 1, platform: 'Zepto', fare: 48, time: 2.1, distance: 12, isFlagged: true },
    { id: 2, platform: 'Swiggy', fare: 120, time: 1.8, distance: 8, isFlagged: false },
  ]);
  
  const [alerts, setAlerts] = useState([
    { id: 1, message: "Zepto delivery paid ₹48 for 2.1 hrs — below the ₹70/hr fair floor." }
  ]);

  const logJob = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
    if (newJob.fare / newJob.time < 70) {
      setAlerts(prev => [{ id: Date.now(), message: `New trip flagged: Below minimum hourly rate.` }, ...prev]);
    }
  };

  return (
    <EarningsContext.Provider value={{ jobs, alerts, logJob }}>
      {children}
    </EarningsContext.Provider>
  );
};
