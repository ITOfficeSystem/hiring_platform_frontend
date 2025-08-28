/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { applicationService } from "../services/applicationService"; // Use applicationService
import type { Application } from "../types";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getAllApplications(); // Use service function
      setApplications(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch applications";
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

  const updateApplicationStatus = async (
    applicationId: string,
    statusType: keyof Application,
    newValue: string,
    newRound?:
      | "CV Screening"
      | "Technical Interview"
      | "HR Interview"
      | "Completed"
  ) => {
    try {
      const updatePayload: any = { [statusType]: newValue };
      if (newRound) updatePayload.currentRound = newRound;

      await applicationService.updateApplication(applicationId, updatePayload); // Use service function

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, ...updatePayload } : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Successfully updated ${statusType} to ${newValue}`,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "Failed to update application status",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateApplicationStatus,
  };
};
