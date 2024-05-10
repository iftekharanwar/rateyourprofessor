import React from 'react';
import './App.css';
import Header from './components/Header';
import ProfessorList from './components/ProfessorList';
import RatingForm from './components/RatingForm'; // Importing the RatingForm component
import Footer from './components/Footer'; // Importing the Footer component

function App() {
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

  return (
    <div className="App">
      <Header />
      <ProfessorList />
      <RatingForm professorId={professorId} onSubmitRating={onSubmitRating} /> {/* Passing the professorId and onSubmitRating function as props */}
      <Footer /> {/* Adding the Footer component */}
    </div>
  );
}

export default App;
