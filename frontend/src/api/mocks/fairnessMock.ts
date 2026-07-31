import { FairnessResult } from '../../types';

export const MOCK_FAIRNESS_RESULT: FairnessResult = {
  hourlyRate: 15.20,
  regionalMinimumWage: 16.50,
  marketAverageHourlyRate: 22.00,
  fairnessScore: 62,
  status: 'UNDERPAID',
  breakdown: {
    basePayRatio: 0.78,
    tipDependencyPercentage: 21.5,
    estimatedGasExpense: 5.40,
    netHourlyPay: 13.04,
  },
  warnings: [
    'Net hourly rate ($13.04/hr after gas) is below the local minimum wage of $16.50/hr.',
    'High reliance on customer tips to meet basic pay thresholds.',
    'Fuel expenses consumed 15% of gross payout.',
  ],
};
