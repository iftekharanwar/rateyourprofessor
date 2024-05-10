import React from 'react';
import { Flex, Box, Text, Spacer } from '@chakra-ui/react';

const Header = () => {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Box align="center" mr={5}>
        <Text fontSize="xl" fontWeight="bold">
          RateYourProfessor
        </Text>
      </Box>

      <Spacer />

      <Box>
        <Text as="nav">
          {/* Navigation links can be added here */}
        </Text>
      </Box>
    </Flex>
  );
};

export default Header;
