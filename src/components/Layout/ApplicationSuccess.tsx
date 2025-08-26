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
} from '@chakra-ui/react';
import { FaCheckCircle, FaEnvelope, FaEye } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const ApplicationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const applicationData = location.state;

  useEffect(() => {
    if (!applicationData) {
      navigate('/');
    }
  }, [applicationData, navigate]);

  const handleBackToJobs = () => {
    navigate('/');
  };

  if (!applicationData) return null;

  return (
    <Box minH="100vh" bg="blue.100">
      <Container maxW="2xl" py={16}>
        <VStack spacing={8} textAlign="center">
          {/* Success Icon */}
          <Box
            bg="green.100"
            p={6}
            borderRadius="full"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaCheckCircle} boxSize={12} color="green.500" />
          </Box>

          {/* Success Message */}
          <VStack spacing={4}>
            <Heading size="xl" color="gray.900">
              Application Submitted Successfully!
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="md">
              Thank you for your interest! We've received your application and
              will review it shortly.
            </Text>
          </VStack>

          {/* Application Details Card */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="md"
            w="full"
            maxW="md"
            textAlign="left"
          >
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="medium" color="gray.700">
                  Application Name:
                </Text>
                <Text fontFamily="mono" fontSize="sm" color="blue.600">
                  {applicationData.data.name}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium" color="gray.700">
                  Application ID:
                </Text>
                <Text fontFamily="mono" fontSize="sm" color="blue.600">
                  #{applicationData.data.id}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium" color="gray.700">
                  Status:
                </Text>
                <Badge colorScheme="blue" variant="subtle">
                  {applicationData.data.cvStatus}
                </Badge>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium" color="gray.700">
                  Submitted:
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {new Date(
                    applicationData.data.createdAt
                  ).toLocaleDateString()}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Divider maxW="md" />

          {/* Next Steps */}
          <VStack spacing={4} maxW="md">
            <Heading size="md" color="gray.900">
              What happens next?
            </Heading>
            <VStack spacing={3} align="stretch">
              <HStack>
                <Icon as={FaEnvelope} color="blue.500" />
                <Text fontSize="sm" color="gray.600">
                  You'll receive a confirmation email within 5 minutes
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaEye} color="blue.500" />
                <Text fontSize="sm" color="gray.600">
                  Our HR team will review your application within 2-3 business
                  days
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="blue.500" />
                <Text fontSize="sm" color="gray.600">
                  If selected, you'll receive an invitation for the aptitude
                  test
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Action Buttons */}
          <VStack spacing={3} w="full" maxW="md">
            <Button
              variant="outline"
              size="lg"
              w="full"
              onClick={handleBackToJobs}
            >
              Browse More Jobs
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
