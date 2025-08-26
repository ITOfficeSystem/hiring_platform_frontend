import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  InputGroup,
  Input,
  InputLeftElement,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaBriefcase,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApplications } from "../../../hooks/useApplications";
import { useJobs } from "../../../hooks/useJobs";
import { useAuth } from "../../../hooks/useAuth";
import { StatsGrid } from "../shared/StatsGrid";
import { DataTable } from "../shared/DataTable";
import { StatusBadge } from "../../ui/StatusBadge";
import { ActionButtons } from "../shared/ActionButtons";
import type { Application } from "../../../types";

const MotionBox = motion(Box);

export const HRDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { applications } = useApplications();
  const { jobs } = useJobs();
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.50, blue.100)",
    "linear(to-r, gray.700, gray.900)"
  );
  const sectionBg = useColorModeValue("white", "gray.800");

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const jobIdFilter = queryParams.get("jobId")
    ? Number(queryParams.get("jobId"))
    : null;

  const filteredJobTitle = useMemo(() => {
    if (jobIdFilter) {
      const job = jobs.find((j) => j.id === jobIdFilter);
      return job ? job.title : null;
    }
    return null;
  }, [jobIdFilter, jobs]);

  const handleNavigateToJobs = () => navigate("/hr/job-space");
  const handleNavigateToOfficeDashboard = () => window.location.href = "http://localhost:5173/login";
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "info",
      duration: 3000,
      position: "top-right",
    });
    navigate("/hr/login");
  };

  const handleViewApplication = (applicationId: string) =>
    navigate(`/hr/applications/${applicationId}`);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || app.overallStatus === statusFilter;
    const matchesJob = jobIdFilter === null || app.jobId === jobIdFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const stats = [
    {
      label: "Total Applications",
      value: filteredApplications.length,
      helpText: filteredJobTitle ? `for ${filteredJobTitle}` : "All time",
    },
    {
      label: "Pending Review",
      value: filteredApplications.filter(
        (app) => app.currentRound === "CV Screening"
      ).length,
      helpText: "CV Screening",
      color: "yellow.500",
    },
    {
      label: "Technical Stage",
      value: filteredApplications.filter(
        (app) => app.currentRound === "Technical Interview"
      ).length,
      helpText: "Assessment",
      color: "orange.500",
    },
    {
      label: "Interviews",
      value: filteredApplications.filter(
        (app) => app.currentRound === "HR Interview"
      ).length,
      helpText: "Scheduled",
      color: "cyan.500",
    },
    {
      label: "Accepted",
      value: filteredApplications.filter(
        (app) =>
          app.currentRound === "Completed" || app.overallStatus === "Selected"
      ).length,
      helpText: "Hired",
      color: "green.500",
    },
  ];

  const columns = [
    {
      key: "candidate",
      label: "Candidate",
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
      key: "position",
      label: "Position",
      render: (_: string, row: Application) => (
        <Text fontWeight="medium">{row.Job?.title}</Text>
      ),
    },
    {
      key: "overallStatus",
      label: "Status",
      render: (val: string) => <StatusBadge status={val} variant="subtle" />,
    },
    {
      key: "applied",
      label: "Applied",
      render: (val: string) => (
        <Text fontSize="sm">{new Date(val).toLocaleDateString()}</Text>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: string, row: Application) => (
        <ActionButtons
          onView={() => handleViewApplication(row.id)}
          showEdit={false}
          showDelete={false}
          showApprove={false}
          showReject={false}
        />
      ),
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "In Progress", label: "In Progress" },
    { value: "Selected", label: "Selected" },
    { value: "Rejected", label: "Rejected" },
  ];

  const headerActions = (
    <Menu>
      <MenuButton>
        <Avatar size="sm" name={user?.name} cursor="pointer" />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FaBriefcase />} onClick={handleNavigateToJobs}>
          Job Space
        </MenuItem>
        <MenuItem icon={<FaUserCircle />} onClick={handleNavigateToOfficeDashboard}>
          Office dashboard
        </MenuItem>
        <Divider />
        <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Box py={{ base: 12, md: 16 }} bgGradient={bgGradient} textAlign="center">
        <Container maxW="7xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading size="3xl" mb={4} fontWeight="bold">
              HR Dashboard
            </Heading>
            <Text fontSize="lg" maxW="2xl" mx="auto" mb={6}>
              {filteredJobTitle
                ? `Applications for ${filteredJobTitle}`
                : "Overview of all applications"}
            </Text>
            <HStack justify="center" spacing={4}>
              {headerActions}
            </HStack>
          </MotionBox>
        </Container>
      </Box>

      <Box py={8}>
        <Container maxW="7xl">
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <StatsGrid stats={stats} />
          </MotionBox>

          <Card mt={8} bg={sectionBg} shadow="md" borderRadius="xl">
            <CardHeader>
              <Heading size="md">Applications</Heading>
            </CardHeader>
            <CardBody>
              <InputGroup mb={4} maxW="md">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaSearch color="gray.400" />}
                />
                <Input
                  placeholder="Search by candidate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  rounded="full"
                  bg={useColorModeValue("white", "gray.700")}
                  shadow="sm"
                />
              </InputGroup>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
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
              </MotionBox>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};
