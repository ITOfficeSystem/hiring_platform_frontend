import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Button,
  Skeleton,
  SkeletonText,
  IconButton,
  Divider,
  InputGroup,
  Input,
  InputLeftElement,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { CgLock } from "react-icons/cg";
import {
  FaUserSecret,
  FaUserShield,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaMoon,
  FaSun,
  FaSearch,
} from "react-icons/fa";
import { JobCard } from "../components/ui/JobCard";
import { jobService } from "../services/jobService";
import { useEffect, useState } from "react";
import type { Job } from "../types";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const HomePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.50, blue.100)",
    "linear(to-r, gray.700, gray.900)"
  );
  const sectionBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.100");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Flex
        justify="flex-end"
        p={4}
        bg={useColorModeValue("white", "gray.900")}
        shadow="sm"
      >
        <IconButton
          aria-label="Toggle Dark Mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant="ghost"
        />
      </Flex>

      <Box
        py={{ base: 16, md: 24 }}
        textAlign="center"
        bgGradient={bgGradient}
        color={useColorModeValue("gray.900", "white")}
      >
        <Container maxW="7xl">
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading size="3xl" mb={4} fontWeight="bold">
              Find Your Dream Job
            </Heading>
            <Text fontSize="lg" maxW="2xl" mx="auto" mb={8}>
              Discover opportunities with top companies. Apply now and take the
              next step in your career.
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              rounded="full"
              px={8}
              _hover={{ transform: "scale(1.05)" }}
              transition="0.3s"
            >
              Browse Jobs
            </Button>
          </MotionBox>
        </Container>
      </Box>

      <Box py={6} bg={useColorModeValue("white", "gray.900")} shadow="sm">
        <Container maxW="7xl">
          <InputGroup maxW="lg" mx="auto">
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.400" />}
            />
            <Input
              placeholder="Search for jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg={useColorModeValue("white", "gray.700")}
              rounded="full"
              shadow="sm"
            />
          </InputGroup>
        </Container>
      </Box>

      <Box py={12}>
        <Container maxW="7xl">
          <Heading size="lg" textAlign="center" mb={8}>
            Latest Job Openings
          </Heading>

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {Array(6)
                .fill("")
                .map((_, i) => (
                  <Box
                    key={i}
                    p={6}
                    shadow="md"
                    borderWidth="1px"
                    rounded="md"
                    bg={sectionBg}
                  >
                    <Skeleton height="20px" mb={4} />
                    <SkeletonText noOfLines={3} spacing="4" />
                  </Box>
                ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <MotionBox
                    key={job.id}
                    p={6}
                    shadow="lg"
                    borderWidth="1px"
                    rounded="md"
                    bg={sectionBg}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCard job={job} />
                  </MotionBox>
                ))
              ) : (
                <Text textAlign="center" color="gray.500">
                  No job openings match your search.
                </Text>
              )}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      <Box py={16} bg={useColorModeValue("gray.100", "gray.900")}>
        <Container maxW="7xl">
          <Heading size="lg" textAlign="center" mb={12}>
            How Our Hiring Process Works
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={10}
            textAlign="center"
          >
            {[
              {
                icon: <FaUserSecret size={32} color="#2563eb" />,
                title: "1. Apply",
                desc: "Submit your CV and get instantly screened by our AI system for qualification matching.",
              },
              {
                icon: <CgLock size={32} color="#16a34a" />,
                title: "2. Aptitude Test",
                desc: "Complete a 45-minute multiple-choice aptitude test with automatic evaluation.",
              },
              {
                icon: <FaUserShield size={32} color="#7c3aed" />,
                title: "3. HR Interview",
                desc: "Final interview via Google Meet with our HR team to discuss culture fit and next steps.",
              },
            ].map((item, i) => (
              <MotionBox
                key={i}
                p={6}
                rounded="md"
                shadow="md"
                bg={sectionBg}
                whileHover={{ y: -5, shadow: "xl" }}
                transition={{ duration: 0.3 }}
              >
                <Flex
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  bg={useColorModeValue("gray.200", "gray.700")}
                  w={16}
                  h={16}
                  rounded="full"
                  align="center"
                  justify="center"
                  mx="auto"
                  mb={4}
                  boxShadow="md"
                >
                  {item.icon}
                </Flex>
                <Heading size="md" mb={2}>
                  {item.title}
                </Heading>
                <Text color="gray.500">{item.desc}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box bg={useColorModeValue("gray.900", "gray.800")} color="white" py={12}>
        <Container maxW="7xl">
          <VStack spacing={6} textAlign="center">
            <Text fontSize="lg" fontWeight="bold">
              JobFlow
            </Text>
            <Flex gap={6}>
              <Text _hover={{ textDecoration: "underline", cursor: "pointer" }}>
                Home
              </Text>
              <Text _hover={{ textDecoration: "underline", cursor: "pointer" }}>
                Jobs
              </Text>
              <Text _hover={{ textDecoration: "underline", cursor: "pointer" }}>
                Contact
              </Text>
            </Flex>
            <Flex gap={4}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebook />}
                colorScheme="facebook"
                variant="ghost"
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                colorScheme="linkedin"
                variant="ghost"
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                colorScheme="twitter"
                variant="ghost"
              />
            </Flex>
            <Divider borderColor="gray.700" />
            <Text fontSize="sm" color="gray.400">
              © {new Date().getFullYear()} JobFlow. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};
