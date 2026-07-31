import { apiClient, executeApiCall } from './client';
import { APIResponse, FairnessResult, GigPlatform } from '../types';
import { MOCK_FAIRNESS_RESULT } from './mocks/fairnessMock';

export interface CheckFairnessParams {
  basePay: number;
  tips?: number;
  hoursWorked: number;
  distanceMiles?: number;
  platform: GigPlatform;
}

/**
 * Perform AI Fairness Check on a specific shift
 */
export async function checkFairness(params: CheckFairnessParams): Promise<APIResponse<FairnessResult>> {
  return executeApiCall<FairnessResult>(
    async () => {
      const response = await apiClient.post<APIResponse<FairnessResult>>('/fairness/check', params);
      return response.data.data;
    },
    () => {
      const basePay = Number(params.basePay) || 0;
      const tips = Number(params.tips) || 0;
      const hours = Number(params.hoursWorked) || 1;
      const distance = Number(params.distanceMiles) || 0;

      const grossEarnings = basePay + tips;
      const hourlyRate = Math.round((grossEarnings / hours) * 100) / 100;
      const gasCost = Math.round(distance * 0.35 * 100) / 100; // estimated $0.35/mile gas cost
      const netHourlyPay = Math.round(((grossEarnings - gasCost) / hours) * 100) / 100;

      const regionalMinimumWage = 16.50;
      const isFair = netHourlyPay >= regionalMinimumWage;
      const fairnessScore = Math.min(100, Math.max(20, Math.round((netHourlyPay / 22.00) * 100)));

      const warnings: string[] = [];
      if (netHourlyPay < regionalMinimumWage) {
        warnings.push(`Net rate ($${netHourlyPay}/hr) is below local minimum wage threshold ($${regionalMinimumWage}/hr).`);
      }
      if (tips > basePay) {
        warnings.push('Earnings are heavily dependent on tips rather than base platform pay.');
      }
      if (gasCost > grossEarnings * 0.2) {
        warnings.push(`High vehicle operational expenses ($${gasCost}) reduced payout profitability.`);
      }

      return {
        hourlyRate,
        regionalMinimumWage,
        marketAverageHourlyRate: 22.00,
        fairnessScore,
        status: isFair ? 'FAIR' : 'UNDERPAID',
        breakdown: {
          basePayRatio: Math.round((basePay / grossEarnings) * 100) / 100 || 0,
          tipDependencyPercentage: Math.round((tips / grossEarnings) * 100) || 0,
          estimatedGasExpense: gasCost,
          netHourlyPay,
        },
        warnings,
      };
    }
  );
}
