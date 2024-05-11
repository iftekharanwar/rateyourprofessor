import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Use the useAuth hook

  const handleLogout = () => {
    logout(); // Call the logout function from useAuth
    navigate('/'); // Redirect to the home page
  };

  return (
    <header className="App-header">
      <nav>
        <Box align="center" mr={5}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            RateYourProfessor
          </Text>
        </Box>
        <ul className="nav-links">
          <li><NavLink to="/" activeClassName="active">Home</NavLink></li>
          <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
          <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
          {!isLoggedIn && (
            <>
              <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
              <li><NavLink to="/register" activeClassName="active">Register</NavLink></li>
            </>
          )}
          {isLoggedIn && (
            <li>
              <Button onClick={handleLogout} colorScheme="teal" variant="outline">
                Logout
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
