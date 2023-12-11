import React from 'react';
import { render, screen } from '@testing-library/react';
import AddBudgetCapacity from '../BudgetCapacityManager';

describe('AddBudgetCapacity component', () => {
  it('should render successfully', () => {
    render(<AddBudgetCapacity />);

    expect(screen.getByText('Add Budget Capacity')).toBeInTheDocument();
    expect(screen.getByRole('select')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Category limit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Budget Capacity' })).toBeInTheDocument();
    expect(screen.getByText('Capacity Data')).toBeInTheDocument();
  });

  it('should fetch capacity data for the selected month', () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({
        data: [
          { budgetname: 'Food', budgetnumber: 100 },
          { budgetname: 'Entertainment', budgetnumber: 50 },
        ],
      }),
    }));

    render(<AddBudgetCapacity />);

    expect(mockFetch).toHaveBeenCalledWith('/budgets/capacity/1');

    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should send a request to the server to add the budget capacity', () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        message: 'Budget capacity added successfully',
      }),
    }));

    render(<AddBudgetCapacity />);

    screen.getByLabelText('Category').type('Travel');
    screen.getByLabelText('Category limit').type('200');

    screen.getByRole('button', { name: 'Add Budget Capacity' }).click();

    expect(mockFetch).toHaveBeenCalledWith('/budgets/capacity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        budgetName: 'Travel',
        budgetNumber: 200,
        selectedMonth: 1,
      }),
    });
  });

  it('should display a success message if the budget capacity was added successfully', () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        message: 'Budget capacity added successfully',
      }),
    }));

    render(<AddBudgetCapacity />);

    screen.getByLabelText('Category').type('Travel');
    screen.getByLabelText('Category limit').type('200');

    screen.getByRole('button', { name: 'Add Budget Capacity' }).click();

    expect(screen.getByText('Budget capacity added successfully')).toBeInTheDocument();
  });

  it('should display an error message if the budget capacity was not added successfully', () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({
        success: false,
        message: 'Failed to add budget capacity',
      }),
    }));

    render(<AddBudgetCapacity />);

    screen.getByLabelText('Category').type('Travel');
    screen.getByLabelText('Category limit').type('200');

    screen.getByRole('button', { name: 'Add Budget Capacity' }).click();

    expect(screen.getByText('Failed to add budget capacity')).toBeInTheDocument();
  });
});
