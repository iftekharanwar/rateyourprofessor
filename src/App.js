import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ProfessorList from './components/ProfessorList';
import RatingForm from './components/RatingForm'; // Importing the RatingForm component
import Professor from './components/Professor'; // Importing the Professor component
import Footer from './components/Footer'; // Importing the Footer component

function App() {
  // State to store the professor's details
  const [professorDetails, setProfessorDetails] = useState(null);

  // Temporary professorId for testing purposes
  const professorId = 1;

  // Define the onSubmitRating function to handle form submission
  const onSubmitRating = (ratingData) => {
    // Placeholder for form submission logic
    console.log('Form submitted with data:', ratingData);
    // Here you would typically handle the form submission,
    // for example, sending the data to a backend server or
    // updating the state within the application.
  };

  // Fetch professor details from the backend API
  useEffect(() => {
    // Placeholder for API URL
    const apiUrl = `https://professor-rating-app-zkc1honm.devinapps.com/api/professors/${professorId}`;

    // Fetch data and update state
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setProfessorDetails(data))
      .catch(error => console.error('Error fetching professor details:', error));
  }, [professorId]); // Dependency array to re-run the effect if professorId changes

  return (
    <div className="App">
      <Header />
      {professorDetails && <Professor details={professorDetails} />} {/* Render the Professor component with fetched details */}
      <ProfessorList />
      <RatingForm professorId={professorId} onSubmitRating={onSubmitRating} /> {/* Passing the professorId and onSubmitRating function as props */}
      <Footer /> {/* Adding the Footer component */}
    </div>
  );
}

export default App;
