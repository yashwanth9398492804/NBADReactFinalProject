//UserLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import authService from '../services/authService';
import '../../styles/UserLogin.css';

const UserLogin = ({ onUserLogin }) => {
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStatusMessage, setLoginStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleUserLogin = async () => {
    try {
      const token = await authService.userLogin(userUsername, userPassword);
      onUserLogin(token, userUsername);
      setLoginStatusMessage('Login successful');
      openLoginModal();
      navigate('/dashboard');
    } catch (error) {
      console.error('User login failed', error);
      setLoginStatusMessage('Login failed. Please check your username and password.');
      openLoginModal();
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">User Login</h2>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={userUsername}
        onChange={(e) => setUserUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
      />
      
      <button className="login-button" onClick={handleUserLogin}>
        Log In
      </button>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        contentLabel="Login Status Message"
        className="login-modal"
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <div className="modal-content">
          <h2>{loginStatusMessage}</h2>
          <button className="login-button" onClick={closeLoginModal}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserLogin;
