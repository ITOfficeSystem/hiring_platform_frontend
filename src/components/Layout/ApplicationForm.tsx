/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Field, Form, Formik, type FieldProps } from 'formik';
import { applicationService } from '../../services/applicationService';

interface FormValues {
  name: string;
  email: string;
  cvLink: File | null;
  jobId: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  cvLink: Yup.mixed<File>()
  .required('CV file is required')
  .test(
    'fileSize',
    'File size too large (max 5MB)',
    (value): value is File => !!value && value.size <= 5 * 1024 * 1024
  ),
});


export const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const initialValues: FormValues = {
    name: '',
    email: '',
    cvLink: null,
    jobId: Number.parseInt(id!),
  };

const handleSubmit = async (values: FormValues) => {
  console.log({values})
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("jobId", String(values.jobId));
    if (values.cvLink) {
      formData.append("cvLink", values.cvLink);
    }

    console.log({formData})

    const response = await applicationService.submitApplication(formData);
  

    toast({
      title: "Application Submitted Successfully!",
      description: "Your application has been received.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });

    navigate("/application-success", { state: response });
  } catch (error: any) {
    let errorMessage =
      "There was an error submitting your application. Please try again.";
    if (error.response?.data) {
      errorMessage = error.response.data.error || errorMessage;
    }
    toast({
      title: "Submission Failed",
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }
};


  return (
    <Box minH="100vh" bg="blue.100">
      <Container maxW="2xl" py={12}>
        <ChakraLink
          as={Link}
          to={`/jobs/${id}`}
          display="flex"
          alignItems="center"
          mb={6}
          color="blue.600"
          _hover={{ color: 'blue.800' }}
        >
          <Icon as={FaArrowLeft} mr={2} />
          Back to Job Details
        </ChakraLink>
        <Box bg="white" p={8} borderRadius="lg" shadow="lg">
          <VStack align="stretch" spacing={6} mb={8}>
            <Heading size="lg">Apply for Position</Heading>
            <Text color="gray.600">
              Fill out the form below to submit your application. All fields are
              required.
            </Text>
          </VStack>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <VStack spacing={6} align="stretch">
                  <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                    <Field name="name">
                      {({ field }: FieldProps) => (
                        <FormControl isInvalid={!!errors.name && touched.name}>
                          <FormLabel>Full Name</FormLabel>
                          <Input {...field} placeholder="John Doe" />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <FormControl
                          isInvalid={!!errors.email && touched.email}
                        >
                          <FormLabel>Email Address</FormLabel>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john@example.com"
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
                  <Field name="cvLink">
                    {({ form }: FieldProps) => (
                      <FormControl
                        isInvalid={!!errors.cvLink && touched.cvLink}
                      >
                        <FormLabel>Upload Resume/CV</FormLabel>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) =>
                            form.setFieldValue("cvLink", event.currentTarget.files?.[0] || null)
                          }
                        />
                        <FormErrorMessage>{errors.cvLink as string}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    Submit Application
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};
