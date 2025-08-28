import { Box, VStack, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import React from "react";

interface TechnicalAssessmentSuccessProps {
  onReturnHome?: () => void;
}

const TechnicalAssessmentSuccess: React.FC<TechnicalAssessmentSuccessProps> = ({
  onReturnHome,
}) => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <VStack spacing={6} textAlign="center">
        <Icon as={CheckCircleIcon} boxSize={16} color="green.500" />
        <Heading size="2xl" color="green.600">
          Thank You!
        </Heading>
        <Text fontSize="lg" color="gray.700">
          Your technical assessment has been successfully submitted.
          <br />
          Our HR team will review your submission and get in touch with you soon
          via email.
        </Text>
        <Button
          colorScheme="blue"
          onClick={onReturnHome || (() => window.location.reload())}
        >
          Return to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default TechnicalAssessmentSuccess;
