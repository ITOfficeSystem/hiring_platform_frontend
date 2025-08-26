/* eslint-disable react-hooks/rules-of-hooks */
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
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaMapPin,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import { useEffect, useState } from "react";
import type { Job } from "../types";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.50, blue.100)",
    "linear(to-r, gray.800, gray.900)"
  );
  const cardBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id!);
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg={useColorModeValue("blue.50", "gray.900")}
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
        bg={useColorModeValue("blue.50", "gray.900")}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="lg" color="gray.500">
          Job not found
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")} pb={12}>
      {/* ✅ Header with Dark Mode Toggle */}
      <Flex
        justify="space-between"
        align="center"
        px={6}
        py={4}
        bg={useColorModeValue("white", "gray.900")}
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <ChakraLink
          as={Link}
          to="/"
          display="flex"
          alignItems="center"
          color="blue.500"
          fontWeight="bold"
          _hover={{ color: "blue.700" }}
        >
          <Icon as={FaArrowLeft} mr={2} />
          Back to Jobs
        </ChakraLink>
        <IconButton
          aria-label="Toggle Dark Mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant="ghost"
        />
      </Flex>

      {/* ✅ Hero Section */}
      <Box
        py={{ base: 10, md: 16 }}
        textAlign="center"
        bgGradient={bgGradient}
        color={useColorModeValue("gray.900", "white")}
      >
        <Container maxW="4xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading size="2xl" mb={4}>
              {job.title}
            </Heading>
            <Text fontSize="xl" color="blue.500" fontWeight="medium" mb={6}>
              {job.company}
            </Text>
            <HStack
              justify="center"
              spacing={6}
              color={useColorModeValue("gray.600", "gray.300")}
              mb={8}
            >
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
            <Badge
              colorScheme="purple"
              fontSize="md"
              px={4}
              py={2}
              rounded="full"
            >
              {job.type}
            </Badge>
          </MotionBox>
        </Container>
      </Box>

      {/* ✅ Job Details Card */}
      <Container maxW="4xl" mt={-10}>
        <MotionBox
          bg={cardBg}
          shadow="xl"
          rounded="xl"
          p={{ base: 6, md: 10 }}
          backdropFilter="blur(10px)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <VStack align="stretch" spacing={10}>
            {/* ✅ Apply Button */}
            <Flex justify="center">
              <Button
                size="lg"
                colorScheme="blue"
                rounded="full"
                px={8}
                _hover={{ transform: "scale(1.05)" }}
                transition="0.3s"
                onClick={() => navigate(`/jobs/${id}/apply`)}
              >
                Apply for this Position
              </Button>
            </Flex>

            <Divider />

            {/* ✅ Description */}
            <Box>
              <Heading size="md" mb={4}>
                Job Description
              </Heading>
              <Text
                color={useColorModeValue("gray.700", "gray.300")}
                lineHeight="taller"
              >
                {job.description}
              </Text>
            </Box>

            <Divider />

            {/* ✅ Responsibilities */}
            <Box>
              <Heading size="md" mb={4}>
                Key Responsibilities
              </Heading>
              <List spacing={3}>
                {job.responsibilities.map((resp, i) => (
                  <ListItem
                    key={i}
                    color={useColorModeValue("gray.700", "gray.300")}
                  >
                    <ListIcon as={FaCheckCircle} color="green.400" />
                    {resp}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* ✅ Requirements */}
            <Box>
              <Heading size="md" mb={4}>
                Requirements
              </Heading>
              <Flex wrap="wrap" gap={3}>
                {job.requirements.map((req, i) => (
                  <Badge
                    key={i}
                    variant="solid"
                    colorScheme="blue"
                    fontSize="sm"
                    px={4}
                    py={2}
                    rounded="full"
                    _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                    transition="0.3s"
                  >
                    {req}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Divider />

            {/* ✅ Benefits */}
            <Box>
              <Heading size="md" mb={4}>
                Benefits & Perks
              </Heading>
              <List spacing={3}>
                {job.benefits.map((benefit, i) => (
                  <ListItem
                    key={i}
                    color={useColorModeValue("gray.700", "gray.300")}
                  >
                    <ListIcon as={FaCheckCircle} color="blue.400" />
                    {benefit}
                  </ListItem>
                ))}
              </List>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};
