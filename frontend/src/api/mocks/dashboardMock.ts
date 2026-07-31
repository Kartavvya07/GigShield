import { DashboardSummary } from '../../types';

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  periodStart: '2026-07-25',
  periodEnd: '2026-07-31',
  totalEarnings: 685.50,
  totalHoursWorked: 29.5,
  overallHourlyRate: 23.24,
  totalJobsCount: 19,
  fairJobsCount: 16,
  underpaidJobsCount: 3,
  platformBreakdown: [
    {
      platform: 'Uber',
      totalAmount: 385.00,
      jobCount: 10,
      hoursWorked: 15.0,
    },
    {
      platform: 'DoorDash',
      totalAmount: 180.50,
      jobCount: 6,
      hoursWorked: 9.0,
    },
    {
      platform: 'Instacart',
      totalAmount: 120.00,
      jobCount: 3,
      hoursWorked: 5.5,
    },
  ],
  dailyEarningsTrend: [
    { day: 'Mon', earnings: 90.00, hours: 4.0 },
    { day: 'Tue', earnings: 115.50, hours: 5.0 },
    { day: 'Wed', earnings: 98.00, hours: 4.5 },
    { day: 'Thu', earnings: 142.00, hours: 6.0 },
    { day: 'Fri', earnings: 240.00, hours: 10.0 },
  ],
};
