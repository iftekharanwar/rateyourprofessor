import React from 'react';
import { Box, Flex, Text, Button, Stack } from '@chakra-ui/react';

const Professor = ({ details }) => {
  // Check if details and details.ratings are defined
  const ratings = details && details.ratings ? details.ratings : { clarity: 'N/A', helpfulness: 'N/A', easiness: 'N/A' };
  const comments = details && details.comments ? details.comments : ['No comments available'];
  // Ensure tags is an array, provide an empty array as a fallback
  const tags = details && Array.isArray(details.tags) ? details.tags : [];

  return (
    <Box p={5} shadow="md" borderWidth="1px" className="ProfessorList">
      <Flex direction="column" align="start">
        <Stack spacing={3} direction="column" align="start">
          <Text fontSize="2xl" fontWeight="bold" mb={2}>{details ? details.name : 'Professor Name'}</Text>
          <Text fontSize="l" mb={2}>{details ? `${details.department},` : 'Department'}</Text>
          <Text fontSize="l" mb={2}>{details ? details.university : 'University'}</Text>
        </Stack>
        <Box>
          {/* Ratings would be displayed here */}
          <Text fontSize="m">Clarity: {ratings.clarity}</Text>
          <Text fontSize="m">Helpfulness: {ratings.helpfulness}</Text>
          <Text fontSize="m">Easiness: {ratings.easiness}</Text>
        </Box>
        <Box>
          {/* Comments would be displayed here */}
          {comments.map((comment, index) => (
            <Text key={index} fontSize="sm">{comment}</Text>
          ))}
        </Box>
        <Flex wrap="wrap">
          {/* Tags would be displayed here */}
          {tags.map((tag, index) => (
            <Button key={index} size="sm" m={1} className="TagButton">{tag}</Button>
          ))}
        </Flex>
        <Button colorScheme="teal" variant="outline" mt={4} className="RateButton">
          Rate Professor
        </Button>
      </Flex>
    </Box>
  );
};

export default Professor;
