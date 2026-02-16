// src/components/ExpenseDetail/ExpenseDetail.tsx
import { Expense } from '@/types/dashboard';

interface ExpenseDetailProps {
    expense: Expense;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit: (expense: Expense) => void;
}

export default function ExpenseDetail({ expense, onClose, onDelete, onEdit }: ExpenseDetailProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Detalle del Gasto</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        X
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p><strong>Fecha:</strong> {expense.date}</p>
                    <p><strong>Descripción:</strong> {expense.description}</p>
                    <p><strong>Categoría:</strong> {expense.category}</p>
                    <p><strong>Monto:</strong> ${expense.amount}</p>
                </div>
                <div className="p-6 flex justify-end space-x-4">
                    <button onClick={() => onDelete(expense.id)} className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                        Eliminar
                    </button>
                    <button onClick={() => onEdit(expense)} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
}
