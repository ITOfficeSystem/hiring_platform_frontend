/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Badge,
  Progress,
  Alert,
  AlertTitle,
  AlertDescription,
  Code,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import {
  FaClock,
  FaPlay,
  FaStop,
  FaSave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { getDifficultyColor, formatTime } from "../../utils";
import { MOCK_QUESTIONS } from "../../constants";
import { useTimer } from "../../hooks/useTimer";
import Editor from "@monaco-editor/react";
import { applicationService } from "../../services/applicationService";
import { useNavigate, useParams } from "react-router-dom";
import TechnicalAssessmentSuccess from "./TechnicalAssessmentSuccess";

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  candidateId: string;
}

export const TechnicalAssessment = () => {
  const { candidateId } = useParams<{
    candidateId: string;
  }>();

  const toast = useToast();
  const navigate = useNavigate();
  const {
    isOpen: isSubmitModalOpen,
    onOpen: onSubmitModalOpen,
    onClose: onSubmitModalClose,
  } = useDisclosure();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    candidateId: candidateId || "",
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [code, setCode] = useState(MOCK_QUESTIONS[0].starterCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCodes, setSavedCodes] = useState<{ [key: number]: string }>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [assessmentStartTime] = useState(new Date());
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { timeRemaining, start: startTimer } = useTimer(45 * 60, () => {
    toast({
      title: "Time's Up!",
      description: "Assessment time has ended. Submitting automatically...",
      status: "warning",
      duration: 5000,
      position: "top-right",
      isClosable: true,
    });
    handleSubmitAssessment();
  });

  useEffect(() => {
    if (!candidateId) return;

    const loadCandidate = async () => {
      const data = await applicationService.getApplicationById(candidateId);
      if (data) {
        setUserInfo({
          name: data.name,
          email: data.email,
          phone: data.phone,
          candidateId: candidateId,
        });
      }
    };

    loadCandidate();
  }, [candidateId]);

  const autoSave = useCallback(() => {
    setSavedCodes((prev) => ({
      ...prev,
      [currentQuestion]: code,
    }));
    setLastSaved(new Date());
  }, [code, currentQuestion]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (isStarted && code !== MOCK_QUESTIONS[currentQuestion].starterCode) {
      const interval = setInterval(autoSave, 30000);
      return () => clearInterval(interval);
    }
  }, [isStarted, code, currentQuestion, autoSave]);

  useEffect(() => {
    // Load saved code when switching questions
    const savedCode = savedCodes[currentQuestion];
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(MOCK_QUESTIONS[currentQuestion].starterCode);
    }
    setTestResults([]);
  }, [currentQuestion, savedCodes]);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      const question = MOCK_QUESTIONS[currentQuestion];
      const results: TestResult[] = [];

      for (const testCase of question.testCases) {
        try {
          // Create a safe execution environment
          const func = new Function("return " + code)();
          const input = JSON.parse(`[${testCase.input}]`);
          const actual = func(...input);
          const expected = JSON.parse(testCase.expectedOutput);

          const passed = JSON.stringify(actual) === JSON.stringify(expected);

          results.push({
            passed,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: JSON.stringify(actual),
          });
        } catch (error) {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: "Error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      setTestResults(results);

      const passedCount = results.filter((r) => r.passed).length;
      toast({
        title: "Tests Completed",
        description: `${passedCount}/${results.length} test cases passed`,
        status: passedCount === results.length ? "success" : "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Test Execution Failed",
        description: "Please check your code syntax",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      console.log("Test execution error:", error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSave = () => {
    autoSave();
    toast({
      title: "Code Saved",
      description: "Your progress has been saved successfully",
      status: "success",
      duration: 2000,
      position: "top-right",
      isClosable: true,
    });
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    console.log(userInfo);

    try {
      if (!userInfo) return;

      const finalCodes = {
        ...savedCodes,
        [currentQuestion]: code,
      };

      const formattedTestResults: { [questionId: number]: any[] } = {};
      Object.keys(finalCodes).forEach((key) => {
        const questionIndex = Number(key);
        if (questionIndex === currentQuestion && testResults.length > 0) {
          formattedTestResults[questionIndex] = testResults;
        } else {
          formattedTestResults[questionIndex] = [];
        }
      });

      const assessmentData = {
        userInfo,
        answers: finalCodes,
        testResults: formattedTestResults,
        timeSpent: Math.floor(
          (new Date().getTime() - assessmentStartTime.getTime()) / 1000
        ),
        completedAt: new Date().toISOString(),
      };

      const candidateIdentifier = userInfo.candidateId;

      if (!candidateIdentifier) {
        throw new Error("Candidate ID is required for submission");
      }

      await applicationService.submitTechnicalAssessment(
        candidateId || "",
        assessmentData
      );

      setIsSubmitted(true);

      toast({
        title: "Assessment Submitted Successfully!",
        description: "Thank you for completing the technical assessment.",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });

      onSubmitModalClose();
    } catch (error: any) {
      console.log("Assessment submission error:", error);

      let errorMessage = "Unable to submit assessment. Please try again.";
      let errorTitle = "Submission Error";

      if (error?.response?.status === 404) {
        errorTitle = "Service Unavailable";
        errorMessage =
          "The submission service is currently unavailable. Please contact support.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        status: "error",
        duration: 10000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartAssessment = () => {
    setIsStarted(true);
    startTimer();
    toast({
      title: "Assessment Started!",
      description: "You have 45 minutes to complete all questions.",
      status: "info",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });
  };

  if (!isStarted) {
    return (
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="3xl">
          <Card shadow="lg">
            <CardBody>
              <VStack spacing={6} textAlign="center">
                <VStack spacing={2}>
                  <Heading size="lg">Welcome, {userInfo?.name}!</Heading>
                  <Text color="gray.600">
                    You are about to start a 45-minute coding assessment with 3
                    questions.
                  </Text>
                </VStack>

                <Alert status="info" borderRadius="md">
                  <Box>
                    <AlertTitle textAlign={"start"} fontSize="sm">
                      Instructions:
                    </AlertTitle>
                    <AlertDescription fontSize="sm">
                      <VStack align="start" spacing={1} mt={2}>
                        <Text>
                          • You have 45 minutes to complete all questions
                        </Text>
                        <Text>
                          • Your code will be auto-saved every 30 seconds
                        </Text>
                        <Text>
                          • You can run test cases to verify your solution
                        </Text>
                        <Text>• Make sure to submit before time runs out</Text>
                      </VStack>
                    </AlertDescription>
                  </Box>
                </Alert>

                <VStack spacing={4}>
                  <Text fontWeight="medium">Assessment Overview:</Text>
                  <HStack spacing={4}>
                    {MOCK_QUESTIONS.map((q, index) => (
                      <VStack key={q.id} spacing={1}>
                        <Badge colorScheme={getDifficultyColor(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                        <Text fontSize="sm">Q{index + 1}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {q.timeLimit}min
                        </Text>
                      </VStack>
                    ))}
                  </HStack>
                </VStack>

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleStartAssessment}
                  leftIcon={<FaPlay />}
                >
                  Start Assessment
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    );
  }

  if (isSubmitted) {
    return <TechnicalAssessmentSuccess onReturnHome={() => navigate("/")} />;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="10xl">
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Heading size="md">Technical Assessment</Heading>
              <Badge colorScheme="blue">
                Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
              </Badge>
              {lastSaved && (
                <Text fontSize="xs" color="gray.500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </Text>
              )}
            </HStack>

            <HStack spacing={4}>
              <HStack>
                <FaClock />
                <Text
                  fontWeight="bold"
                  color={timeRemaining < 300 ? "red.500" : "gray.700"}
                >
                  {formatTime(timeRemaining)}
                </Text>
              </HStack>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                leftIcon={<FaStop />}
                onClick={onSubmitModalOpen}
              >
                Submit Assessment
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="10xl" py={6}>
        <HStack spacing={6} align="start">
          {/* Question Panel */}
          <Box flex="1">
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">
                      {MOCK_QUESTIONS[currentQuestion].title}
                    </Heading>
                    <Badge
                      colorScheme={getDifficultyColor(
                        MOCK_QUESTIONS[currentQuestion].difficulty
                      )}
                    >
                      {MOCK_QUESTIONS[currentQuestion].difficulty}
                    </Badge>
                  </HStack>

                  <Text color="gray.700">
                    {MOCK_QUESTIONS[currentQuestion].description}
                  </Text>

                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Test Cases:
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {MOCK_QUESTIONS[currentQuestion].testCases.map(
                        (testCase: any, index: any) => (
                          <Box key={index} p={3} bg="gray.50" borderRadius="md">
                            <Text fontSize="sm">
                              <strong>Input:</strong>{" "}
                              <Code>{testCase.input}</Code>
                            </Text>
                            <Text fontSize="sm">
                              <strong>Output:</strong>{" "}
                              <Code>{testCase.expectedOutput}</Code>
                            </Text>
                          </Box>
                        )
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Code Editor Panel */}
          <Box flex="2">
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Code Editor</Text>
                    <HStack>
                      <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={
                          isRunningTests ? <Spinner size="xs" /> : <FaPlay />
                        }
                        onClick={runTests}
                        isLoading={isRunningTests}
                        loadingText="Running"
                      >
                        Run Tests
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FaSave />}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </HStack>
                  </HStack>

                  <Editor
                    height="500px"
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(newValue) => setCode(newValue || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />

                  {/* Test Results */}
                  {testResults.length > 0 && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        Test Results:
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {testResults.map((result, index) => (
                          <Box
                            key={index}
                            p={3}
                            bg={result.passed ? "green.50" : "red.50"}
                            borderLeft="4px solid"
                            borderColor={
                              result.passed ? "green.400" : "red.400"
                            }
                            borderRadius="md"
                          >
                            <HStack justify="space-between" mb={2}>
                              <Text fontSize="sm" fontWeight="medium">
                                Test Case {index + 1}
                              </Text>
                              <HStack>
                                {result.passed ? (
                                  <FaCheckCircle color="green" />
                                ) : (
                                  <FaTimesCircle color="red" />
                                )}
                                <Badge
                                  colorScheme={result.passed ? "green" : "red"}
                                >
                                  {result.passed ? "PASSED" : "FAILED"}
                                </Badge>
                              </HStack>
                            </HStack>
                            <VStack align="start" spacing={1} fontSize="sm">
                              <Text>
                                <strong>Input:</strong>{" "}
                                <Code>{result.input}</Code>
                              </Text>
                              <Text>
                                <strong>Expected:</strong>{" "}
                                <Code>{result.expected}</Code>
                              </Text>
                              <Text>
                                <strong>Actual:</strong>{" "}
                                <Code>{result.actual}</Code>
                              </Text>
                              {result.error && (
                                <Text color="red.600">
                                  <strong>Error:</strong> {result.error}
                                </Text>
                              )}
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Navigation */}
            <HStack justify="space-between" mt={4}>
              <Button
                isDisabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
              >
                Previous Question
              </Button>

              <Progress
                value={((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100}
                width="200px"
                colorScheme="blue"
              />

              {currentQuestion < MOCK_QUESTIONS.length - 1 ? (
                <Button
                  colorScheme="blue"
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                >
                  Next Question
                </Button>
              ) : (
                <Button colorScheme="green" onClick={onSubmitModalOpen}>
                  Submit Assessment
                </Button>
              )}
            </HStack>
          </Box>
        </HStack>
      </Container>

      {/* Submit Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={onSubmitModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Assessment</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text>Are you sure you want to submit your assessment?</Text>
              <Alert status="warning" borderRadius="md">
                <AlertDescription>
                  Once submitted, you cannot make any changes to your answers.
                  Make sure you have completed all questions to the best of your
                  ability.
                </AlertDescription>
              </Alert>
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Progress Summary:
                </Text>
                <VStack align="start" spacing={1}>
                  {MOCK_QUESTIONS.map((_, index) => (
                    <HStack key={index}>
                      <Text fontSize="sm">Question {index + 1}:</Text>
                      <Badge colorScheme={savedCodes[index] ? "green" : "gray"}>
                        {savedCodes[index] ? "Completed" : "Not Started"}
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSubmitModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleSubmitAssessment}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit Assessment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
