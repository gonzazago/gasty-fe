// src/app/(dashboard)/expenses/page.tsx
'use client';

import { useMemo, useState } from 'react';
import ExpenseList from '@/components/ExpenseList/ExpenseList';
import ExpenseDetail from '@/components/ExpenseDetail/ExpenseDetail';
import { Expense } from '@/types/dashboard';
import ExpenseFilterSort from '@/components/ExpenseFilterSort/ExpenseFilterSort';

const mockExpenses: Expense[] = [
    { id: '1', amount: 50, description: 'Lunch', category: 'Food', date: '2024-01-15', createdAt: new Date() },
    { id: '2', amount: 20, description: 'Train ticket', category: 'Transport', date: '2024-01-14', createdAt: new Date() },
    { id: '3', amount: 100, description: 'Groceries', category: 'Food', date: '2024-01-13', createdAt: new Date() },
];

const categories = ['Food', 'Transport', 'Other'];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [filters, setFilters] = useState<{ category: string }>({ category: '' });
    const [sort, setSort] = useState<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({ sortBy: 'date', sortOrder: 'desc' });

    const handleDelete = (id: string) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
        setSelectedExpense(null);
    };

    const handleEdit = (updatedExpense: Expense) => {
        setExpenses(expenses.map(expense => (expense.id === updatedExpense.id ? updatedExpense : expense)));
        setSelectedExpense(null);
    };

    const handleRowClick = (expense: Expense) => {
        setSelectedExpense(expense);
    };

    const filteredAndSortedExpenses = useMemo(() => {
        let filtered = expenses;

        if (filters.category) {
            filtered = filtered.filter(expense => expense.category === filters.category);
        }

        return [...filtered].sort((a, b) => {
            const aValue = a[sort.sortBy as keyof Expense];
            const bValue = b[sort.sortBy as keyof Expense];

            if (aValue < bValue) {
                return sort.sortOrder === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sort.sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [expenses, filters, sort]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Gastos</h1>
            <ExpenseFilterSort
                categories={categories}
                onFilterChange={setFilters}
                onSortChange={setSort}
            />
            <ExpenseList expenses={filteredAndSortedExpenses} onRowClick={handleRowClick} />
            {selectedExpense && (
                <ExpenseDetail
                    expense={selectedExpense}
                    onClose={() => setSelectedExpense(null)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
}
