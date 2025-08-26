import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: {
    to: string;
    label: string;
  };
  actions?: React.ReactNode;
  bg?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  backLink,
  actions,
  bg = 'white',
}: PageHeaderProps) => {
  return (
    <Box bg={bg} borderBottom="1px" borderColor="gray.200" py={4}>
      <Container maxW="7xl">
        <HStack justify="space-between" align="center">
          <Box>
            {backLink && (
              <ChakraLink
                as={Link}
                to={backLink.to}
                display="flex"
                alignItems="center"
                mb={2}
                color="blue.600"
                _hover={{ color: 'blue.800' }}
              >
                <Icon as={FaArrowLeft} mr={2} />
                {backLink.label}
              </ChakraLink>
            )}
            <Heading size="lg" mb={subtitle ? 1 : 0}>
              {title}
            </Heading>
            {subtitle && (
              <Text color="gray.600" fontSize="sm">
                {subtitle}
              </Text>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </HStack>
      </Container>
    </Box>
  );
};
