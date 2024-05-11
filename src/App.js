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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Temporary professorId for testing purposes
  const professorId = 1;

  // Define the onSubmitRating function to handle form submission
  const onSubmitRating = (ratingData) => {
    // Sending the rating data to the backend server
    const apiUrl = `https://professor-rating-app-jxmv10yc.devinapps.com/api/ratings`;
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Rating submitted successfully:', data);
      // Here you could handle a successful submission, e.g., updating the state or redirecting the user
    })
    .catch(error => {
      console.error('Error submitting rating:', error);
      // Here you could handle errors, e.g., displaying a message to the user
    });
  };

  // Fetch professor details from the backend API
  useEffect(() => {
    // Update the API URL to point to the correct backend server
    const apiUrl = `https://professor-rating-app-jxmv10yc.devinapps.com/api/professors/${professorId}`;

    // Fetch data and update state
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Check if the response contains the expected data structure
        if (data && data.data && typeof data.data === 'object') {
          // Convert tags string to array if it is not already an array
          const tagsArray = typeof data.data.tags === 'string' ? data.data.tags.split(', ') : data.data.tags;
          // Update the data structure to match the frontend's expectation
          const updatedData = {
            ...data.data,
            ratings: {
              clarity: data.data.clarity,
              helpfulness: data.data.helpfulness,
              easiness: data.data.easiness
            },
            comments: [], // Assuming no comments data is available yet
            tags: tagsArray
          };
          setProfessorDetails(updatedData);
        } else {
          // Handle cases where the data structure is not as expected
          throw new Error('Unexpected data structure');
        }
      })
      .catch(error => {
        console.error('Error fetching professor details:', error);
        setError(error.toString());
      })
      .finally(() => setLoading(false));
  }, [professorId]); // Dependency array to re-run the effect if professorId changes

  return (
    <div className="App">
      <Router> {/* Wrapping the Routes with Router */}
        <Header />
        <Routes>
          <Route exact path="/" element={
            <>
              {error && <p>Error loading professor details: {error}</p>}
              {loading ? <p>Loading professor details...</p> : professorDetails ? <Professor details={professorDetails} /> : <p>Professor details not found.</p>} {/* Render the Professor component with fetched details or show loading message */}
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
