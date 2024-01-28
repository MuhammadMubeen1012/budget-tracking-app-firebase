import { Card } from "antd";
import { React, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getExpenses } from "../store/expensesSlice";
import { getIncomes } from "../store/incomeSlice";
import {getSavings} from "../store/savingsSlice"
import { useDispatch, useSelector } from "react-redux";
ChartJS.register(ArcElement, Tooltip, Legend);

function DistributionChart() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const incomes = useSelector((state) => state.incomes.incomesList);
  const expenses = useSelector((state) => state.expenses.expenseList);
  const savings = useSelector((state) => state.savings.savings);

  useEffect(() => {
    dispatch(getIncomes(user.uid));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExpenses(user.uid));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSavings(user.uid));
  }, [dispatch]);

  const monthlyIncomes = {};

  // Loop through the data objects
  if (incomes) {
    incomes.forEach((item) => {
      const dateParts = item.date.split("-"); // Split the date into year, month, and day
      const month = dateParts[1];
      const amount = parseFloat(item.amount); // Convert the amount to a number

      // Create a key for the year and month (e.g., "2023-09")
      const key = `${month}`;

      // If the key doesn't exist in the monthlyTotals object, create it and initialize the total
      if (!monthlyIncomes[key]) {
        monthlyIncomes[key] = 0;
      }

      // Add the amount to the total for the corresponding month
      monthlyIncomes[key] += amount;
    });
  }

  console.log("M-I", monthlyIncomes);

  const monthlyExpenses = {};

  // Loop through the data objects
  if (expenses) {
    expenses.forEach((item) => {
      const dateParts = item.date.split("-"); // Split the date into year, month, and day
      const month = dateParts[1];
      const amount = parseFloat(item.amount); // Convert the amount to a number

      // Create a key for the year and month (e.g., "2023-09")
      const key = `${month}`;

      // If the key doesn't exist in the monthlyTotals object, create it and initialize the total
      if (!monthlyExpenses[key]) {
        monthlyExpenses[key] = 0;
      }

      // Add the amount to the total for the corresponding month
      monthlyExpenses[key] += amount;
    });
  }

  console.log("M-E", monthlyExpenses);

  const monthlySavings = {};

  // Loop through the data objects
  if (savings) {
    savings.forEach((item) => {
      const dateParts = item.deadline.split("-"); // Split the date into year, month, and day
      const month = dateParts[1];
      const amount = parseFloat(item.amount); // Convert the amount to a number

      // Create a key for the year and month (e.g., "2023-09")
      const key = `${month}`;

      // If the key doesn't exist in the monthlyTotals object, create it and initialize the total
      if (!monthlySavings[key]) {
        monthlySavings[key] = 0;
      }

      // Add the amount to the total for the corresponding month
      monthlySavings[key] += amount;
    });
  }

  console.log("M-S", monthlySavings);

  const monthlyLabels = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  const data = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [
      {
        label: monthlyLabels["09"],
        data: [
          monthlyIncomes["09"],
          monthlyExpenses["09"],
          monthlySavings["09"],
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <Pie data={data} />
    </Card>
  );
}

export default DistributionChart;
