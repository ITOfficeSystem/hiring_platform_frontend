import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { CgLock } from 'react-icons/cg';
import { FaUserSecret, FaUserShield } from 'react-icons/fa';
import { JobCard } from '../components/ui/JobCard';
import { jobService } from '../services/jobService';
import { useEffect, useState } from 'react';
import type { Job } from '../types';

export const HomePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Box minH="100vh" bg="blue.100">
      {/* Hero Section */}
      <Box py={20} textAlign="center">
        <Container maxW="7xl">
          <Heading size="2xl" mb={6} color="gray.900">
            Find Your Dream Job
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto" mb={8}>
            Discover exciting opportunities with top companies. Apply now and
            take the next step in your career.
          </Text>
        </Container>
      </Box>

      {/* Job Lists */}
      <Box py={5}>
        <Container maxW="7xl">
          <Heading size="lg" textAlign="center" mb={8}>
            Latest Job Openings
          </Heading>

          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <Text textAlign="center" color="gray.600">
                  No job openings available right now.
                </Text>
              )}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={16} bg="white">
        <Container maxW="7xl">
          <Heading size="lg" textAlign="center" mb={12}>
            How Our Hiring Process Works
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            textAlign="center"
          >
            <Box>
              <Flex
                bg="blue.100"
                w={16}
                h={16}
                rounded="full"
                align="center"
                justify="center"
                mx="auto"
                mb={4}
              >
                <FaUserSecret size={32} color="#2563eb" />
              </Flex>
              <Heading size="md" mb={2}>
                1. Apply
              </Heading>
              <Text color="gray.600">
                Submit your CV and get instantly screened by our AI system for
                initial qualification matching.
              </Text>
            </Box>
            <Box>
              <Flex
                bg="green.100"
                w={16}
                h={16}
                rounded="full"
                align="center"
                justify="center"
                mx="auto"
                mb={4}
              >
                <CgLock size={32} color="#16a34a" />
              </Flex>
              <Heading size="md" mb={2}>
                2. Aptitude Test
              </Heading>
              <Text color="gray.600">
                Complete a 45-minute multiple-choice aptitude test with
                automatic evaluation.
              </Text>
            </Box>
            <Box>
              <Flex
                bg="purple.100"
                w={16}
                h={16}
                rounded="full"
                align="center"
                justify="center"
                mx="auto"
                mb={4}
              >
                <FaUserShield size={32} color="#7c3aed" />
              </Flex>
              <Heading size="md" mb={2}>
                3. HR Interview
              </Heading>
              <Text color="gray.600">
                Final interview via Google Meet with our HR team to discuss
                culture fit and next steps.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" color="white" py={12}>
        <Container maxW="7xl">
          <VStack spacing={4} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              © 2024 JobFlow. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};
