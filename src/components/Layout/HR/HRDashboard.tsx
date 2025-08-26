import {
  Box,
  Container,
  VStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplications } from '../../../hooks/useApplications';
import { useJobs } from '../../../hooks/useJobs';
import { PageHeader } from '../shared/PageHeader';
import { StatsGrid } from '../shared/StatsGrid';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../../ui/StatusBadge';
import type { Application } from '../../../types';
import { ActionButtons } from '../shared/ActionButtons';

export const HRDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { applications, updateApplicationStatus, sendEmail } =
    useApplications();
  const { jobs } = useJobs();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const jobIdFilter = queryParams.get('jobId')
    ? Number(queryParams.get('jobId'))
    : null;

  const filteredJobTitle = useMemo(() => {
    if (jobIdFilter) {
      const job = jobs.find((j) => j.id === jobIdFilter);
      return job ? job.title : null;
    }
    return null;
  }, [jobIdFilter, jobs]);

  const handleViewApplication = (applicationId: string) => {
    navigate(`/hr/applications/${applicationId}`);
  };

  const handleSendEmail = (application: Application, emailType: string) => {
    sendEmail(application.id, emailType);
  };

  const handleStatusUpdate = async (
    applicationId: string,
    statusType: keyof Application,
    newValue: string
  ) => {
    try {
      await updateApplicationStatus(applicationId, statusType, newValue);
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        status: 'error',
        duration: 5000,
        position: 'top-right',
      });
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await updateApplicationStatus(
        applicationId,
        'overallStatus',
        'Selected',
        'Completed'
      );
    } catch (error) {
      console.error('Failed to approve application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status and round',
        status: 'error',
        duration: 5000,
        position: 'top-right',
      });
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || app.overallStatus === statusFilter;
    const matchesJob = jobIdFilter === null || app.jobId === jobIdFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  // Calculate stats based on filteredApplications
  const stats = [
    {
      label: 'Total Applications',
      value: filteredApplications.length, // Use filteredApplications
      helpText: filteredJobTitle ? `for ${filteredJobTitle}` : 'All time',
    },
    {
      label: 'Pending Review',
      value: filteredApplications.filter(
        (app) => app.currentRound === 'CV Screening'
      ).length, // Use filteredApplications
      helpText: 'CV Screening',
      color: 'yellow.500',
    },
    {
      label: 'Technical Stage',
      value: filteredApplications.filter(
        (app) => app.currentRound === 'Technical Interview'
      ).length, // Use filteredApplications
      helpText: 'Assessment',
      color: 'orange.500',
    },
    {
      label: 'Interviews',
      value: filteredApplications.filter(
        (app) => app.currentRound === 'HR Interview'
      ).length, // Use filteredApplications
      helpText: 'Scheduled',
      color: 'cyan.500',
    },
    {
      label: 'Accepted',
      value: filteredApplications.filter(
        (app) =>
          app.currentRound === 'Completed' || app.overallStatus === 'Selected'
      ).length, // Use filteredApplications
      helpText: 'Hired',
      color: 'green.500',
    },
  ];

  const columns = [
    {
      key: 'candidate',
      label: 'Candidate',
      render: (_: string, row: Application) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">{row.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {row.email}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'position',
      label: 'Position',
      render: (_: string, row: Application) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">{row.Job?.title}</Text>
        </VStack>
      ),
    },
    {
      key: 'overallStatus',
      label: 'Status',
      render: (value: string) => (
        <StatusBadge status={value} variant="subtle" />
      ),
    },
    {
      key: 'createdAt',
      label: 'Applied',
      render: (value: string) => (
        <Text fontSize="sm">{new Date(value).toLocaleDateString()}</Text>
      ),
    },
    {
      key: 'currentRound',
      label: 'Round',
      render: (value: string) => (
        <StatusBadge status={value} variant="subtle" />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: string, row: Application) => (
        <ActionButtons
          onView={() => handleViewApplication(row.id)}
          onApprove={
            row.cvStatus === 'Pending' ? () => handleApprove(row.id) : undefined
          }
          onReject={
            row.cvStatus === 'Pending'
              ? () => handleStatusUpdate(row.id, 'overallStatus', 'Rejected')
              : undefined
          }
          onSendEmail={
            row.overallStatus === 'Selected' || row.overallStatus === 'Rejected'
              ? () => handleSendEmail(row, 'follow-up')
              : undefined
          }
          showApprove={row.cvStatus === 'Pending'}
          showReject={row.cvStatus === 'Pending'}
          showEmail={
            row.overallStatus === 'Selected' || row.overallStatus === 'Rejected'
          }
          showEdit={false}
          showDelete={false}
        />
      ),
    },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Selected', label: 'Selected' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <PageHeader
        title="Dashboard"
        subtitle={`Applications for: ${filteredJobTitle}`}
      />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Stats */}
          <StatsGrid stats={stats} />

          {/* Applications */}
          <Card>
            <CardHeader>
              <Heading size="md">Applications</Heading>
            </CardHeader>
            <CardBody>
              <DataTable
                data={filteredApplications}
                columns={columns}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterValue={statusFilter}
                onFilterChange={setStatusFilter}
                filterOptions={filterOptions}
                emptyMessage="No applications found matching your criteria."
              />
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};
