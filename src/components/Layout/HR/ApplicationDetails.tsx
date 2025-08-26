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
  Input,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaDownload,
  FaGgCircle,
  FaUser,
  FaEnvelope,
  FaMapPin,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../shared/PageHeader";
import { StatusBadge } from "../../ui/StatusBadge";
import { applicationService } from "../../../services/applicationService";
import { formatDate } from "../../../utils";
import type { Application } from "../../../types";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ErrorAlert } from "../../ui/ErrorAlert";

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [cvDecision, setCvDecision] = useState("");
  const [aptitudeDecision, setAptitudeDecision] = useState("");
  const [techDecision, setTechDecision] = useState("");
  const [hrDecision, setHrDecision] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");

  const [aiScreeningResult, setAiScreeningResult] = useState<{
    decision: string;
    feedback: string;
    score: number;
  } | null>(null);

  // Fetch application details
  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await applicationService.getApplicationById(id);
        setApplication(data);

        setCvDecision(data.cvStatus !== "Pending" ? data.cvStatus : "");
        setAptitudeDecision(
          data.aptitudeStatus !== "Pending" ? data.aptitudeStatus : ""
        );
        setTechDecision(data.techStatus !== "Pending" ? data.techStatus : "");
        setHrDecision(data.hrStatus !== "Pending" ? data.hrStatus : "");
      } catch (err: any) {
        if (err.response?.status === 404) setError("Candidate not found");
        else
          setError(
            err.response?.data?.message || "Failed to fetch application details"
          );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // Handle automatic CV screening
  const handleCvScreening = async () => {
    if (!application) return;

    try {
      setProcessing(true);
      const response = await applicationService.analyzeCv(application.id);
      const decision = response?.aiRecord?.decision || "Failed";

      setAiScreeningResult({
        decision,
        feedback: response?.aiRecord?.feedback,
        score: response?.aiRecord?.score,
      });

      // Automatically update CV decision in UI
      setCvDecision(decision);
      toast({
        title: "CV Screening Completed",
        description: `AI decision: ${decision}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "CV Screening Failed",
        description: error?.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle decision for each round (aptitude, tech, HR)
  const handleDecision = async (round: string) => {
    if (!application) return;

    const updateData: any = {};
    let nextRound: Application["currentRound"] | undefined;
    let currentDecision = "";

    switch (round) {
      case "cv":
        currentDecision = cvDecision;
        if (!currentDecision) return;
        updateData.cvStatus = currentDecision;
        if (currentDecision === "Passed") nextRound = "Aptitude Test";
        else updateData.overallStatus = "Rejected";
        break;
      case "aptitude":
        currentDecision = aptitudeDecision;
        if (!currentDecision) return;
        updateData.aptitudeStatus = currentDecision;
        if (currentDecision === "Passed") nextRound = "Technical Interview";
        else updateData.overallStatus = "Rejected";
        break;
      case "tech":
        currentDecision = techDecision;
        if (!currentDecision) return;
        updateData.techStatus = currentDecision;
        if (currentDecision === "Passed") nextRound = "HR Interview";
        else updateData.overallStatus = "Rejected";
        break;
      case "hr":
        currentDecision = hrDecision;
        if (!currentDecision) return;
        updateData.hrStatus = currentDecision;
        if (currentDecision === "Passed") {
          nextRound = "Completed";
          updateData.overallStatus = "Selected";
        } else updateData.overallStatus = "Rejected";
        break;
      default:
        return;
    }

    if (nextRound) updateData.currentRound = nextRound;

    try {
      setProcessing(true);
      await applicationService.updateApplication(application.id, updateData);
      toast({
        title: `Application ${currentDecision}`,
        description: `${round.toUpperCase()} decision processed`,
        status: currentDecision === "Passed" ? "success" : "info",
        duration: 3000,
      });
      navigate("/hr/dashboard");
    } catch (err: any) {
      toast({
        title: "Failed to process decision",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const getPageTitle = (round: Application["currentRound"]) => {
    switch (round) {
      case "CV Screening":
        return "CV Screening";
      case "Aptitude Test":
        return "Aptitude Test Review";
      case "Technical Interview":
        return "Technical Interview Review";
      case "HR Interview":
        return "HR Interview Review";
      case "Completed":
        return "Application Completed";
      default:
        return "Application Details";
    }
  };

  const DecisionCard = ({
    roundName,
    currentStatus,
    decisionState,
    setDecisionState,
    onProcessDecision,
    showScheduling = false,
    disableDecision = false,
  }: {
    roundName: string;
    currentStatus: string;
    decisionState: string;
    setDecisionState: (val: string) => void;
    onProcessDecision: () => void | Promise<void>;
    showScheduling?: boolean;
    disableDecision?: boolean;
  }) => {
    const isPending = currentStatus === "Pending";
    const isPassed = currentStatus === "Passed";
    const isFailed = currentStatus === "Failed";

    return (
      <Card>
        <CardHeader>
          <Heading size="md">{roundName} Decision</Heading>
        </CardHeader>
        <CardBody>
          {isPending || disableDecision ? (
            <VStack spacing={4} align="stretch">
              <Select
                placeholder="Select decision"
                value={decisionState || currentStatus}
                onChange={(e) => setDecisionState(e.target.value)}
                isDisabled={disableDecision}
              >
                <option value="Passed">Approve - Move to Next Stage</option>
                <option value="Failed">Reject - Not Qualified</option>
              </Select>

              {decisionState === "Failed" && (
                <Select
                  placeholder="Select rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  isDisabled={disableDecision}
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
                  <option value="overqualified">Overqualified</option>
                  <option value="other">Other</option>
                </Select>
              )}

              {showScheduling && decisionState === "Passed" && (
                <VStack spacing={3} align="stretch">
                  <Input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                  />
                </VStack>
              )}

              <Button
                colorScheme={decisionState === "Passed" ? "green" : "red"}
                leftIcon={
                  decisionState === "Passed" ? <FaCheck /> : <FaTimes />
                }
                onClick={onProcessDecision}
                isDisabled={
                  disableDecision ||
                  !decisionState ||
                  (decisionState === "Failed" && !rejectionReason) ||
                  (showScheduling &&
                    decisionState === "Passed" &&
                    (!interviewDate || !interviewTime))
                }
                isLoading={processing}
                w="full"
              >
                {decisionState === "Passed"
                  ? `Approve & Schedule ${roundName}`
                  : `Reject Application`}
              </Button>
            </VStack>
          ) : (
            <Alert
              status={isPassed ? "success" : "error"}
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
                This application has been {currentStatus.toLowerCase()}{" "}
                automatically.
              </AlertDescription>
              {aiScreeningResult && (
                <Box
                  mt={3}
                  p={3}
                  bg={isPassed ? "green.50" : "red.50"}
                  borderRadius="md"
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
                  <Text
                    mt={2}
                    whiteSpace="pre-wrap"
                    fontStyle="italic"
                    color="gray.700"
                  >
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

  if (loading)
    return <LoadingSpinner message="Loading application details..." />;
  if (error)
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="6xl" py={8}>
          <ErrorAlert
            message={error}
            onRetry={() => window.location.reload()}
          />
          <Button mt={4} onClick={() => navigate("/hr/dashboard")}>
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  if (!application) return <LoadingSpinner message="Application not found" />;

  return (
    <Box minH="100vh" bg="gray.50">
      <PageHeader
        title={`${getPageTitle(application.currentRound)} - ${
          application.name
        }`}
        subtitle={`Applied ${formatDate(application.createdAt)} • ${
          application.email
        }`}
        backLink={{ to: "/hr/dashboard", label: "Back to Dashboard" }}
        actions={<StatusBadge status={application.overallStatus} size="lg" />}
      />

      <Container maxW="7xl" py={8}>
        <HStack spacing={6} align="start">
          {/* Left Column */}
          <VStack spacing={6} flex="2" align="stretch">
            {application.Job && (
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <VStack align="start" spacing={2}>
                      <Heading size="lg" color="gray.900">
                        {application.Job.title}
                      </Heading>
                      <Text fontSize="lg" color="blue.600" fontWeight="medium">
                        {application.Job.company}
                      </Text>
                    </VStack>
                    <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                      {application.Job.type}
                    </Badge>
                  </Flex>
                  <HStack spacing={6} color="gray.600" mb={6}>
                    <HStack>
                      <FaMapPin />
                      <Text>{application.Job.location}</Text>
                    </HStack>
                    <HStack>
                      <FaDollarSign />
                      <Text>{application.Job.salary}</Text>
                    </HStack>
                    <HStack>
                      <FaClock />
                      <Text>Posted {application.Job.posted}</Text>
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            )}
            <Card>
              <CardHeader>
                <Heading size="md">Candidate Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <HStack>
                    <FaUser color="blue.500" />
                    <Text fontWeight="medium">{application.name}</Text>
                  </HStack>
                  <HStack>
                    <FaEnvelope color="blue.500" />
                    <ChakraLink
                      href={`mailto:${application.email}`}
                      color="blue.500"
                    >
                      {application.email}
                    </ChakraLink>
                  </HStack>
                  {application.cvLink && (
                    <Box
                      mt={4}
                      border="1px solid #e2e8f0"
                      borderRadius="md"
                      h="600px"
                    >
                      <iframe
                        src={application.cvLink}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        title="CV Preview"
                      />
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Right Column - Actions */}
          <VStack spacing={6} flex="1" align="stretch">
            <Card>
              <CardHeader>
                <Heading size="md">Resume/CV</Heading>
              </CardHeader>
              <CardBody>
                <HStack spacing={3}>
                  <Button
                    leftIcon={<FaDownload />}
                    onClick={() => window.open(application.cvLink, "_blank")}
                    isDisabled={!application.cvLink}
                    w="50%"
                    colorScheme="blue"
                  >
                    Download CV
                  </Button>
                  <Button
                    leftIcon={<FaGgCircle />}
                    onClick={handleCvScreening}
                    colorScheme="blue"
                    w="50%"
                  >
                    CV Screening
                  </Button>
                </HStack>
              </CardBody>
            </Card>

            {/* Decisions */}
            {application.currentRound === "CV Screening" && (
              <DecisionCard
                roundName="CV Screening"
                currentStatus={application.cvStatus}
                decisionState={cvDecision}
                setDecisionState={setCvDecision}
                onProcessDecision={() => handleDecision("cv")}
                disableDecision={application.cvStatus !== "Pending"}
              />
            )}
            {application.currentRound === "Aptitude Test" && (
              <DecisionCard
                roundName="Aptitude Test"
                currentStatus={application.aptitudeStatus}
                decisionState={aptitudeDecision}
                setDecisionState={setAptitudeDecision}
                onProcessDecision={() => handleDecision("aptitude")}
                showScheduling
              />
            )}
            {application.currentRound === "Technical Interview" && (
              <DecisionCard
                roundName="Technical Interview"
                currentStatus={application.techStatus}
                decisionState={techDecision}
                setDecisionState={setTechDecision}
                onProcessDecision={() => handleDecision("tech")}
                showScheduling
              />
            )}
            {application.currentRound === "HR Interview" && (
              <DecisionCard
                roundName="HR Interview"
                currentStatus={application.hrStatus}
                decisionState={hrDecision}
                setDecisionState={setHrDecision}
                onProcessDecision={() => handleDecision("hr")}
              />
            )}

            {/* Final Status */}
            {application.currentRound === "Completed" && (
              <Alert
                status={
                  application.overallStatus === "Selected" ? "success" : "error"
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
