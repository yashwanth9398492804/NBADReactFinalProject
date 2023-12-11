import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/CreateBudget.css';
import config from '../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const BASE_URL = config.apiUrl;
const CreateBudget = ({ token }) => {
  const [category, setCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddBudget = async () => {
    try {
      const response = await axios.post(
        BASE_URL + '/api/budgets',
        { budgetName: category, budgetNumber: budgetAmount, selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);

      NotificationManager.success('Budget added successfully', 'Success', 3000);

      setCategory('');
      setBudgetAmount('');
      setSelectedDate(new Date());
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      NotificationManager.error(`Error: ${errorMessage}`, 'Error', 5000);
    }
  };

  return (
    <div className="add-budget-form">
      <h2>Add a New Budget</h2>
      <div className="form-group">
        <label>Date:</label>
        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      </div>
      <div className="form-group">
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
        />
      </div>
      <button className="add-button" onClick={handleAddBudget}>
        Add Budget
      </button>

      <NotificationContainer />
    </div>
  );
};

export default CreateBudget;
