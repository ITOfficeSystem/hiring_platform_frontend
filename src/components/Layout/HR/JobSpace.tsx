import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Heading,
  useToast,
  HStack,
  Link as ChakraLink,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "../shared/PageHeader";
import { DataTable } from "../shared/DataTable";
import { StatusBadge } from "../../ui/StatusBadge";
import type { Job } from "../../../types";
import { useJobs } from "../../../hooks/useJobs";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ErrorAlert } from "../../ui/ErrorAlert";
import { ActionButtons } from "../shared/ActionButtons";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { motion } from "framer-motion";

export const JobSpace = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { jobs, loading, error, deleteJob } = useJobs();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [jobToDeleteId, setJobToDeleteId] = useState<number | null>(null);
  const [jobToDeleteTitle, setJobToDeleteTitle] = useState<string>("");

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("whiteAlpha.900", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  const MotionBox = motion(Box);

  const handleDeleteJobClick = (jobId: number, jobTitle: string) => {
    setJobToDeleteId(jobId);
    setJobToDeleteTitle(jobTitle);
    onOpen();
  };

  const confirmDelete = async () => {
    if (jobToDeleteId !== null) {
      try {
        await deleteJob(jobToDeleteId);
        toast({
          title: "Job Deleted",
          description: "The job posting has been successfully removed.",
          status: "success",
          duration: 3000,
          position: "top-right",
        });
      } catch (error) {
        console.error("Failed to delete job:", error);
        toast({
          title: "Error",
          description: "Failed to delete job posting.",
          status: "error",
          duration: 5000,
          position: "top-right",
        });
      } finally {
        onClose();
        setJobToDeleteId(null);
        setJobToDeleteTitle("");
      }
    }
  };

  const handleEditJob = (jobId: number) => {
    navigate(`/hr/jobs/edit/${jobId}`);
  };

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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      key: "title",
      label: "Job Title",
      render: (_: string, row: Job) => (
        <VStack align="start" spacing={1}>
          <ChakraLink
            as={Link}
            to={`/hr/dashboard?jobId=${row.id}`}
            fontWeight="medium"
            color="blue.500"
            _hover={{ textDecoration: "underline" }}
          >
            {row.title}
          </ChakraLink>
          <Text fontSize="sm" color={subTextColor}>
            {row.company}
          </Text>
        </VStack>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (value: string) => <Text fontSize="sm">{value}</Text>,
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <StatusBadge status={value} variant="subtle" />
      ),
    },
    {
      key: "salary",
      label: "Salary",
      render: (value: string) => (
        <Text fontSize="sm" color={subTextColor}>
          {value || "N/A"}
        </Text>
      ),
    },
    {
      key: "posted",
      label: "Posted",
      render: (value: string) => (
        <Text fontSize="sm">{new Date(value).toLocaleDateString()}</Text>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: string, row: Job) => (
        <ActionButtons
          onEdit={() => handleEditJob(row.id)}
          onDelete={() => handleDeleteJobClick(row.id, row.title)}
          showEdit={true}
          showDelete={true}
          showView={false}
        />
      ),
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Types" },
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
  ];

  const headerActions = (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        px={4}
        rightIcon={<Avatar size="sm" name={user?.name} />}
      >
        <Flex direction="column" align="start" mr={2}>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {user?.name}
          </Text>
          <Text fontSize="xs" color={subTextColor}>
            {user?.role}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );

  if (loading) {
    return <LoadingSpinner message="Loading job listings..." />;
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <ErrorAlert
            message={error}
            onRetry={() => window.location.reload()}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <PageHeader
        title="Hire Me"
        subtitle="Manage job applications and candidates"
        actions={headerActions}
      />

      <Container maxW="7xl" py={8}>
        <MotionBox
          bg={cardBg}
          borderRadius="2xl"
          shadow="xl"
          p={6}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HStack justify="space-between" mb={6}>
            <Heading size="md" color={textColor}>
              Manage Jobs
            </Heading>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => navigate("/hr/jobs/create")}
              borderRadius="xl"
            >
              Create Job
            </Button>
          </HStack>

          <DataTable
            data={filteredJobs}
            columns={columns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue={typeFilter}
            onFilterChange={setTypeFilter}
            filterOptions={filterOptions}
            emptyMessage="No job postings found matching your criteria."
          />
        </MotionBox>
      </Container>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Job Posting
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete the job posting for "
              <Text as="span" fontWeight="bold">
                {jobToDeleteTitle}
              </Text>
              "? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
