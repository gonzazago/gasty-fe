'use client';

import { useState } from 'react';
import { expenseDetailsByMonth } from '@/data/expenseDetailsData';
import { ExpenseDataDetail, ExpenseDetail } from '@/types/dashboard';

export function useExpenses() {
  const [expensesData, setExpensesData] = useState<ExpenseDataDetail[]>(expenseDetailsByMonth);

  const addExpense = (newExpense: ExpenseDetail, monthIndex: number = 1) => {
    setExpensesData(prevData => {
      const updatedData = [...prevData];
      if (updatedData[monthIndex]) {
        updatedData[monthIndex] = {
          ...updatedData[monthIndex],
          expenses: [...updatedData[monthIndex].expenses, newExpense]
        };
        
        // Recalcular totales
        const totalCurrentMonth = updatedData[monthIndex].expenses.reduce((sum, expense) => sum + expense.amount, 0);
        updatedData[monthIndex] = {
          ...updatedData[monthIndex],
          totalCurrentMonth
        };
      }
      return updatedData;
    });
  };

  const getExpensesForMonth = (monthIndex: number) => {
    return expensesData[monthIndex] || expensesData[1]; // Default to November 2024
  };

  return {
    expensesData,
    addExpense,
    getExpensesForMonth
  };
}
