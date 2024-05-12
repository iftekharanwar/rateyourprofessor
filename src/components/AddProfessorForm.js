import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';

const AddProfessorForm = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://professor-rating-app-mvkez8y0.devinapps.com/api/professors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, department }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: 'Professor Added',
        description: data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form fields
      setName('');
      setDepartment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor='name'>Professor's Name</FormLabel>
          <Input id='name' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel htmlFor='department'>Department</FormLabel>
          <Input id='department' placeholder='Enter department' value={department} onChange={(e) => setDepartment(e.target.value)} />
        </FormControl>
        <Button mt={4} colorScheme='teal' type='submit'>Add Professor</Button>
      </form>
    </Box>
  );
};

export default AddProfessorForm;
