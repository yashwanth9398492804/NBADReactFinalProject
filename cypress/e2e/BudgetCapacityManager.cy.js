/// <reference types="cypress" />
import 'cypress-eyes';

describe('BudgetCapacityManager', () => {
  // E2E: Test adding budget capacity
  it('should add budget capacity', () => {
    
    cy.visit('/settings'); 
    cy.get('.add-budget-container select').select('1'); 
    cy.get('.add-budget-container input[type="text"]').eq(0).type('Test Budget');
    cy.get('.add-budget-container input[type="text"]').eq(1).type('1000');
    cy.get('.add-budget-container button.add-budget-button').click();

  
    cy.get('.modal h2').should('contain', 'Budget added successfully');
    cy.get('.capacity-table tbody tr').should('have.length', 1); 
  });


  
  // Visual Regression: Test for matching the AddBudgetCapacity component snapshot
  it('should match the BudgetCapacityManager component snapshot', () => {
    
    cy.visit('/settings');  
    cy.eyesOpen({
      appName: 'financeapplication', 
      testName: 'BudgetCapacityManager Component Snapshot',
    });

    cy.eyesCheckWindow('BudgetCapacityManager Component');
    cy.eyesClose();
  });
});
