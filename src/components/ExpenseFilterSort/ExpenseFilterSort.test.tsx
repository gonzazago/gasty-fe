// src/components/ExpenseFilterSort/ExpenseFilterSort.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseFilterSort from './ExpenseFilterSort';

const categories = ['Food', 'Transport', 'Other'];

describe('ExpenseFilterSort', () => {
    it('renders filter and sort controls', () => {
        render(<ExpenseFilterSort categories={categories} onFilterChange={() => {}} onSortChange={() => {}} />);
        expect(screen.getByLabelText('Filtrar por categoría:')).toBeInTheDocument();
        expect(screen.getByLabelText('Ordenar por:')).toBeInTheDocument();
    });

    it('calls onFilterChange when category is changed', async () => {
        const onFilterChange = vi.fn();
        render(<ExpenseFilterSort categories={categories} onFilterChange={onFilterChange} onSortChange={() => {}} />);
        await userEvent.selectOptions(screen.getByLabelText('Filtrar por categoría:'), 'Food');
        expect(onFilterChange).toHaveBeenCalledWith({ category: 'Food' });
    });

    it('calls onSortChange when sort is changed', async () => {
        const onSortChange = vi.fn();
        render(<ExpenseFilterSort categories={categories} onFilterChange={() => {}} onSortChange={onSortChange} />);
        await userEvent.selectOptions(screen.getByLabelText('Ordenar por:'), 'amount-asc');
        expect(onSortChange).toHaveBeenCalledWith({ sortBy: 'amount', sortOrder: 'asc' });
    });
});
