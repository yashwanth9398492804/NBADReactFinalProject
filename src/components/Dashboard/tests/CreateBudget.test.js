// CreateBudget.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateBudget from '../CreateBudget';
import axios from 'axios';

jest.mock('axios');

describe('AddBudget component', () => {
  it('should render the form with input fields and a submit button', () => {
    render(<CreateBudget token="dummyToken" />);

    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Number:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Budget' })).toBeInTheDocument();
  });

  it('should display error notifications when input fields are empty', async () => {
    render(<CreateBudget token="dummyToken" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Budget' }));

    await waitFor(() => {
      expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
    });
  });

  it('should submit the form data and display a success notification on successful submission', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Budget added successfully' } });

    render(<CreateBudget token="dummyToken" />);

    const budgetNameInput = screen.getByLabelText('Category:');
    const budgetNumberInput = screen.getByLabelText('Number:');
    const submitButton = screen.getByRole('button', { name: 'Add Budget' });

    userEvent.type(budgetNameInput, 'Groceries');
    userEvent.type(budgetNumberInput, '100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Budget added successfully')).toBeInTheDocument();
    });
  });

  it('should display an error notification when the API request fails', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Error adding budget' } } });

    render(<CreateBudget token="dummyToken" />);

    const budgetNameInput = screen.getByLabelText('Category:');
    const budgetNumberInput = screen.getByLabelText('Number:');
    const submitButton = screen.getByRole('button', { name: 'Add Budget' });

    userEvent.type(budgetNameInput, 'Groceries');
    userEvent.type(budgetNumberInput, '100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Error adding budget')).toBeInTheDocument();
    });
  });
});
