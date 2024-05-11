import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

const Professor = ({ details }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" align="start">
        <Text fontSize="2xl" fontWeight="bold">{details.name}</Text>
        <Text fontSize="l">{details.department}, {details.university}</Text>
        <Box>
          {/* Ratings would be displayed here */}
          <Text fontSize="m">Clarity: {details.ratings.clarity}</Text>
          <Text fontSize="m">Helpfulness: {details.ratings.helpfulness}</Text>
          <Text fontSize="m">Easiness: {details.ratings.easiness}</Text>
        </Box>
        <Box>
          {/* Comments would be displayed here */}
          {details.comments.map((comment, index) => (
            <Text key={index} fontSize="sm">{comment}</Text>
          ))}
        </Box>
        <Flex wrap="wrap">
          {/* Tags would be displayed here */}
          {details.tags.map((tag, index) => (
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
