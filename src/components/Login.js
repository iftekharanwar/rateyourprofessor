import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, useToast } from '@chakra-ui/react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://professor-rating-app-jxmv10yc.devinapps.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: 'Login successful.',
        description: "You've been logged in.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      onLoginSuccess(data.token);
    } catch (error) {
      setError('Failed to login. Please check your credentials and try again.');
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box my={8} textAlign="left">
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={error}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
          <Button
            width="full"
            mt={4}
            type="submit"
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </FormControl>
      </form>
    </Box>
  );
};

export default Login;