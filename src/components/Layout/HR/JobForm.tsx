/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useJobs } from "../../../hooks/useJobs"; // Use the new useJobs hook
import { PageHeader } from "../shared/PageHeader";
import type { JobFormValues } from "../../../types";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ErrorAlert } from "../../ui/ErrorAlert";

const validationSchema = Yup.object({
  title: Yup.string().required("Job title is required"),
  company: Yup.string().required("Company name is required"),
  location: Yup.string().required("Location is required"),
  type: Yup.string().required("Job type is required"),
  description: Yup.string().required("Job description is required"),
});

export const JobForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams<{ id: string }>(); // Get ID from URL for editing
  const { jobs, loading, createJob, updateJob } = useJobs(); // Use useJobs hook

  const [initialValues, setInitialValues] = useState<JobFormValues | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  useEffect(() => {
    if (id) {
      setFormLoading(true);

      if (!loading && Array.isArray(jobs)) {
        const jobToEdit = jobs.find((job) => job && job.id === Number(id));

        if (jobToEdit) {
          setInitialValues({
            title: jobToEdit.title || "",
            company: jobToEdit.company || "",
            location: jobToEdit.location || "",
            type: jobToEdit.type as JobFormValues["type"],
            salary: jobToEdit.salary || "",
            description: jobToEdit.description || "",
            requirements: jobToEdit.requirements || [],
            responsibilities: jobToEdit.responsibilities || [],
            benefits: jobToEdit.benefits || [],
            posted: jobToEdit.posted || "",
          });
        } else {
          setFormError("Job not found.");
        }
        setFormLoading(false);
      }
    } else {
      setInitialValues({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: [],
        responsibilities: [],
        benefits: [],
        posted: new Date().toLocaleDateString(),
      });
      setFormLoading(false);
    }
  }, [id, jobs, loading]);

  const handleSubmit = async (values: JobFormValues) => {
    try {
      if (id) {
        // Update existing job
        await updateJob(Number(id), values);
        toast({
          title: "Job Updated Successfully!",
          description: "The job posting has been updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        // Create new job
        await createJob(values);
        toast({
          title: "Job Created Successfully!",
          description: "The job posting has been created.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
      navigate("/hr/job-space");
    } catch (error: any) {
      toast({
        title: id ? "Update Failed" : "Creation Failed",
        description: error.response?.data?.error || "Failed to process job",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const addArrayItem = (
    currentArray: string[],
    newItem: string,
    setFieldValue: any,
    fieldName: string,
    setInput: (value: string) => void
  ) => {
    if (newItem.trim() && !currentArray.includes(newItem.trim())) {
      setFieldValue(fieldName, [...currentArray, newItem.trim()]);
      setInput("");
    }
  };

  const removeArrayItem = (
    currentArray: string[],
    itemToRemove: string,
    setFieldValue: any,
    fieldName: string
  ) => {
    setFieldValue(
      fieldName,
      currentArray.filter((item) => item !== itemToRemove)
    );
  };

  if (formLoading) {
    return (
      <LoadingSpinner
        message={id ? "Loading job details..." : "Preparing form..."}
      />
    );
  }

  if (formError) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="4xl" py={8}>
          <ErrorAlert
            message={formError}
            onRetry={() => navigate("/hr/job-space")}
          />
          <Button mt={4} onClick={() => navigate("/hr/job-space")}>
            Back to Job Listings
          </Button>
        </Container>
      </Box>
    );
  }

  if (!initialValues) {
    return null; // Should not happen if formLoading and formError are handled
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <PageHeader
        title={id ? "Edit Job Posting" : "Create New Job"}
        subtitle={
          id
            ? "Update the details for this job"
            : "Fill out the form below to create a new job posting"
        }
        backLink={{ to: "/hr/job-space", label: "Back to Job Listings" }}
      />

      <Container maxW="4xl" py={8}>
        <Box bg="white" p={8} borderRadius="lg" shadow="lg">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form>
                <VStack spacing={6} align="stretch">
                  {/* Basic Information */}
                  <Heading size="md" color="gray.700">
                    Basic Information
                  </Heading>

                  <HStack spacing={4}>
                    <Field name="title">
                      {({ field }: FieldProps) => (
                        <FormControl
                          isInvalid={!!errors.title && touched.title}
                        >
                          <FormLabel>Job Title</FormLabel>
                          <Input
                            {...field}
                            placeholder="Senior Frontend Developer"
                          />
                          <FormErrorMessage>{errors.title}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="company">
                      {({ field }: FieldProps) => (
                        <FormControl
                          isInvalid={!!errors.company && touched.company}
                        >
                          <FormLabel>Company</FormLabel>
                          <Input {...field} placeholder="TechCorp Inc." />
                          <FormErrorMessage>{errors.company}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </HStack>

                  <HStack spacing={4}>
                    <Field name="location">
                      {({ field }: FieldProps) => (
                        <FormControl
                          isInvalid={!!errors.location && touched.location}
                        >
                          <FormLabel>Location</FormLabel>
                          <Input {...field} placeholder="San Francisco, CA" />
                          <FormErrorMessage>{errors.location}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="type">
                      {({ field }: FieldProps) => (
                        <FormControl isInvalid={!!errors.type && touched.type}>
                          <FormLabel>Job Type</FormLabel>
                          <Select {...field}>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </Select>
                          <FormErrorMessage>{errors.type}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="salary">
                      {({ field }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Salary (Optional)</FormLabel>
                          <Input {...field} placeholder="$120k - $160k" />
                        </FormControl>
                      )}
                    </Field>
                  </HStack>

                  {/* Description */}
                  <Field name="description">
                    {({ field }: FieldProps) => (
                      <FormControl
                        isInvalid={!!errors.description && touched.description}
                      >
                        <FormLabel>Job Description</FormLabel>
                        <Textarea
                          {...field}
                          placeholder="Describe the role, responsibilities, and what you're looking for..."
                          rows={6}
                        />
                        <FormErrorMessage>
                          {errors.description}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  {/* Requirements */}
                  <FormControl>
                    <FormLabel>Requirements</FormLabel>
                    <HStack>
                      <Input
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="Add a requirement (e.g., React, 5+ years experience)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem(
                              values.requirements,
                              requirementInput,
                              setFieldValue,
                              "requirements",
                              setRequirementInput
                            );
                          }
                        }}
                      />
                      <Button
                        onClick={() =>
                          addArrayItem(
                            values.requirements,
                            requirementInput,
                            setFieldValue,
                            "requirements",
                            setRequirementInput
                          )
                        }
                        colorScheme="blue"
                        variant="outline"
                      >
                        Add
                      </Button>
                    </HStack>
                    <Wrap mt={2}>
                      {values.requirements.map((req, index) => (
                        <WrapItem key={index}>
                          <Tag size="md" colorScheme="blue" variant="subtle">
                            <TagLabel>{req}</TagLabel>
                            <TagCloseButton
                              onClick={() =>
                                removeArrayItem(
                                  values.requirements,
                                  req,
                                  setFieldValue,
                                  "requirements"
                                )
                              }
                            />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </FormControl>

                  {/* Responsibilities */}
                  <FormControl>
                    <FormLabel>Responsibilities</FormLabel>
                    <HStack>
                      <Input
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        placeholder="Add a responsibility"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem(
                              values.responsibilities,
                              responsibilityInput,
                              setFieldValue,
                              "responsibilities",
                              setResponsibilityInput
                            );
                          }
                        }}
                      />
                      <Button
                        onClick={() =>
                          addArrayItem(
                            values.responsibilities,
                            responsibilityInput,
                            setFieldValue,
                            "responsibilities",
                            setResponsibilityInput
                          )
                        }
                        colorScheme="green"
                        variant="outline"
                      >
                        Add
                      </Button>
                    </HStack>
                    <Wrap mt={2}>
                      {values.responsibilities.map((resp, index) => (
                        <WrapItem key={index}>
                          <Tag size="md" colorScheme="green" variant="subtle">
                            <TagLabel>{resp}</TagLabel>
                            <TagCloseButton
                              onClick={() =>
                                removeArrayItem(
                                  values.responsibilities,
                                  resp,
                                  setFieldValue,
                                  "responsibilities"
                                )
                              }
                            />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </FormControl>

                  {/* Benefits */}
                  <FormControl>
                    <FormLabel>Benefits</FormLabel>
                    <HStack>
                      <Input
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="Add a benefit"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem(
                              values.benefits,
                              benefitInput,
                              setFieldValue,
                              "benefits",
                              setBenefitInput
                            );
                          }
                        }}
                      />
                      <Button
                        onClick={() =>
                          addArrayItem(
                            values.benefits,
                            benefitInput,
                            setFieldValue,
                            "benefits",
                            setBenefitInput
                          )
                        }
                        colorScheme="purple"
                        variant="outline"
                      >
                        Add
                      </Button>
                    </HStack>
                    <Wrap mt={2}>
                      {values.benefits.map((benefit, index) => (
                        <WrapItem key={index}>
                          <Tag size="md" colorScheme="purple" variant="subtle">
                            <TagLabel>{benefit}</TagLabel>
                            <TagCloseButton
                              onClick={() =>
                                removeArrayItem(
                                  values.benefits,
                                  benefit,
                                  setFieldValue,
                                  "benefits"
                                )
                              }
                            />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </FormControl>

                  {/* Submit Button */}
                  <HStack spacing={4} pt={4}>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      isLoading={isSubmitting}
                      flex={1}
                    >
                      {id ? "Update Job" : "Create Job"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate("/hr/job-space")}
                      flex={1}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};
