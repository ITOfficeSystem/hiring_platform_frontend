/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  useToast,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  Formik,
  Form,
  Field,
  type FieldProps,
  type FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { MOCK_HR_USERS } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import { FormContainer } from '../shared/FormContainer';

interface LoginForm {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Email is invalid').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const HRLogin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginForm = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginForm,
    actions: FormikHelpers<LoginForm>
  ) => {
    actions.setSubmitting(true);

    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = MOCK_HR_USERS.find(
        (u) => u.email === values.email && u.password === values.password
      );

      if (user) {
        login(user);

        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${user.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });

        navigate('/hr/job-space');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <FormContainer maxW="lg" bg="blue.100">
      {/* Header Icon */}
      <VStack spacing={6} align="center" mb={6}>
        <Box
          bg="blue.100"
          p={4}
          borderRadius="full"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FaUserTie} boxSize={8} color="blue.600" />
        </Box>

        {/* Demo Credentials */}
        <Box
          w="full"
          p={4}
          bg="blue.50"
          borderRadius="md"
          border="1px"
          borderColor="blue.200"
        >
          <Text fontSize="sm" fontWeight="medium" color="blue.800" mb={2}>
            Demo Credentials:
          </Text>
          <VStack spacing={1} align="start" fontSize="xs" color="blue.700">
            <Text>📧 hr.manager@gmail.com | 🔑 admin123</Text>
          </VStack>
        </Box>
      </VStack>

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ width: '100%' }}>
            <VStack spacing={4}>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <FormControl
                    isRequired
                    isInvalid={!!errors.email && touched.email}
                  >
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      bg="white"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field }: FieldProps) => (
                  <FormControl
                    isRequired
                    isInvalid={!!errors.password && touched.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        bg="white"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};
