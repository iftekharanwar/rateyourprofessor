import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

// Temporary data - this will be replaced with dynamic data later
const professorDetails = {
  id: 1,
  name: 'Professor John Doe',
  department: 'Computer Science',
  university: 'University of Example',
  ratings: {
    clarity: 4.5,
    helpfulness: 4.7,
    easiness: 3.8
  },
  comments: [
    'Very clear explanations and engaging lectures.',
    'Helpful during office hours and responsive to emails.'
  ],
  tags: ['gives good feedback', 'respected', 'get ready to read']
};

const Professor = () => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" align="start">
        <Text fontSize="2xl" fontWeight="bold">{professorDetails.name}</Text>
        <Text fontSize="l">{professorDetails.department}, {professorDetails.university}</Text>
        <Box>
          {/* Ratings would be displayed here */}
          <Text fontSize="m">Clarity: {professorDetails.ratings.clarity}</Text>
          <Text fontSize="m">Helpfulness: {professorDetails.ratings.helpfulness}</Text>
          <Text fontSize="m">Easiness: {professorDetails.ratings.easiness}</Text>
        </Box>
        <Box>
          {/* Comments would be displayed here */}
          {professorDetails.comments.map((comment, index) => (
            <Text key={index} fontSize="sm">{comment}</Text>
          ))}
        </Box>
        <Flex wrap="wrap">
          {/* Tags would be displayed here */}
          {professorDetails.tags.map((tag, index) => (
            <Button key={index} size="sm" m={1}>{tag}</Button>
          ))}
        </Flex>
        <Button colorScheme="teal" variant="outline" mt={4}>
          Rate Professor
        </Button>
      </Flex>
    </Box>
  );
};

export default Professor;
