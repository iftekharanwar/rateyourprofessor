import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, useToast } from '@chakra-ui/react';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Check if all fields are filled
    if (!username || !email || !password) {
      setError('Please fill all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://professor-rating-app-jxmv10yc.devinapps.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json(); // Removed the unused variable 'data'
      toast({
        title: 'Registration successful.',
        description: "You've been registered and logged in.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // Here you would typically handle the login flow after successful registration
      // For example, you might want to store the received token and redirect the user
    } catch (error) {
      setError('Failed to register. Please try again.');
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
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
          <Button
            width="full"
            mt={4}
            type="submit"
            isLoading={isLoading}
            loadingText="Registering..."
          >
            Register
          </Button>
        </FormControl>
      </form>
    </Box>
  );
};

export default Registration;
