/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Link as ChakraLink,
  Select,
  useToast,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  FaCheck,
  FaClock,
  FaDollarSign,
  FaDownload,
  FaEnvelope,
  FaGgCircle,
  FaMapPin,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../shared/PageHeader';
import { StatusBadge } from '../../ui/StatusBadge';
import { applicationService } from '../../../services/applicationService';
import { formatDate } from '../../../utils';
import type { Application } from '../../../types';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorAlert } from '../../ui/ErrorAlert';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Decision states for each round
  const [cvDecision, setCvDecision] = useState('');
  const [aptitudeDecision, setAptitudeDecision] = useState('');
  const [techInterviewDecision, setTechInterviewDecision] = useState('');
  const [hrInterviewDecision, setHrInterviewDecision] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Scheduling states
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');

  const [aiScreeningResult, setAiScreeningResult] = useState<{
  decision: string;
  feedback: string;
  score: number;
} | null>(null);

console.log(application);

  // Fetch application details
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!id) {
        setError('Application ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await applicationService.getApplicationById(id);
        setApplication(data);
        // Initialize decision states based on fetched data
        setCvDecision(data.cvStatus === 'Pending' ? '' : data.cvStatus);
        setAptitudeDecision(
          data.aptitudeStatus === 'Pending' ? '' : data.aptitudeStatus
        );
        setTechInterviewDecision(
          data.techStatus === 'Pending' ? '' : data.techStatus
        );
        setHrInterviewDecision(
          data.hrStatus === 'Pending' ? '' : data.hrStatus
        );
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Candidate not found');
        } else if (err.response?.status === 400) {
          setError('Invalid candidate ID');
        } else {
          setError(
            err.response?.data?.message || 'Failed to fetch application details'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleCvScreening = async () => {
  if (!application) return;

  try {
    const response = await applicationService.analyzeCv(application.id);
    console.log("CV Screening Response:", response);
    setAiScreeningResult({
      decision: response?.aiRecord?.decision,
      feedback: response?.aiRecord?.feedback,
      score:response?.aiRecord?.score,
    });
    toast({
      title: "CV Screening Completed",
      description: "Check the console for analysis result.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  } catch (error: any) {
    console.error("CV Screening Error:", error);
    toast({
      title: "CV Screening Failed",
      description: error?.response?.data?.message || "An error occurred.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};


  const handleDecision = async (round: string) => {
    if (!application) return;

    const updateData: any = {};
    let emailType = '';
    let nextRound: Application['currentRound'] | undefined;
    let currentDecision = '';

    switch (round) {
      case 'cv':
        currentDecision = cvDecision;
        if (!currentDecision) return;
        updateData.cvStatus = currentDecision;
        updateData.screeningCompletedAt = new Date().toISOString();
        if (currentDecision === 'Passed') {
          nextRound = 'Aptitude Test';
          emailType = 'aptitude_invitation';
        } else {
          updateData.rejectionReason = rejectionReason;
          updateData.overallStatus = 'Rejected';
          emailType = 'rejection';
        }
        break;
      case 'aptitude':
        currentDecision = aptitudeDecision;
        if (!currentDecision) return;
        updateData.aptitudeStatus = currentDecision;
        if (currentDecision === 'Passed') {
          nextRound = 'Technical Interview';
          emailType = 'technical_interview_invitation';
          updateData.interviewDate = interviewDate;
          updateData.interviewTime = interviewTime;
        } else {
          updateData.rejectionReason = rejectionReason;
          updateData.overallStatus = 'Rejected';
          emailType = 'rejection';
        }
        break;
      case 'tech':
        currentDecision = techInterviewDecision;
        if (!currentDecision) return;
        updateData.techStatus = currentDecision;
        if (currentDecision === 'Passed') {
          nextRound = 'HR Interview';
          emailType = 'hr_interview_invitation';
          updateData.interviewDate = interviewDate;
          updateData.interviewTime = interviewTime;
        } else {
          updateData.rejectionReason = rejectionReason;
          updateData.overallStatus = 'Rejected';
          emailType = 'rejection';
        }
        break;
      case 'hr':
        currentDecision = hrInterviewDecision;
        if (!currentDecision) return;
        updateData.hrStatus = currentDecision;
        if (currentDecision === 'Passed') {
          nextRound = 'Completed';
          updateData.overallStatus = 'Selected';
          emailType = 'offer_letter';
        } else {
          updateData.rejectionReason = rejectionReason;
          updateData.overallStatus = 'Rejected';
          emailType = 'rejection';
        }
        break;
      default:
        return;
    }

    if (nextRound) {
      updateData.currentRound = nextRound;
    }

    try {
      setProcessing(true);
      await applicationService.updateApplication(application.id, updateData);

      toast({
        title: `Application ${currentDecision}`,
        description: `${round.toUpperCase()} decision processed successfully`,
        status: currentDecision === 'Passed' ? 'success' : 'info',
        duration: 3000,
      });

      // For aptitude test invitation, send the link to the test
      const additionalEmailData: any = {};
      if (emailType === 'aptitude_invitation') {
        additionalEmailData.aptitudeTestLink = `${window.location.origin}/aptitude-test/${application.id}`;
      } else if (updateData.interviewDate && updateData.interviewTime) {
        additionalEmailData.interviewDate = updateData.interviewDate;
        additionalEmailData.interviewTime = updateData.interviewTime;
      }

      await applicationService.sendEmail(application.id, {
        emailType,
        ...additionalEmailData,
      });

      navigate('/hr/dashboard');
    } catch (error: any) {
      toast({
        title: 'Failed to process decision',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const getPageTitle = (currentRound: Application['currentRound']) => {
    switch (currentRound) {
      case 'CV Screening':
        return 'CV Screening';
      case 'Aptitude Test':
        return 'Aptitude Test Review';
      case 'Technical Interview':
        return 'Technical Interview Review';
      case 'HR Interview':
        return 'HR Interview Review';
      case 'Completed':
        return 'Application Completed';
      default:
        return 'Application Details';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading application details..." />;
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="6xl" py={8}>
          <ErrorAlert
            message={error}
            onRetry={() => window.location.reload()}
          />
          <Button mt={4} onClick={() => navigate('/hr/dashboard')}>
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  if (!application) {
    return <LoadingSpinner message="Application not found" />;
  }

  console.log(aiScreeningResult)

  const renderDecisionCard = (
    roundName: string,
    currentStatus: string,
    decisionState: string,
    setDecisionState: (value: string) => void,
    onProcessDecision: () => Promise<void>,
    showScheduling = false
  ) => {
    const isPending = currentStatus === 'Pending';
    const isPassed = currentStatus === 'Passed';
    const isFailed = currentStatus === 'Failed';

    return (
      <Card>
        <CardHeader>
          <Heading size="md">{roundName} Decision</Heading>
        </CardHeader>
        <CardBody>
          {isPending ? (
            <VStack spacing={4} align="stretch">
              <Select
                placeholder="Select decision"
                value={decisionState}
                onChange={(e) => setDecisionState(e.target.value)}
              >
                <option value="Passed">Approve - Move to Next Stage</option>
                <option value="Failed">Reject - Not Qualified</option>
              </Select>

              {decisionState === 'Failed' && (
                <Select
                  placeholder="Select rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                >
                  <option value="insufficient_experience">
                    Insufficient Experience
                  </option>
                  <option value="missing_skills">
                    Missing Required Skills
                  </option>
                  <option value="education_requirements">
                    Education Requirements Not Met
                  </option>
                  <option value="overqualified">
                    Overqualified for Position
                  </option>
                  <option value="other">Other</option>
                </Select>
              )}

              {showScheduling && decisionState === 'Passed' && (
                <VStack spacing={3} align="stretch">
                  <Input
                    type="date"
                    placeholder="Interview Date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    placeholder="Interview Time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                  />
                </VStack>
              )}

              <Button
                colorScheme={decisionState === 'Passed' ? 'green' : 'red'}
                leftIcon={
                  decisionState === 'Passed' ? <FaCheck /> : <FaTimes />
                }
                onClick={onProcessDecision}
                isDisabled={
                  !decisionState ||
                  (decisionState === 'Failed' && !rejectionReason) ||
                  (showScheduling &&
                    decisionState === 'Passed' &&
                    (!interviewDate || !interviewTime))
                }
                isLoading={processing}
                w="full"
              >
                {decisionState === 'Passed'
                  ? `Approve & Schedule ${roundName}`
                  : `Reject Application`}
              </Button>
            </VStack>
          ) : (
          <Alert
            status={isPassed ? 'success' : 'error'}
            borderRadius="md"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            p={4}
          >
            <AlertIcon boxSize="30px" mr={0} />
            <AlertTitle mt={2} mb={1} fontSize="md">
              Decision Made
            </AlertTitle>
            <AlertDescription maxWidth="sm" fontSize="sm" mb={2}>
              This application has been {currentStatus.toLowerCase()}.
              {isPassed && ` Candidate moved to next stage.`}
              {isFailed && ` Rejection email sent to candidate.`}
            </AlertDescription>

            {aiScreeningResult && (
              <Box
                mt={3}
                p={3}
                bg={isPassed ? 'green.50' : 'red.50'}
                borderRadius="md"
                textAlign="left"
                width="100%"
                maxWidth="sm"
              >
                <Text fontWeight="bold" mb={1}>
                  AI Screening Stats:
                </Text>
                <Text>
                  <strong>Decision:</strong> {aiScreeningResult.decision}
                </Text>
                <Text>
                  <strong>Score:</strong> {aiScreeningResult.score}%
                </Text>
                <Text mt={2} whiteSpace="pre-wrap" fontStyle="italic" color="gray.700">
                  {aiScreeningResult.feedback}
                </Text>
                </Box>
              )}
            </Alert>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <PageHeader
        title={`${getPageTitle(application.currentRound)} - ${
          application.name
        }`}
        subtitle={`Applied ${formatDate(application.createdAt)} • ${
          application.email
        }`}
        backLink={{ to: '/hr/dashboard', label: 'Back to Dashboard' }}
        actions={<StatusBadge status={application.overallStatus} size="lg" />}
      />

      <Container maxW="7xl" py={8}>
        <HStack spacing={6} align="start">
          {/* Left Column - Application Details */}
          <VStack spacing={6} flex="2" align="stretch">
            {/* Application Overview */}
            {application.Job && (
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <VStack align="start" spacing={2}>
                      <Heading size="lg" color="gray.900">
                        {application.Job?.title}
                      </Heading>
                      <Text fontSize="lg" color="blue.600" fontWeight="medium">
                        {application.Job?.company}
                      </Text>
                    </VStack>
                    <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                      {application.Job?.type}
                    </Badge>
                  </Flex>
                  <HStack spacing={6} color="gray.600" mb={6}>
                    <HStack>
                      <Icon as={FaMapPin} />
                      <Text>{application.Job?.location}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaDollarSign} />
                      <Text>{application.Job?.salary}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaClock} />
                      <Text>Posted {application.Job?.posted}</Text>
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            )}
            {/* Candidate Information */}
            <Card>
              <CardHeader>
                <Heading size="md">Candidate Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <HStack>
                    <Icon as={FaUser} color="blue.500" />
                    <Text fontWeight="medium">{application.name}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaEnvelope} color="blue.500" />
                    <ChakraLink
                      href={`mailto:${application.email}`}
                      color="blue.500"
                    >
                      {application.email}
                    </ChakraLink>
                  </HStack>
                  {application.cvLink && ( 
                    <Box mt={4} border="1px solid #e2e8f0" borderRadius="md" h="600px"> 
                      <iframe src={application.cvLink} style={{ width: '100%', height: '100%', border: 'none' }} title="CV Preview" /> 
                    </Box> 
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Right Column - Screening Actions */}
          <VStack spacing={6} flex="1" align="stretch">
            {/* CV Download */}
            <Card>
              <CardHeader>
                <Heading size="md">Resume/CV</Heading>
              </CardHeader>
              <CardBody>
                <HStack spacing={3}>
                  <Button
                    leftIcon={<FaDownload />}
                    onClick={() => window.open(application.cvLink, '_blank')}
                    isDisabled={!application.cvLink}
                    w={'50%'}
                    colorScheme="blue"
                  >
                    {application.cvLink ? 'Download CV' : 'CV Not Available'}
                  </Button>
                  <Button
                    colorScheme="blue"
                    w={'50%'}
                    leftIcon={<FaGgCircle />}
                    onClick={handleCvScreening}
                  >
                    CV Screening
                  </Button>
                </HStack>
              </CardBody>
            </Card>

            {/* Conditional Decision Cards */}
            {application.currentRound === 'CV Screening' &&
              renderDecisionCard(
                'CV Screening',
                application.cvStatus,
                cvDecision,
                setCvDecision,
                () => handleDecision('cv')
              )}

            {application.currentRound === 'Aptitude Test' &&
              renderDecisionCard(
                'Aptitude Test',
                application.aptitudeStatus,
                aptitudeDecision,
                setAptitudeDecision,
                () => handleDecision('aptitude'),
                true // Show scheduling for Aptitude Test (to schedule Technical Interview)
              )}

            {application.currentRound === 'Technical Interview' &&
              renderDecisionCard(
                'Technical Interview',
                application.techStatus,
                techInterviewDecision,
                setTechInterviewDecision,
                () => handleDecision('tech'),
                true // Show scheduling for Technical Interview (to schedule HR Interview)
              )}

            {application.currentRound === 'HR Interview' &&
              renderDecisionCard(
                'HR Interview',
                application.hrStatus,
                hrInterviewDecision,
                setHrInterviewDecision,
                () => handleDecision('hr')
              )}

            {/* Overall Status Alert if completed */}
            {(application.overallStatus === 'Selected' ||
              application.overallStatus === 'Rejected') &&
              application.currentRound === 'Completed' && (
                <Alert
                  status={
                    application.overallStatus === 'Selected'
                      ? 'success'
                      : 'error'
                  }
                  borderRadius="md"
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  p={8}
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="lg">
                    Application {application.overallStatus}
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    This application has reached its final status.
                  </AlertDescription>
                </Alert>
              )}
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
};
