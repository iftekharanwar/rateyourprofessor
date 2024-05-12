import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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

  // Function to render RatingForm with professorId from URL params
  const RatingFormWithId = () => {
    const { professorId } = useParams();
    return <RatingForm professorId={professorId} />;
  };

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
                <ProfessorList professors={professorsList} /> {/* Passing the professorsList as professors prop */}
              </>
            } />
            <Route path="/about" element={<About />} /> {/* Render the About component */}
            <Route path="/contact" element={<Contact />} /> {/* Render the Contact component */}
            <Route path="/rate/:professorId" element={<RatingFormWithId />} /> {/* Render the RatingForm component with professorId from URL params */}
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
