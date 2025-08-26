import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const hrToken = localStorage.getItem('hrToken');
      const hrUser = localStorage.getItem('hrUser');

      if (hrToken && hrUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/hr/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Verifying authentication...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
