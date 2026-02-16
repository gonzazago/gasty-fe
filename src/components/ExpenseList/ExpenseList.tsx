// src/components/ExpenseList/ExpenseList.tsx
import { Expense } from '@/types/dashboard';
import GenericTable, { Column } from '@/components/Table/GenericTable';

interface ExpenseListProps {
    expenses: Expense[];
    onRowClick?: (expense: Expense) => void;
}

const columns: Column<Expense>[] = [
    {
        key: 'date',
        header: 'Fecha',
        accessor: 'date',
    },
    {
        key: 'description',
        header: 'Descripción',
        accessor: 'description',
    },
    {
        key: 'category',
        header: 'Categoría',
        accessor: 'category',
    },
    {
        key: 'amount',
        header: 'Monto',
        accessor: 'amount',
        render: (amount) => `$${amount}`,
    },
];

export default function ExpenseList({ expenses, onRowClick }: ExpenseListProps) {
    return (
        <GenericTable
            columns={columns}
            data={expenses}
            keyExtractor={(expense) => expense.id}
            onRowClick={onRowClick}
        />
    );
}
