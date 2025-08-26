import axiosInstance from '../api/axios';
import type { Application } from '../types';

export const applicationService = {
  submitApplication: async (formData: FormData) => {
    const response = await axiosInstance.post(
      "/api/candidates/apply",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getApplicationById: async (id: string): Promise<Application> => {
    const response = await axiosInstance.get(`/api/candidates/${id}`);
    return response.data.data;
  },

  getAllApplications: async (): Promise<Application[]> => {
    const response = await axiosInstance.get("/api/candidates");
    return response.data.data;
  },

  getApplicationsByJobId: async (jobId: number): Promise<Application[]> => {
    const response = await axiosInstance.get(`/api/candidates?jobId=${jobId}`);
    return response.data.data;
  },

  updateApplication: async (id: string, data: Partial<Application>) => {
    const response = await axiosInstance.patch(`/api/candidates/${id}`, data);
    return response.data;
  },

  sendEmail: async (
    id: string,
    emailData: {
      emailType: string;
      interviewDate?: string;
      interviewTime?: string;
    }
  ) => {
    const response = await axiosInstance.post(
      `/api/candidates/${id}/send-email`,
      emailData
    );
    return response.data;
  },

  analyzeCv: async (id: string) => {
    const response = await axiosInstance.post(
      `/api/candidates/${id}/screen-cv`
    );
    return response.data;
  },
};
