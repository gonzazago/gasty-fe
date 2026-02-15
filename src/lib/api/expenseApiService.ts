import { Expense } from '@/types/dashboard';

const API_URL = 'http://localhost:3000/api';

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await fetch(`${API_URL}/expenses`);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return response.json();
};

export const createExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const response = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });
  if (!response.ok) {
    throw new Error('Failed to create expense');
  }
  return response.json();
};

export const updateExpense = async (id: string, expense: Partial<Omit<Expense, 'id'>>): Promise<Expense> => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });
  if (!response.ok) {
    throw new Error('Failed to update expense');
  }
  return response.json();
};

export const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete expense');
  }
};
