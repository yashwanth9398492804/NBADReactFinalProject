import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import UserLogin from '../UserLogin'; 

describe('Login Component', () => {
  test('renders login form', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <UserLogin /> 
      </BrowserRouter>
    );

    expect(getAllByText('User Login')[0]).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getAllByText('Log In')[1]).toBeInTheDocument();
  });

  test('handles login and displays success message', async () => {
    const { getByPlaceholderText, getAllByText } = render(
      <BrowserRouter>
        <UserLogin /> 
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'yash' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '12345' } });
    fireEvent.click(getAllByText('Log In')[1]);


    try {
      await waitFor(() => {
        expect(screen.queryByText('Login successful')).toBeInTheDocument();
      }, { timeout: 5000 }); 
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('handles login failure and displays error message', async () => {
    const { getByPlaceholderText, getAllByText } = render(
      <BrowserRouter>
        <UserLogin /> 
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'invalid-username' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'invalid-password' } });
    fireEvent.click(getAllByText('Log In')[1]);

    try {
      await waitFor(() => {
        expect(screen.queryByText('Login failed. Please check your username and password.')).toBeInTheDocument();
      }, { timeout: 5000 }); 
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
