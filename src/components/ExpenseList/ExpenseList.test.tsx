import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpenseList from './ExpenseList';
import { Expense } from '@/types/dashboard';

const mockExpenses: Expense[] = [
    { id: '1', amount: 50, description: 'Lunch', category: 'Food', date: '2024-01-15', createdAt: new Date() },
    { id: '2', amount: 20, description: 'Train ticket', category: 'Transport', date: '2024-01-14', createdAt: new Date() },
];

describe('ExpenseList', () => {
    it('renders a list of expenses', () => {
        render(<ExpenseList expenses={mockExpenses} />);
        const expenseItems = screen.getAllByRole('row');
        // The table has a header row, so we expect mockExpenses.length + 1 rows.
        expect(expenseItems).toHaveLength(mockExpenses.length + 1);
    });

    it('displays a message if there are no expenses', () => {
        render(<ExpenseList expenses={[]} />);
        expect(screen.getByText('No hay gastos registrados')).toBeInTheDocument();
    });

    it('displays the correct information for each expense', () => {
        render(<ExpenseList expenses={mockExpenses} />);
        
        mockExpenses.forEach(expense => {
            expect(screen.getByText(expense.description)).toBeInTheDocument();
            expect(screen.getByText(`$${expense.amount}`)).toBeInTheDocument();
            expect(screen.getByText(expense.category)).toBeInTheDocument();
            expect(screen.getByText(expense.date)).toBeInTheDocument();
        });
    });
});
