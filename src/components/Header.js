import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, handleAuthentication }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Update the authentication state to false
    handleAuthentication(false);
    // Redirect to the home page
    navigate('/');
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
          {!isAuthenticated && (
            <>
              <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
              <li><NavLink to="/register" activeClassName="active">Register</NavLink></li>
            </>
          )}
          {isAuthenticated && (
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
