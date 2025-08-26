import { Box, Container } from '@chakra-ui/react';

interface FormContainerProps {
  children: React.ReactNode;
  maxW?: string;
  bg?: string;
}

export const FormContainer = ({
  children,
  maxW = '2xl',
  bg = 'blue.100',
}: FormContainerProps) => {
  return (
    <Box minH="100vh" bg={bg} alignContent={'center'}>
      <Container maxW={maxW} py={12} px={{ base: 4, md: 8 }}>
        <Box bg="white" p={8} borderRadius="lg" shadow="lg">
          {children}
        </Box>
      </Container>
    </Box>
  );
};
