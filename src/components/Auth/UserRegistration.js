import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import '../../styles/UserRegistration.css';

const UserRegistration = () => { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupStatus, setSignupStatus] = useState(null);
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await authService.userRegistration(fullName, username, password);
      setSignupStatus('success');
    } catch (error) {
      console.error('Signup failed', error);
      setSignupStatus('failed');
    }
  };
  useEffect(() => {
    const closeDialog = () => {
      setTimeout(() => setSignupStatus(null), 2000);
    };

    if (signupStatus === 'success') {
      closeDialog();
    } else if (signupStatus === 'failed') {
      closeDialog();
    }
  }, [signupStatus]);
  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <label className="signup-label">
          Full Name:
          <input
            className="signup-input"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
        <label className="signup-label">
          Username:
          <input
            className="signup-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="signup-label">
          Password:
          <input
            className="signup-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="signup-button" type="submit">
          Sign Up
        </button>

        {signupStatus === 'success' && (
          <div className="dialog success">
            Signup successful! 
          </div>
        )}
        {signupStatus === 'failed' && (
          <div className="dialog error">Signup failed. Please try again.</div>
        )}
      </form>
    </div>
  );
};

export default UserRegistration; 
