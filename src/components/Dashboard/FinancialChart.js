//FinancialChart.js

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import apiService from '../services/apiService';
import '../../styles/FinancialChart.css';

const BudgetChart = ({ token }) => {
  const barChartCanvasRef = useRef(null);
  const pieChartCanvasRef = useRef(null);
  const lineChartCanvasRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState([]);
  const [budgetCapacity, setBudgetCapacity] = useState([]);

  useEffect(() => {
    const fetchDataAndCreateCharts = async () => {
      try {
        const budgetEndpoint = selectedMonth
          ? `/budgets/getAllBudgets/${selectedMonth}`
          : '/budgets/getAllBudgets';

        const capacityEndpoint = selectedMonth
          ? `/budgets/capacity/${selectedMonth}`
          : '/budgets/capacity';

        const [budgetResponse, capacityResponse] = await Promise.all([
          apiService.get(budgetEndpoint, token, {
            params: { month: parseInt(selectedMonth, 10) },
          }),
          apiService.get(capacityEndpoint, token),
        ]);

        const budgetData = budgetResponse.data || [];
        const capacityData = capacityResponse.data || [];

        setBudgetData(budgetData);
        setBudgetCapacity(capacityData);
        setLoading(false);

        createBarChart();
        pieChartCanvasRef();
        createLineChart();
        
      } catch (error) {
        console.error('Error fetching budget data: ', error);
        setLoading(false);
      }
    };

    fetchDataAndCreateCharts();
  }, [token, selectedMonth]);

  useEffect(() => {
    if (!loading) {
      createBarChart();
      createPieChart();
      createLineChart();
      
    }
  }, [loading, budgetData, budgetCapacity]);

  const createLineChart = async () => {
    const lineCanvas = lineChartCanvasRef.current;
  
    if (!lineCanvas) {
      console.error('Line Canvas element not found');
      return;
    }
  
    const lineCtx = lineCanvas.getContext('2d');
    if (!lineCtx) {
      console.error('Unable to get 2D context for line canvas');
      return;
    }
  
    try {
      if (lineCanvas.chart) {
        lineCanvas.chart.destroy();
      } 
      const cumulativeData = [];

      for (let month = 1; month <= 12; month++) {
        const budgetsResponse = await apiService.get(`/budgets/getAllBudgets/${month}`, token);
        const capacityResponse = await apiService.get(`/budgets/capacity/${month}`, token);
        const budgetData = budgetsResponse.data || [];
        const capacityData = capacityResponse.data || [];
  
        let totalBudget = 0;
        let totalCapacity = 0;
  
        for (const item of budgetData) {
          totalBudget += Number(item.budgetnumber) || 0;
        }
  
        for (const item of capacityData) {
          totalCapacity += Number(item.budgetnumber) || 0;
        }
  
        cumulativeData.push({
          month: month,
          totalBudget: totalBudget,
          totalCapacity: totalCapacity,
        });
      }

      const chartData = {
        labels: cumulativeData.map(item => item.month),
        datasets: [
          {
            label: 'Cumulative Actual Budget',
            borderColor: '#ff6384',
            data: cumulativeData.map(item => item.totalBudget),
            fill: false,
          },
          {
            label: 'Cumulative Budget',
            borderColor: '#36a2eb',
            data: cumulativeData.map(item => item.totalCapacity),
            fill: false,
          },
        ],
      };
  
      lineCanvas.chart = new Chart(lineCtx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            x: {
              type: 'category',
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            },
            y: {
              type: 'linear',
              position: 'left',
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating line chart: ', error);
    }
  };

  const createBarChart = () => {
    const canvas = barChartCanvasRef.current;
    if (!canvas) {
      console.error('Bar Chart Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for Bar Chart canvas');
      return;
    }

    try {
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetName: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      const chartData = {
        labels: combinedData.map(item => item.budgetName),
        datasets: [
          {
            label: 'Actual Expenditure',
            backgroundColor: '#9966ff', 
            data: combinedData.map(item => item.actualExpenditure),
          },
          {
            label: 'Budget',
            backgroundColor: '#ffcc99', 
            data: combinedData.map(item => item.budgetCapacity),
          },
        ],
      };

      canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            x: { stacked: true }, 
            y: { stacked: true }, 
          },
        },
      });
    } catch (error) {
      console.error('Error creating bar chart: ', error);
    }
  };

  const createPieChart = () => {
    const pieCanvas = pieChartCanvasRef.current;

    if (!pieCanvas) {
      console.error('Pie Canvas element not found');
      return;
    }

    const pieCtx = pieCanvas.getContext('2d');
    if (!pieCtx) {
      console.error('Unable to get 2D context for pie canvas');
      return;
    }

    try {
      if (pieCanvas.chart) {
        pieCanvas.chart.destroy();
      }

      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetname: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      const pieData = combinedData.map((item, index) => {
        const actualExpenditure = item.actualExpenditure || 0;
        const budgetCapacity = item.budgetCapacity || 0;
        const remainingBudget = budgetCapacity - actualExpenditure;

        const backgroundColors = [
          '#ff6384', '#36a2eb', '#ff9f40', '#4bc0c0', '#9966ff', '#ffcc66', '#6666ff', '#99ff66', '#ff6666', '#66ccff',
          '#ffcc99', '#cc66ff', '#33cc33', '#6666cc', '#cc6666', '#99ccff', '#ff6666', '#66ccff', '#ffcc99', '#cc66ff'
        ];

        return {
          label: item.budgetname,
          data: [actualExpenditure, remainingBudget],
          backgroundColor: backgroundColors[index % backgroundColors.length],
        };
      });

      console.log('pieChartData:', pieData);

      pieCanvas.chart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: pieData.map(item => item.label),
          datasets: [{
            data: pieData.map(item => item.data[0]),
            backgroundColor: pieData.map(item => item.backgroundColor),
          }],
        },
      });
    } catch (error) {
      console.error('Error creating pie chart: ', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="budget-chart">
      <h3>Various Types of Budget Charts</h3>
      <div className="label-container">
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="scrollable-container">
          <div className="charts-container">
            <div className="chart">
              <h3>Budget for the current period vs Cumulative budget</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-canvas" ref={barChartCanvasRef} width={800} height={800}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
            <div className="chart">
              <h3>Current budget allocation chart</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-pie-canvas" ref={pieChartCanvasRef} width={800} height={800}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
          </div>

            <div className="chart">
              <h3>Budget for the current period. vs Cumulative budget allocation</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-line-canvas" ref={lineChartCanvasRef} width={400} height={400}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetChart;
