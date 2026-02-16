// src/components/ExpenseDetail/ExpenseDetail.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseDetail from './ExpenseDetail';
import { Expense } from '@/types/dashboard';

const mockExpense: Expense = { id: '1', amount: 50, description: 'Lunch', category: 'Food', date: '2024-01-15', createdAt: new Date() };

describe('ExpenseDetail', () => {
    it('renders expense details correctly', () => {
        render(<ExpenseDetail expense={mockExpense} onClose={() => {}} onDelete={() => {}} onEdit={() => {}} />);
        expect(screen.getByText('Detalle del Gasto')).toBeInTheDocument();
        expect(screen.getByText('Lunch')).toBeInTheDocument();
        expect(screen.getByText('$50')).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const onClose = vi.fn();
        render(<ExpenseDetail expense={mockExpense} onClose={onClose} onDelete={() => {}} onEdit={() => {}} />);
        await userEvent.click(screen.getByText('X'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onDelete when delete button is clicked', async () => {
        const onDelete = vi.fn();
        render(<ExpenseDetail expense={mockExpense} onClose={() => {}} onDelete={onDelete} onEdit={() => {}} />);
        await userEvent.click(screen.getByText('Eliminar'));
        expect(onDelete).toHaveBeenCalledWith('1');
    });

    it('calls onEdit when edit button is clicked', async () => {
        const onEdit = vi.fn();
        render(<ExpenseDetail expense={mockExpense} onClose={() => {}} onDelete={() => {}} onEdit={onEdit} />);
        await userEvent.click(screen.getByText('Editar'));
        expect(onEdit).toHaveBeenCalledWith(mockExpense);
    });
});
