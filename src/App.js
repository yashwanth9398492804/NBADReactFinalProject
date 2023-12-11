import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserAuthProvider } from './components/Auth/AuthenticationContext';
import UserLogin from './components/Auth/UserLogin';
import UserRegistration from './components/Auth/UserRegistration';
import UserDashboard from './components/Dashboard/UserDashboard';
import BudgetOverview from './components/Dashboard/BudgetOverview';
import FinancialChart from './components/Dashboard/FinancialChart';
import AddBudgetCapacity from './components/Dashboard/BudgetCapacityManager';
import CreateBudget from './components/Dashboard/CreateBudget';
import authService from './components/services/authService';
import './styles/style.css';
import Footer from './components/Footer/Footer';


const HomePage = () => {
  return (
    <div className="home-container">
      <div className="text-container">
        <h1 className="welcome-message">Welcome to Your Budget Dashboard</h1>
        <h2>Your Financial Journey Starts Here</h2>
        <div className="home-button-container">
          <Link to="/login" className="home-button">
            User Log In
          </Link>
          <Link to="/signup" className="home-button">
            User Sign Up
          </Link>
        </div>
      </div>
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + '/background_homepage.png'}
          alt="Budget Website Banner"
          className="background-image"   width="1000" 
          height="700" 
        />
      </div>
    </div>
  );
};



const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [token, setUserToken] = useState(null);
  const [isTokenRefreshModalOpen, setIsTokenRefreshModalOpen] = useState(false);

  const handleUserLogin = (token) => {
    setUserToken(token);
    setIsUserLoggedIn(true);
  };

  useEffect(() => {
    const checkUserTokenExpiry = async () => {
      if (authService.checkUserTokenExpiry()) {
        setIsTokenRefreshModalOpen(true);
      }
    };

    checkUserTokenExpiry();
  }, []);

  const handleRefreshUserToken = async () => {
    try {
      await authService.refreshUserAccessToken();
      setIsTokenRefreshModalOpen(false);
    } catch (error) {
      console.error('Error refreshing user user token:', error);
    }
  };

  return (
    <Router>
      <UserAuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin onUserLogin={handleUserLogin} />} />
          <Route path="/signup" element={<UserRegistration />} />
          <Route
            path="/dashboard"
            element={isUserLoggedIn ? <UserDashboard token={token} /> : <Navigate to="/login" />}
          />
          {isUserLoggedIn && (
            <>
              <Route path="/dashboard/budget-list" element={<BudgetOverview />} />
              <Route path="/dashboard/budget-chart" element={<FinancialChart />} />
              <Route path="/dashboard/configure-budget" element={<AddBudgetCapacity />} />
              <Route path="/dashboard/add-budget" element={<CreateBudget token={token} />} />
            </>
          )}
        </Routes>
      </UserAuthProvider>
      <Footer />
    </Router>
  );
};
export default App;