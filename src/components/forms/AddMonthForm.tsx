// src/components/AddMonthForm/AddMonthForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus } from 'lucide-react';

// 1. Props actualizadas
interface AddMonthFormProps {
    onClose: () => void;
    onAddMonth: (monthName: string, totalIncome:number) => void;
}

// 2. FormData actualizado
interface FormData {
    month: string;
    totalIncome: number;
}

// 3. Schema actualizado
const schema = yup.object({
    month: yup.string().required('El nombre del mes es obligatorio (Ej: Diciembre 2024)'),
    totalIncome: yup.number() // <-- Nueva validación
        .min(0, 'El ingreso debe ser 0 o mayor')
        .required('El ingreso inicial es obligatorio'),
});

export default function AddMonthForm({ onClose, onAddMonth }: AddMonthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            month: '',
        },
    });

    // 4. onSubmit actualizado
    const onSubmit = (data: FormData) => {
        onAddMonth(data.month,data.totalIncome);
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {/* 5. Título actualizado */}
                        <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Mes</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* 6. Campos actualizados (solo 1 campo) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Mes *
                        </label>
                        <input
                            type="text"
                            {...register('month')}
                            className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ej: Diciembre 2024"
                        />
                        {errors.month && (
                            <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
                        )}
                    </div>
                    {/* ✅ NUEVO CAMPO: Ingreso Inicial */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ingreso Inicial *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('totalIncome', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.00"
                        />
                        {errors.totalIncome && (
                            <p className="text-red-500 text-sm mt-1">{errors.totalIncome.message}</p>
                        )}
                    </div>

                    {/* 7. Botones actualizados */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Agregar Mes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}