import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importing BrowserRouter, Routes, Route, and Navigate from react-router-dom
import './App.css';
import Header from './components/Header';
import ProfessorList from './components/ProfessorList';
import RatingForm from './components/RatingForm'; // Importing the RatingForm component
import Professor from './components/Professor'; // Importing the Professor component
import Footer from './components/Footer'; // Importing the Footer component
import About from './components/About'; // Importing the About component
import Contact from './components/Contact'; // Importing the Contact component

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
      <Router> {/* Wrapping the Routes with Router */}
        <Header />
        <Routes>
          <Route exact path="/" element={
            <>
              {professorDetails && <Professor details={professorDetails} />} {/* Render the Professor component with fetched details */}
              <ProfessorList />
            </>
          } />
          <Route path="/about" element={<About />} /> {/* Render the About component */}
          <Route path="/contact" element={<Contact />} /> {/* Render the Contact component */}
          <Route path="/rate/:professorId" element={<RatingForm professorId={professorId} onSubmitRating={onSubmitRating} />} /> {/* Passing the professorId and onSubmitRating function as props */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect all undefined routes to the home page */}
        </Routes>
        <Footer /> {/* Adding the Footer component */}
      </Router>
    </div>
  );
}

export default App;
