/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { jobService } from "../services/jobService";
import type { Job } from "../types";

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch jobs";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (
    jobData: Omit<Job, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newJob = await jobService.createJob(jobData);
      setJobs((prev) => [...prev, newJob]);
      toast({
        title: "Job Created",
        description: "Job posting created successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return newJob;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create job";
      toast({
        title: "Creation Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      throw err;
    }
  };

  const updateJob = async (id: number, jobData: Partial<Job>) => {
    try {
      const updatedJob = await jobService.updateJob(id, jobData);
      setJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)));
      toast({
        title: "Job Updated",
        description: "Job posting updated successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return updatedJob;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update job";
      toast({
        title: "Update Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      throw err;
    }
  };

  const deleteJob = async (id: number) => {
    try {
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast({
        title: "Job Deleted",
        description: "Job posting deleted successfully.",
        status: "info",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete job";
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  };
};
