import { apiClient, executeApiCall } from './client';
import { APIResponse, CreateJobInput, Job } from '../types';
import { MOCK_JOBS } from './mocks/jobsMock';

/**
 * Fetch list of all logged gig jobs
 */
export async function getJobs(): Promise<APIResponse<Job[]>> {
  return executeApiCall<Job[]>(
    async () => {
      const response = await apiClient.get<APIResponse<Job[]>>('/jobs');
      return response.data.data;
    },
    () => [...MOCK_JOBS]
  );
}

/**
 * Log a new manual job entry
 */
export async function createJob(input: CreateJobInput): Promise<APIResponse<Job>> {
  return executeApiCall<Job>(
    async () => {
      const response = await apiClient.post<APIResponse<Job>>('/jobs', input);
      return response.data.data;
    },
    () => {
      const basePay = Number(input.basePay) || 0;
      const tips = Number(input.tips) || 0;
      const hoursWorked = Number(input.hoursWorked) || 1;
      const totalEarnings = basePay + tips;
      const hourlyRate = totalEarnings / hoursWorked;

      const newJob: Job = {
        id: `job_${Date.now()}`,
        platform: input.platform,
        title: input.title || `${input.platform} Shift`,
        date: input.date || new Date().toISOString().split('T')[0],
        basePay,
        tips,
        totalEarnings,
        hoursWorked,
        distanceMiles: input.distanceMiles || 0,
        location: input.location || 'Local Area',
        notes: input.notes || '',
        isFair: hourlyRate >= 16.5,
        createdAt: new Date().toISOString(),
      };

      // Add to local mock array for persistence in mock mode
      MOCK_JOBS.unshift(newJob);
      return newJob;
    }
  );
}

/**
 * Delete a logged job entry by ID
 */
export async function deleteJob(id: string): Promise<APIResponse<{ id: string }>> {
  return executeApiCall<{ id: string }>(
    async () => {
      const response = await apiClient.delete<APIResponse<{ id: string }>>(`/jobs/${id}`);
      return response.data.data;
    },
    () => {
      const index = MOCK_JOBS.findIndex((j) => j.id === id);
      if (index !== -1) {
        MOCK_JOBS.splice(index, 1);
      }
      return { id };
    }
  );
}
