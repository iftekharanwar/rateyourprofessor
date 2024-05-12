import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

const Professor = ({ details }) => {
  // Check if details and details.ratings are defined
  const ratings = details && details.ratings ? details.ratings : { clarity: 'N/A', helpfulness: 'N/A', easiness: 'N/A' };
  const comments = details && details.comments ? details.comments : ['No comments available'];
  const tags = details && details.tags ? details.tags : ['No tags available'];

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" align="start">
        <Text fontSize="2xl" fontWeight="bold">{details ? details.name : 'Professor Name'}</Text>
        <Text fontSize="l">{details ? `${details.department}, ${details.university}` : 'Department, University'}</Text>
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
