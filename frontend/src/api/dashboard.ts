import { apiClient, executeApiCall } from './client';
import { APIResponse, DashboardSummary } from '../types';
import { MOCK_DASHBOARD_SUMMARY } from './mocks/dashboardMock';

/**
 * Fetch aggregated weekly earnings and platform dashboard summary
 */
export async function getDashboardSummary(): Promise<APIResponse<DashboardSummary>> {
  return executeApiCall<DashboardSummary>(
    async () => {
      const response = await apiClient.get<APIResponse<DashboardSummary>>('/dashboard/summary');
      return response.data.data;
    },
    () => MOCK_DASHBOARD_SUMMARY
  );
}
