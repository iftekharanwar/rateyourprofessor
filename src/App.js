import React from 'react';
import './App.css';
import Header from './components/Header';
import ProfessorList from './components/ProfessorList';

function App() {
  return (
    <div className="App">
      <Header />
      <ProfessorList />
      {/* Rest of the app components will go here */}
    </div>
  );
}

export default App;
