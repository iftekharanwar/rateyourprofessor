import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Textarea,
  Box,
  useToast,
} from '@chakra-ui/react';

const RatingForm = ({ professorId, onSubmitRating }) => {
  const [clarity, setClarity] = useState('');
  const [helpfulness, setHelpfulness] = useState('');
  const [easiness, setEasiness] = useState('');
  const [comment, setComment] = useState('');
  const toast = useToast();

  const isRatingValid = (rating) => rating >= 1 && rating <= 5;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      isRatingValid(clarity) &&
      isRatingValid(helpfulness) &&
      isRatingValid(easiness)
    ) {
      onSubmitRating({
        professorId,
        clarity,
        helpfulness,
        easiness,
        comment,
      });
      toast({
        title: 'Rating submitted.',
        description: "We've received your rating for the professor.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Invalid rating.',
        description: 'Ratings should be between 1 and 5.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box my={8} textAlign="left">
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="clarity">Clarity</FormLabel>
          <Input
            id="clarity"
            type="number"
            value={clarity}
            onChange={(e) => setClarity(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel htmlFor="helpfulness">Helpfulness</FormLabel>
          <Input
            id="helpfulness"
            type="number"
            value={helpfulness}
            onChange={(e) => setHelpfulness(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel htmlFor="easiness">Easiness</FormLabel>
          <Input
            id="easiness"
            type="number"
            value={easiness}
            onChange={(e) => setEasiness(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="comment">Comment</FormLabel>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          type="submit"
        >
          Submit Rating
        </Button>
      </form>
    </Box>
  );
};

export default RatingForm;
