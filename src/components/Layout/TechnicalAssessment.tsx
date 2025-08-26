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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaClock, FaPlay, FaStop, FaSave } from 'react-icons/fa';
import { getDifficultyColor, formatTime } from '../../utils';
import { MOCK_QUESTIONS } from '../../constants';
import { useTimer } from '../../hooks/useTimer';
import Editor from '@monaco-editor/react'; // Add this import

export const TechnicalAssessment = () => {
  const toast = useToast();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [code, setCode] = useState(MOCK_QUESTIONS[0].starterCode);
  const [testResults, setTestResults] = useState<string>('');

  const { timeRemaining, start: startTimer } = useTimer(45 * 60);

  useEffect(() => {
    setCode(MOCK_QUESTIONS[currentQuestion].starterCode);
    setTestResults('');
  }, [currentQuestion]);

  const handleStartAssessment = () => {
    setIsStarted(true);
    startTimer();
    toast({
      title: 'Assessment Started!',
      description: 'You have 45 minutes to complete all questions.',
      status: 'info',
      duration: 3000,
      position: 'top-right',
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
                <Heading size="lg">Technical Assessment</Heading>
                <Text color="gray.600">
                  You are about to start a 45-minute coding assessment with 3
                  questions.
                </Text>

                <Alert status="info" borderRadius="md">
                  <Box>
                    <AlertTitle textAlign={'start'} fontSize="sm">
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

  return (
    <Box minH="100vh" bg="gray.50">
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
            </HStack>

            <HStack spacing={4}>
              <HStack>
                <FaClock />
                <Text
                  fontWeight="bold"
                  color={timeRemaining < 300 ? 'red.500' : 'gray.700'}
                >
                  {formatTime(timeRemaining)}
                </Text>
              </HStack>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                leftIcon={<FaStop />}
              >
                Submit Assessment
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

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
                              <strong>Input:</strong>{' '}
                              <Code>{testCase.input}</Code>
                            </Text>
                            <Text fontSize="sm">
                              <strong>Output:</strong>{' '}
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
                        leftIcon={<FaPlay />}
                      >
                        Run Tests
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FaSave />}
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
                    onChange={(newValue) => setCode(newValue || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />

                  {testResults && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        Test Results:
                      </Text>
                      <Box
                        p={3}
                        bg="gray.900"
                        color="white"
                        borderRadius="md"
                        fontFamily="mono"
                        fontSize="sm"
                      >
                        <pre>{testResults}</pre>
                      </Box>
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
                <Button colorScheme="green">Submit Assessment</Button>
              )}
            </HStack>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
};
