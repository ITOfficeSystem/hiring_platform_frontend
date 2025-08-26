/* eslint-disable react-hooks/rules-of-hooks */
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
  useColorModeValue,
} from "@chakra-ui/react";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Field, Form, Formik, type FieldProps } from "formik";
import { applicationService } from "../../services/applicationService";
import { motion } from "framer-motion";

interface FormValues {
  name: string;
  email: string;
  cvLink: File | null;
  jobId: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  cvLink: Yup.mixed<File>()
    .required("CV file is required")
    .test(
      "fileSize",
      "File size too large (max 5MB)",
      (value): value is File => !!value && value.size <= 5 * 1024 * 1024
    ),
});

export const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const initialValues: FormValues = {
    name: "",
    email: "",
    cvLink: null,
    jobId: Number.parseInt(id!),
  };

  const bgColor = useColorModeValue("whiteAlpha.900", "gray.800");
  const containerBg = useColorModeValue("blue.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const MotionBox = motion(Box);

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("jobId", String(values.jobId));
      if (values.cvLink) {
        formData.append("cvLink", values.cvLink);
      }

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
    <Box minH="100vh" bg={containerBg} py={12}>
      <Container maxW="2xl">
        <ChakraLink
          as={Link}
          to={`/jobs/${id}`}
          display="flex"
          alignItems="center"
          mb={6}
          color="blue.500"
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
        >
          <Icon as={FaArrowLeft} mr={2} />
          Back to Job Details
        </ChakraLink>

        <MotionBox
          bg={bgColor}
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          shadow="xl"
          border="1px solid"
          borderColor={borderColor}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VStack align="stretch" spacing={4} mb={6}>
            <Heading size="lg" color={textColor}>
              Apply for Position
            </Heading>
            <Text color={labelColor}>
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
                  {/* Name & Email */}
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <Field name="name">
                      {({ field }: FieldProps) => (
                        <FormControl isInvalid={!!errors.name && touched.name}>
                          <FormLabel color={labelColor}>Full Name</FormLabel>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            size="lg"
                            borderRadius="xl"
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <FormControl
                          isInvalid={!!errors.email && touched.email}
                        >
                          <FormLabel color={labelColor}>
                            Email Address
                          </FormLabel>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john@example.com"
                            size="lg"
                            borderRadius="xl"
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>

                  {/* File Upload */}
                  <Field name="cvLink">
                    {({ form }: FieldProps) => (
                      <FormControl
                        isInvalid={!!errors.cvLink && touched.cvLink}
                      >
                        <FormLabel color={labelColor}>
                          Upload Resume/CV
                        </FormLabel>
                        <Flex
                          align="center"
                          justify="center"
                          p={4}
                          border="2px dashed"
                          borderColor={borderColor}
                          borderRadius="xl"
                          cursor="pointer"
                          transition="all 0.3s"
                          _hover={{
                            bg: useColorModeValue("gray.50", "gray.700"),
                          }}
                        >
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            opacity={0}
                            position="absolute"
                            w="100%"
                            h="100%"
                            cursor="pointer"
                            onChange={(event) =>
                              form.setFieldValue(
                                "cvLink",
                                event.currentTarget.files?.[0] || null
                              )
                            }
                          />
                          <Icon as={FaUpload} mr={2} color="blue.400" />
                          <Text color={textColor}>
                            {form.values.cvLink
                              ? form.values.cvLink.name
                              : "Click to upload your CV"}
                          </Text>
                        </Flex>
                        <FormErrorMessage>
                          {errors.cvLink as string}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    isLoading={isSubmitting}
                  >
                    Submit Application
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </MotionBox>
      </Container>
    </Box>
  );
};
