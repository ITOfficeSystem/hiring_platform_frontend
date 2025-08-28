/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../api/axios";
import type { Application } from "../types";

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

  approveCVAndSchedule: async (applicationId: string) => {
    const response = await axiosInstance.post(
      `/api/candidates/${applicationId}/approve-and-schedule`
    );
    return response.data;
  },

  sendTechnicalAssessment: async (
    applicationId: string,
    data: {
      interviewDate: string;
      interviewTime: string;
      instructions?: string;
    }
  ) => {
    const response = await axiosInstance.post(
      `/api/candidates/${applicationId}/send-technical-assessment`,
      data
    );
    return response.data;
  },

  analyzeCv: async (id: string) => {
    const response = await axiosInstance.post(
      `/api/candidates/${id}/screen-cv`
    );
    return response.data;
  },

  saveAssessmentFormData: async (userData: {
    name: string;
    email: string;
    phone: string;
    roomCode: string;
  }) => {
    const response = await axiosInstance.post(
      "/api/candidates/save-assessment-form",
      userData
    );
    return response.data;
  },

  submitTechnicalAssessment: async (
    candidateId: string,
    assessmentData: {
      answers: { [key: number]: string };
      testResults: { [key: number]: any[] };
      timeSpent: number;
      completedAt: string;
      userInfo: {
        name: string;
        email: string;
        phone: string;
        candidateId: string;
      };
    }
  ) => {
    const response = await axiosInstance.post(
      `/api/candidates/${candidateId}/technical-assessment`,
      assessmentData
    );
    return response.data;
  },

  getTechnicalAssessment: async (applicationId: string) => {
    const response = await axiosInstance.get(
      `/api/candidates/${applicationId}/technical-assessment`
    );
    return response.data;
  },
};
