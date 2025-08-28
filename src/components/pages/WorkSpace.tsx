import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { JobDetailsPage } from "../../pages/JobDetailsPage";
import { ApplicationForm } from "../Layout/ApplicationForm";
import { ApplicationSuccess } from "../Layout/ApplicationSuccess";
import { HRLogin } from "../Layout/HR/HRLogin";
import { HRDashboard } from "../Layout/HR/HRDashboard";
import { ProtectedRoute } from "../common/ProtectedRoute";
import { TechnicalAssessment } from "../Layout/TechnicalAssessment";
import { JobForm } from "../Layout/HR/JobForm";
import { ApplicationDetails } from "../Layout/HR/ApplicationDetails";
import { JobSpace } from "../Layout/HR/JobSpace";

export const WorkSpace = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/apply" element={<ApplicationForm />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route
          path="/technical-assessment/:candidateId"
          element={<TechnicalAssessment />}
        />
        {/* HR Routes */}
        <Route path="/hr/login" element={<HRLogin />} />
        <Route
          path="/hr/job-space"
          element={
            <ProtectedRoute>
              <JobSpace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/create"
          element={
            <ProtectedRoute>
              <JobForm /> {/* Use JobForm for creation */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/edit/:id" // New route for editing jobs
          element={
            <ProtectedRoute>
              <JobForm /> {/* Use JobForm for editing */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
