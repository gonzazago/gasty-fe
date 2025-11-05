// src/components/AddExpenseForm/AddExpenseForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus, CreditCard } from 'lucide-react';
import { ExpenseDetail, Card } from '@/types/dashboard';

interface AddExpenseFormProps {
    onClose: () => void;
    onAddExpense: (expense: ExpenseDetail) => void;
    cards?: Card[];
}

interface FormData {
    category: string;
    place: string;
    amount: number;
    date: string;
    fixed: boolean;
    hasInstallments: boolean;
    currentInstallment?: number;
    totalInstallments?: number;
    cardId?: string;
}

// 1. Schema actualizado con validación condicional para cardId
const schema = yup.object({
    category: yup.string().required('La categoría es obligatoria'),
    place: yup.string().required('El lugar/descripción es obligatorio'),
    amount: yup.number().positive('El monto debe ser mayor a 0').required('El monto es obligatorio'),
    date: yup.string().required('La fecha es obligatoria'),
    fixed: yup.boolean().required(),
    hasInstallments: yup.boolean().required(),
    currentInstallment: yup.number().when('hasInstallments', {
        is: true,
        then: (schema) => schema.required('La cuota actual es obligatoria').positive('Debe ser mayor a 0'),
        otherwise: (schema) => schema.notRequired()
    }),
    totalInstallments: yup.number().when('hasInstallments', {
        is: true,
        then: (schema) => schema.required('El total de cuotas es obligatorio').positive('Debe ser mayor a 0'),
        otherwise: (schema) => schema.notRequired()
    }),
    // ✅ NUEVO: Si es 'Tarjetas', cardId es obligatorio
    cardId: yup.string().when('category', {
        is: (val: string) => val === 'Tarjetas',
        then: (schema) => schema.required('Debes seleccionar la tarjeta correspondiente'),
        otherwise: (schema) => schema.optional()
    })
});

const categories = [
    'Tarjetas', 'Hogar', 'Comida', 'Transporte',
    'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Otros'
];

export default function AddExpenseForm({ onClose, onAddExpense, cards = [] }: AddExpenseFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            category: '',
            place: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            fixed: false,
            hasInstallments: false,
            currentInstallment: 1,
            totalInstallments: 1,
            cardId: ''
        }
    });

    const hasInstallments = watch('hasInstallments');
    const selectedCardId = watch('cardId');
    // 2. Observamos la categoría seleccionada
    const selectedCategory = watch('category');

    const onSubmit = (data: FormData) => {
        const expense: ExpenseDetail = {
            category: data.category,
            place: data.place,
            amount: data.amount,
            date: data.date,
            fixed: data.fixed,
            split: data.hasInstallments && data.currentInstallment && data.totalInstallments ? {
                current: data.currentInstallment,
                total: data.totalInstallments,
                lefts: data.totalInstallments - data.currentInstallment
            } : null,
            cardId: data.cardId || undefined
        };

        onAddExpense(expense);
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Agregar Gasto</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Categoría */}
                        <div className="space-y-6"> {/* Contenedor para agrupar Categoría y Tarjeta si aplica */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                                <select
                                    {...register('category')}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            </div>

                            {/* ✅ NUEVO: Dropdown ESPECÍFICO si la categoría es 'Tarjetas' */}
                            {selectedCategory === 'Tarjetas' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-purple-700 mb-2">
                                        ¿Qué tarjeta estás pagando? *
                                    </label>
                                    <select
                                        {...register('cardId')}
                                        className="w-full px-3 py-2 border-2 border-purple-100 bg-purple-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Seleccionar tarjeta</option>
                                        {cards.map((card) => (
                                            <option key={card.id} value={card.id}>
                                                {card.name} (**** {card.lastFourDigits})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.cardId && <p className="text-red-500 text-sm mt-1">{errors.cardId.message}</p>}
                                </div>
                            )}
                        </div>

                        {/* Lugar/Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lugar/Descripción *</label>
                            <input
                                type="text"
                                {...register('place')}
                                className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder={selectedCategory === 'Tarjetas' ? "Ej: Resumen Noviembre" : "Ej: Supermercado..."}
                            />
                            {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place.message}</p>}
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monto *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('amount', { valueAsNumber: true })}
                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                        </div>

                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                        </div>
                    </div>

                    {/* Selector de Tarjeta GENÉRICO (Solo si NO es categoría 'Tarjetas') */}
                    {cards.length > 0 && selectedCategory !== 'Tarjetas' && (
                        <div className={`p-4 rounded-lg border ${selectedCardId ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                Pagar con Tarjeta (Opcional)
                            </label>
                            <select
                                {...register('cardId')}
                                className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                            >
                                <option value="">Ninguna (Efectivo/Débito)</option>
                                {cards.map((card) => (
                                    <option key={card.id} value={card.id}>
                                        {card.name} (**** {card.lastFourDigits})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Selecciona si este gasto fue realizado con una de tus tarjetas de crédito.
                            </p>
                        </div>
                    )}

                    {/* Tipo de Gasto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Gasto</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" {...register('fixed')} value="false" className="mr-2" />
                                <span className="text-sm text-gray-700">Variable</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" {...register('fixed')} value="true" className="mr-2" />
                                <span className="text-sm text-gray-700">Fijo</span>
                            </label>
                        </div>
                    </div>

                    {/* Cuotas */}
                    <div>
                        <label className="flex items-center mb-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('hasInstallments')}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Es un gasto en cuotas</span>
                        </label>

                        {hasInstallments && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuota Actual *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        {...register('currentInstallment', { valueAsNumber: true })}
                                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.currentInstallment && <p className="text-red-500 text-sm mt-1">{errors.currentInstallment.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total de Cuotas *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        {...register('totalInstallments', { valueAsNumber: true })}
                                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.totalInstallments && <p className="text-red-500 text-sm mt-1">{errors.totalInstallments.message}</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Agregar Gasto</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}