import React from 'react';
import './App.css';
import Header from './components/Header';
import ProfessorList from './components/ProfessorList';
import RatingForm from './components/RatingForm'; // Importing the RatingForm component

function App() {
  return (
    <div className="App">
      <Header />
      <ProfessorList />
      <RatingForm /> {/* Adding the RatingForm component to the page */}
      {/* Rest of the app components will go here */}
    </div>
  );
}

export default App;
