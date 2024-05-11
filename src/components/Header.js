import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Header = () => {
  return (
    <header className="App-header">
      <Box align="center" mr={5}>
        <Text fontSize="xl" fontWeight="bold" color="white">
          RateYourProfessor
        </Text>
      </Box>

      {/* Navigation links can be added here */}
      {/* Placeholder for future navigation */}
    </header>
  );
};

export default Header;
