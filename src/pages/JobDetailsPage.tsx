import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Link as ChakraLink,
  Icon,
  Divider,
  List,
  ListItem,
  ListIcon,
  Spinner,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaMapPin,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useEffect, useState } from 'react';
import type { Job } from '../types';

export const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id!);
        console.log('data', data);
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);
  console.log(job);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="blue.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (!job) {
    return (
      <Box
        minH="100vh"
        bg="blue.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="lg" color="gray.700">
          Job not found
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="blue.100">
      <Container maxW="4xl" py={8}>
        {/* Back link */}
        <ChakraLink
          as={Link}
          to="/"
          display="flex"
          alignItems="center"
          mb={6}
          color="blue.600"
          _hover={{ color: 'blue.800' }}
        >
          <Icon as={FaArrowLeft} mr={2} />
          Back to Jobs
        </ChakraLink>

        <Box bg="white" borderRadius="lg" shadow="lg" overflow="hidden">
          {/* Header */}
          <Box p={8} bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <Flex justify="space-between" align="flex-start" mb={4}>
              <VStack align="start" spacing={2}>
                <Heading size="xl" color="gray.900">
                  {job.title}
                </Heading>
                <Text fontSize="lg" color="blue.600" fontWeight="medium">
                  {job.company}
                </Text>
              </VStack>
              <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                {job.type}
              </Badge>
            </Flex>

            <HStack spacing={6} color="gray.600" mb={6}>
              <HStack>
                <Icon as={FaMapPin} />
                <Text>{job.location}</Text>
              </HStack>
              <HStack>
                <Icon as={FaDollarSign} />
                <Text>{job.salary}</Text>
              </HStack>
              <HStack>
                <Icon as={FaClock} />
                <Text>Posted {job.posted}</Text>
              </HStack>
            </HStack>

            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => navigate(`/jobs/${id}/apply`)}
              px={8}
            >
              Apply for this Position
            </Button>
          </Box>

          {/* Content */}
          <Box p={8}>
            <VStack align="stretch" spacing={8}>
              {/* Description */}
              <Box>
                <Heading size="md" mb={4} color="gray.900">
                  Job Description
                </Heading>
                <Text color="gray.700" lineHeight="tall">
                  {job.description}
                </Text>
              </Box>

              <Divider />

              {/* Responsibilities */}
              <Box>
                <Heading size="md" mb={4} color="gray.900">
                  Key Responsibilities
                </Heading>
                <List spacing={2}>
                  {job.responsibilities.map((resp, i) => (
                    <ListItem key={i} color="gray.700">
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      {resp}
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider />

              {/* Requirements */}
              <Box>
                <Heading size="md" mb={4} color="gray.900">
                  Requirements
                </Heading>
                <Flex wrap="wrap" gap={2}>
                  {job.requirements.map((req, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      colorScheme="blue"
                      fontSize="sm"
                      borderRadius={20}
                      px={3}
                      py={1}
                    >
                      {req}
                    </Badge>
                  ))}
                </Flex>
              </Box>

              <Divider />

              {/* Benefits */}
              <Box>
                <Heading size="md" mb={4} color="gray.900">
                  Benefits & Perks
                </Heading>
                <List spacing={2}>
                  {job.benefits.map((benefit, i) => (
                    <ListItem key={i} color="gray.700">
                      <ListIcon as={FaCheckCircle} color="blue.500" />
                      {benefit}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
