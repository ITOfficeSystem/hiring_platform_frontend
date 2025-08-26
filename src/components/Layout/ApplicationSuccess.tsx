/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  Badge,
  Divider,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheckCircle, FaEnvelope, FaEye } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const ApplicationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const applicationData = location.state;

  useEffect(() => {
    if (!applicationData) {
      navigate("/");
    }
  }, [applicationData, navigate]);

  const handleBackToJobs = () => {
    navigate("/");
  };

  if (!applicationData) return null;

  const bgColor = useColorModeValue("whiteAlpha.900", "gray.800");
  const containerBg = useColorModeValue("blue.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const MotionBox = motion(Box);

  return (
    <Box minH="100vh" bg={containerBg} py={12}>
      <Container maxW="2xl">
        <MotionBox
          bg={bgColor}
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          shadow="xl"
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8}>
            <MotionBox
              bg="green.100"
              p={6}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              whileHover={{ scale: 1.05 }}
            >
              <Icon as={FaCheckCircle} boxSize={12} color="green.500" />
            </MotionBox>
            <VStack spacing={3}>
              <Heading size="lg" color={textColor}>
                Application Submitted Successfully!
              </Heading>
              <Text fontSize="md" color={subTextColor} maxW="md">
                Thank you for your interest! We've received your application and
                will review it shortly.
              </Text>
            </VStack>
            <Box
              bg={useColorModeValue("white", "gray.700")}
              p={6}
              borderRadius="xl"
              shadow="md"
              w="full"
              maxW="md"
              textAlign="left"
            >
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="medium" color={textColor}>
                    Name:
                  </Text>
                  <Text fontFamily="mono" fontSize="sm" color="blue.500">
                    {applicationData.data.name}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="medium" color={textColor}>
                    Application ID:
                  </Text>
                  <Text fontFamily="mono" fontSize="sm" color="blue.500">
                    #{applicationData.data.id}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="medium" color={textColor}>
                    Status:
                  </Text>
                  <Badge colorScheme="blue" variant="subtle">
                    {applicationData.data.cvStatus}
                  </Badge>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="medium" color={textColor}>
                    Submitted:
                  </Text>
                  <Text fontSize="sm" color={subTextColor}>
                    {new Date(
                      applicationData.data.createdAt
                    ).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
            <Divider maxW="md" />
            <VStack spacing={4} maxW="md" align="stretch">
              <Heading size="md" color={textColor} textAlign="center">
                What happens next?
              </Heading>
              <VStack spacing={3} align="stretch">
                <HStack>
                  <Icon as={FaEnvelope} color="blue.500" />
                  <Text fontSize="sm" color={subTextColor}>
                    You'll receive a confirmation email within 5 minutes
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaEye} color="blue.500" />
                  <Text fontSize="sm" color={subTextColor}>
                    Our HR team will review your application within 2-3 business
                    days
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} color="blue.500" />
                  <Text fontSize="sm" color={subTextColor}>
                    If selected, you'll receive an invitation for the aptitude
                    test
                  </Text>
                </HStack>
              </VStack>
            </VStack>
            <Button
              variant="solid"
              colorScheme="blue"
              size="lg"
              w="full"
              maxW="md"
              borderRadius="xl"
              onClick={handleBackToJobs}
            >
              Browse More Jobs
            </Button>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};
