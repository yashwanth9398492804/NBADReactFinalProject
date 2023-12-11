import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';


jest.mock('../Auth/AuthenticationContext', () => ({
  useUserAuth: () => ({
    logout: jest.fn(),
    refreshUserAccessToken: jest.fn(),
    checkUserTokenExpiration: jest.fn(),
    setUserAccessToken: jest.fn(), 
  }),
}));


jest.mock('../CreateBudget', () => ({
  __esModule: true,
  default: () => <div data-testid="AddBudget">Add Budget Component</div>,
}));

jest.mock('../BudgetOverview', () => ({
  __esModule: true,
  default: () => <div data-testid="BudgetList">Budget List Component</div>,
}));

jest.mock('../FinancialChart', () => ({
  __esModule: true,
  default: () => <div data-testid="BudgetChart">Budget Chart Component</div>,
}));

jest.mock('../BudgetCapacityManager', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="addBudgetCapacityComponent">Add Budget Capacity Component</div>
  ),
}));

describe('Dashboard component', () => {
  it('should display the logout button', () => {
    render(<Dashboard />);
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should display the navigation bar with buttons for budget list, budget chart, add budget, and add budget capacity', () => {
    render(<Dashboard />);
    const navigationBar = screen.getByRole('navigation');
    expect(navigationBar).toBeInTheDocument();

    const budgetListButton = screen.getByRole('button', { name: 'Budget List' });
    expect(budgetListButton).toBeInTheDocument();

    const budgetChartButton = screen.getByRole('button', { name: 'Budget Chart' });
    expect(budgetChartButton).toBeInTheDocument();

    const addBudgetButton = screen.getByRole('button', { name: 'Add Budget' });
    expect(addBudgetButton).toBeInTheDocument();

    const addBudgetCapacityButton = screen.getByRole('button', {
      name: 'Configure Budget',
    });
    expect(addBudgetCapacityButton).toBeInTheDocument();
  });

  it('should display the AddBudget component when the "Add Budget" button is clicked', () => {
    render(<Dashboard />);
    const addBudgetButton = screen.getByRole('button', { name: 'Add Budget' });
    fireEvent.click(addBudgetButton);

    const addBudgetComponent = screen.getByTestId('AddBudget');
    expect(addBudgetComponent).toBeInTheDocument();
  });

  it('should display the BudgetList component when the "Budget List" button is clicked', () => {
    render(<Dashboard />);
    const budgetListButton = screen.getByRole('button', { name: 'Budget List' });
    fireEvent.click(budgetListButton);

    const budgetListComponent = screen.getByTestId('BudgetList');
    expect(budgetListComponent).toBeInTheDocument();
  });

  it('should display the BudgetChart component when the "Budget Chart" button is clicked', () => {
    render(<Dashboard />);
    const budgetChartButton = screen.getByRole('button', { name: 'Budget Chart' });
    fireEvent.click(budgetChartButton);

    const budgetChartComponent = screen.getByTestId('BudgetChart');
    expect(budgetChartComponent).toBeInTheDocument();
  });

  it('should display the AddBudgetCapacity component when the "Configure Budget" button is clicked', () => {
    render(<Dashboard />);
    const addBudgetCapacityButton = screen.getByRole('button', {
      name: 'Configure Budget',
    });
    fireEvent.click(addBudgetCapacityButton);

    const addBudgetCapacityComponent = screen.getByTestId('addBudgetCapacityComponent');
    expect(addBudgetCapacityComponent).toBeInTheDocument();
  });
});
