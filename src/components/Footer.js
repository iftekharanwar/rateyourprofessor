import React from 'react';
import { Box, Text, Container, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="teal.500" color="white" py="4">
      <Container maxW="container.xl" textAlign="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()} RateYourProfessor. All rights reserved.
        </Text>
        <Text fontSize="sm">
          Built with ❤️ by <Link href="https://github.com/iftekharanwar" isExternal>iftekharanwar</Link>
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
