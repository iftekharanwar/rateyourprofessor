import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and provides the auth context
export const AuthProvider = ({ children }) => {
  // Initialize isLoggedIn state based on the token's presence in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const login = (token) => {
    // Store the token in localStorage and update the isLoggedIn state
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Clear the token from localStorage and update the isLoggedIn state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Effect to run on mount and clean up on unmount
  useEffect(() => {
    // Check for token in localStorage and update isLoggedIn state accordingly
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Clean up function to run on unmount
    return () => {
      // Perform any necessary cleanup
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
