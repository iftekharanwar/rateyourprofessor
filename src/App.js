import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Importing the AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Importing the ProtectedRoute component
import './App.css';
import Header from './components/Header';
import ProfessorList from './components/ProfessorList';
import RatingForm from './components/RatingForm';
import Professor from './components/Professor';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login'; // Importing the Login component
import Registration from './components/Registration'; // Importing the Registration component
import AddProfessorForm from './components/AddProfessorForm'; // Importing the AddProfessorForm component

function App() {
  // Removed the local authentication state and handleAuthentication function

  // Rest of the state declarations remain unchanged
  const [professorsList, setProfessorsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

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
      // Update the success message state
      setSubmissionMessage('Rating submitted successfully!');
    })
    .catch(error => {
      console.error('Error submitting rating:', error);
      // Update the error message state
      setSubmissionError('Error submitting rating. Please try again.');
    });
  };

  // Fetch all professors from the backend API
  useEffect(() => {
    // Update the API URL to point to the correct backend server
    const apiUrl = `https://professor-rating-app-jxmv10yc.devinapps.com/api/professors`;

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
        if (data && data.message === 'Success' && Array.isArray(data.data)) {
          // Set the professors list state with the fetched data
          setProfessorsList(data.data);
        } else {
          // Handle cases where the data structure is not as expected
          throw new Error('Unexpected data structure');
        }
      })
      .catch(error => {
        console.error('Error fetching professors list:', error);
        setError(error.toString());
      })
      .finally(() => setLoading(false));
  }, []); // Empty dependency array to only run the effect on component mount

  return (
    <div className="App">
      <Router> {/* Wrapping the Routes with Router */}
        <AuthProvider> {/* Wrapping the Routes with AuthProvider */}
          <Header />
          <Routes>
            <Route exact path="/" element={
              <>
                {error && <p>Error loading professor details: {error}</p>}
                {loading ? <p>Loading professor details...</p> : professorsList && professorsList.length > 0 ? <Professor details={professorsList[0]} /> : <p>Professor details not found.</p>} {/* Render the Professor component with details of the first professor or show loading message */}
                {submissionMessage && <p>{submissionMessage}</p>}
                {submissionError && <p>{submissionError}</p>}
                <ProfessorList professors={professorsList} /> {/* Passing the professorsList as professors prop */}
              </>
            } />
            <Route path="/about" element={<About />} /> {/* Render the About component */}
            <Route path="/contact" element={<Contact />} /> {/* Render the Contact component */}
            <Route path="/rate/:professorId" element={<RatingForm onSubmitRating={onSubmitRating} />} /> {/* The RatingForm component will handle extracting the professorId from the route parameters */}
            <Route path="/login" element={<Login />} /> {/* Render the Login component */}
            <Route path="/register" element={<Registration />} /> {/* Render the Registration component */}
            <Route path="/add-professor" element={<ProtectedRoute><AddProfessorForm /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect all undefined routes to the home page */}
          </Routes>
          <Footer /> {/* Adding the Footer component */}
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
