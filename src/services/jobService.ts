import axiosInstance from '../api/axios';
import type { Job } from '../types';

export const jobService = {
  getAllJobs: async (): Promise<Job[]> => {
    const response = await axiosInstance.get('/api/jobs');
    return response.data.data;
  },

  getJobById: async (id: string): Promise<Job | null> => {
    try {
      const response = await axiosInstance.get(`/api/jobs/${id}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  createJob: async (
    jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Job> => {
    const response = await axiosInstance.post('/api/jobs', jobData);
    return response.data.data;
  },

  updateJob: async (id: number, jobData: Partial<Job>): Promise<Job> => {
    const response = await axiosInstance.put(`/api/jobs/${id}`, jobData);
    return response.data.data;
  },

  deleteJob: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/jobs/${id}`);
  },
};
