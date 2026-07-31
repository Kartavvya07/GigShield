import { apiClient, executeApiCall } from './client';
import { APIResponse, WeeklyInsight } from '../types';
import { MOCK_WEEKLY_INSIGHT } from './mocks/weeklyInsightsMock';

/**
 * Fetch AI generated weekly insight summary
 */
export async function getWeeklyInsights(): Promise<APIResponse<WeeklyInsight>> {
  return executeApiCall<WeeklyInsight>(
    async () => {
      const response = await apiClient.get<APIResponse<WeeklyInsight>>('/weekly-insights');
      return response.data.data;
    },
    () => MOCK_WEEKLY_INSIGHT
  );
}
