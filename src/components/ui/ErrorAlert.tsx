import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert = ({
  title = 'Error!',
  message,
  onRetry,
}: ErrorAlertProps) => {
  return (
    <Alert
      status="error"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="sm" mb={4}>
        {message}
      </AlertDescription>
      {onRetry && (
        <Button colorScheme="red" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Alert>
  );
};
