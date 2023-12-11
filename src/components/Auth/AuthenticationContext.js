import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [token, setUserToken] = useState(null);

  useEffect(() => {
    const storedUserToken = localStorage.getItem('token');
    console.log('Stored User Token:', storedUserToken);

    if (storedUserToken) {
      setUserToken(storedUserToken);
      setIsUserLoggedIn(true);
    }
  }, []);

  const userLogin = (token) => {
    setUserToken(token);
    setIsUserLoggedIn(true);
    localStorage.setItem('token', token);
  };

  const userLogout = () => {
    setUserToken(null);
    setIsUserLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userJwt');
    localStorage.removeItem('userRefreshToken');
    window.location.reload();
  };

  const refreshUserAccessToken = async () => {
    try {
      const newUserToken = await authService.refreshUserAccessToken();
      setUserToken(newUserToken);
      localStorage.setItem('token', newUserToken);
      return newUserToken;
    } catch (error) {
      console.error('Error refreshing user access token:', error);
      userLogout();
    }
  };

  const checkUserTokenExpiration = () => {
    const expirationTime = Math.floor(Date.now() / 1000) + 60;
    const currentTime = Date.now() / 1000;

    return currentTime < expirationTime;
  };

  const setUserAccessToken = (newToken) => {
    setUserToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <UserAuthContext.Provider
      value={{
        isUserLoggedIn,
        token,
        userLogin,
        userLogout,
        refreshUserAccessToken,
        checkUserTokenExpiration,
        setUserAccessToken,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
