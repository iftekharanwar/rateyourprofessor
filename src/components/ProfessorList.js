import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

// Temporary data - this will be replaced with dynamic data later
const professors = [
  { id: 1, name: 'Professor John Doe', department: 'Computer Science' },
  { id: 2, name: 'Professor Jane Smith', department: 'Mathematics' },
  { id: 3, name: 'Professor Emily Johnson', department: 'Physics' },
];

const ProfessorList = () => {
  return (
    <Box>
      {professors.map((professor) => (
        <Flex key={professor.id} p={5} shadow="md" borderWidth="1px">
          <Box flex="1" textAlign="left">
            <Text fontWeight="bold">{professor.name}</Text>
            <Text>{professor.department}</Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default ProfessorList;
