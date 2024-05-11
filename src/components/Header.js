import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const Header = () => {
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
        </ul>
      </nav>
    </header>
  );
};

export default Header;
