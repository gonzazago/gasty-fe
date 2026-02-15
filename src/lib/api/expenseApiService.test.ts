import { describe, it, expect, vi } from 'vitest';
import { getExpenses, createExpense, updateExpense, deleteExpense } from './expenseApiService';
import { Expense } from '@/types/dashboard';

global.fetch = vi.fn();

describe('expenseApiService', () => {
  const mockExpense: Expense = {
    id: '1',
    amount: 100,
    date: new Date().toISOString(),
    category: 'Food',
    description: 'Lunch',
    bankId: 'bank-123',
  };

  it('should get all expenses', async () => {
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockExpense]),
    });

    const expenses = await getExpenses();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/expenses');
    expect(expenses).toEqual([mockExpense]);
  });

  it('should create an expense', async () => {
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockExpense),
    });

    const newExpense = await createExpense(mockExpense);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/expenses', expect.any(Object));
    expect(newExpense).toEqual(mockExpense);
  });

  it('should update an expense', async () => {
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...mockExpense, amount: 150 }),
    });

    const updatedExpense = await updateExpense('1', { amount: 150 });
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/expenses/1', expect.any(Object));
    expect(updatedExpense.amount).toBe(150);
  });

  it('should delete an expense', async () => {
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
    });

    await deleteExpense('1');
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/expenses/1', expect.any(Object));
  });
});
