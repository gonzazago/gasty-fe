// src/app/(dashboard)/expenses/add/page.tsx
'use client';

import { useState } from 'react';
import AddExpenseForm from '@/components/forms/AddExpenseForm';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Plus } from 'lucide-react';
import { Expense } from '@/types/dashboard';

export default function AddExpensePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleAddExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        console.log('Expense added:', expense);
        // Here you would typically call an API to save the expense
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Agregar Gasto</h1>
            <PrimaryButton onClick={() => setIsFormOpen(true)} iconLeft={<Plus />}>
                Nuevo Gasto
            </PrimaryButton>

            {isFormOpen && (
                <AddExpenseForm
                    onClose={() => setIsFormOpen(false)}
                    onAddExpense={handleAddExpense}
                    banks={[]} // Pass real data here
                    cards={[]} // Pass real data here
                />
            )}
        </div>
    );
}
