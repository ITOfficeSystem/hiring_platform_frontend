import { Box, Heading, Text, Badge, VStack, HStack, Button, Flex, Link } from "@chakra-ui/react"
import { FaClock, FaDollarSign, FaMapPin } from "react-icons/fa"
import type { Job } from "../../types"

interface JobCardProps {
  job: Job
}

export const JobCard = ({ job }: JobCardProps) => {

  console.log(job);
  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="md"
      bg="white"
      _hover={{ shadow: "lg" }}
      maxH={{ base: "none", md: "auto" }}
    >
      <Flex justify="space-between" align="flex-start" mb={5}>
        <Heading size="md">{job.title}</Heading>
        <Badge colorScheme="purple">{job.type}</Badge>
      </Flex>

      <Text fontWeight="medium" color="blue.600" mb={3}>
        {job.company}
      </Text>

      <VStack align="start" spacing={2} fontSize="sm" color="gray.600" mb={4}>
        <HStack>
          <FaMapPin size={16} />
          <Text>{job.location}</Text>
        </HStack>
        <HStack>
          <FaDollarSign size={16} />
          <Text>{job.salary}</Text>
        </HStack>
        <HStack>
          <FaClock size={16} />
          <Text>Posted {job.posted}</Text>
        </HStack>
      </VStack>

      <Text fontSize="sm" color="gray.700" noOfLines={3} mb={4}>
        {job.description}
      </Text>

      <HStack wrap="wrap" spacing={2} mb={4}>
        {job.requirements.slice(0, 3).map((req, i) => (
          <Badge key={i} variant="outline" fontSize="10px" borderRadius={10} color="gray.600" p={1}>
            {req}
          </Badge>
        ))}
      </HStack>

      <Link href={`/jobs/${job.id}`}>
        <Button w="full" color="white" bg="blue.600" _hover={{ bg: "blue.700" }}>
          View Details
        </Button>
      </Link>
    </Box>
  )
}
