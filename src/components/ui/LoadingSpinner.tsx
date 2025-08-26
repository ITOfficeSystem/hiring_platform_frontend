import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingSpinner = ({
  message = 'Loading...',
  size = 'xl',
}: LoadingSpinnerProps) => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner size={size} color="blue.500" />
        <Text>{message}</Text>
      </VStack>
    </Box>
  );
};
