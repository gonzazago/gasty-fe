// src/components/forms/AddExpenseForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreditCard, Plus, X } from 'lucide-react';
import { Card, ExpenseDataDetail, ExpenseDetail } from '@/types/dashboard';
import { FormInput, FormSelect } from '@/components/forms/components';


// --- Interfaces, Schema y Categorías ---
interface AddExpenseFormProps {
    onClose: () => void;
    onAddExpense: (monthId: string, expense: ExpenseDetail) => void;
    cards?: Card[];
    months: Pick<ExpenseDataDetail, 'id' | 'month'>[];
}

interface FormData {
    monthId: string;
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

const schema = yup.object({
    monthId: yup.string().required('Debes seleccionar un mes'),
    category: yup.string().required('La categoría es obligatoria'),
    place: yup.string().required('El lugar/descripción es obligatorio'),
    amount: yup.number().positive('El monto debe ser mayor a 0').required('El monto es obligatorio'),
    date: yup.string().required('La fecha es obligatoria'),
    fixed: yup.boolean().required(), // Esta validación ahora funcionará
    hasInstallments: yup.boolean().required(),
    currentInstallment: yup.number().when('hasInstallments', {
        is: true,
        then: (schema) => schema.required('La cuota actual es obligatoria').positive('Debe ser mayor a 0'),
        otherwise: (schema) => schema.notRequired()
    }),
    totalInstallments: yup.number().when('hasInstallments', {
        is: true,
        then: (schema) => schema.required('El total de cuotas es obligatorio').positive('Debe ser mayor a 0')
            .min(yup.ref('currentInstallment'), 'El total debe ser mayor o igual a la cuota actual'),
        otherwise: (schema) => schema.notRequired()
    }),
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

const toInputDate = (date: Date) => date.toISOString().split('T')[0];

export default function AddExpenseForm({ onClose, onAddExpense, cards = [], months = [] }: AddExpenseFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            monthId: '',
            category: '',
            place: '',
            amount: 0,
            date: '',
            fixed: false, // Default es booleano 'false'
            hasInstallments: false,
            currentInstallment: 1,
            totalInstallments: 1,
            cardId: ''
        }
    });

    const hasInstallments = watch('hasInstallments');
    const selectedCardId = watch('cardId');
    const selectedCategory = watch('category');

    // --- Lógica de Fecha Dinámica (sin cambios) ---
    const watchedMonthId = watch('monthId');
    const [dateConfig, setDateConfig] = useState({ min: '', max: '' });

    useEffect(() => {
        if (watchedMonthId) {
            const parts = watchedMonthId.split('-');
            if (parts.length === 3) {
                const monthIndex = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);

                if (!isNaN(monthIndex) && !isNaN(year)) {
                    const firstDay = new Date(year, monthIndex, 1);
                    const lastDay = new Date(year, monthIndex + 1, 0);
                    const minDate = toInputDate(firstDay);
                    const maxDate = toInputDate(lastDay);

                    setDateConfig({ min: minDate, max: maxDate });
                    setValue('date', minDate);
                    return;
                }
            }
        }
        setDateConfig({ min: '', max: '' });
        setValue('date', '');
    }, [watchedMonthId, setValue]);

    // --- onSubmit (sin cambios) ---
    const onSubmit = (data: FormData) => {
        const { monthId, ...expenseData } = data;

        let finalAmount = expenseData.amount;
        if (expenseData.hasInstallments && expenseData.totalInstallments && expenseData.totalInstallments > 0) {
            finalAmount = expenseData.amount / expenseData.totalInstallments;
        }

        const expense: ExpenseDetail = {
            category: expenseData.category,
            place: expenseData.place,
            amount: finalAmount,
            date: expenseData.date,
            fixed: expenseData.fixed, // 'fixed' ya es un booleano gracias al 'setValueAs'
            split: expenseData.hasInstallments && expenseData.currentInstallment && expenseData.totalInstallments ? {
                current: expenseData.currentInstallment,
                total: expenseData.totalInstallments,
                lefts: expenseData.totalInstallments - expenseData.currentInstallment
            } : null,
            cardId: expenseData.cardId || undefined
        };

        onAddExpense(monthId, expense);
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

                    <FormSelect
                        label="Asignar al Mes *"
                        name="monthId"
                        register={register}
                        errors={errors}
                    >
                        <option value="">Seleccionar mes...</option>
                        {months.map((month) => (
                            <option key={month.id} value={month.id}>
                                {month.month}
                            </option>
                        ))}
                    </FormSelect>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Categoría y Tarjeta Condicional (sin cambios) */}
                        <div className="space-y-6">
                            <FormSelect
                                label="Categoría *"
                                name="category"
                                register={register}
                                errors={errors}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </FormSelect>

                            {selectedCategory === 'Tarjetas' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <FormSelect
                                        label="¿Qué tarjeta estás pagando? *"
                                        name="cardId"
                                        register={register}
                                        errors={errors}
                                        className="border-2 border-purple-100 bg-purple-50"
                                    >
                                        <option value="">Seleccionar tarjeta</option>
                                        {cards.map((card) => (
                                            <option key={card.id} value={card.id}>
                                                {card.name} (**** {card.lastFourDigits})
                                            </option>
                                        ))}
                                    </FormSelect>
                                </div>
                            )}
                        </div>

                        {/* Lugar/Descripción (sin cambios) */}
                        <FormInput
                            label="Lugar/Descripción *"
                            name="place"
                            register={register}
                            errors={errors}
                            type="text"
                            placeholder={selectedCategory === 'Tarjetas' ? "Ej: Resumen Noviembre" : "Ej: Supermercado..."}
                        />

                        {/* Monto (sin cambios) */}
                        <FormInput
                            label={hasInstallments ? "Monto TOTAL (a dividir)" : "Monto *"}
                            name="amount"
                            register={register}
                            errors={errors}
                            registerOptions={{ valueAsNumber: true }}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            prefix="$"
                        />

                        {/* Fecha (sin cambios) */}
                        <FormInput
                            label="Fecha *"
                            name="date"
                            register={register}
                            errors={errors}
                            type="date"
                            min={dateConfig.min}
                            max={dateConfig.max}
                            disabled={!watchedMonthId}
                            className={!watchedMonthId ? "bg-gray-100" : ""}
                        />
                    </div>

                    {/* Selector de Tarjeta GENÉRICO (sin cambios) */}
                    {cards.length > 0 && selectedCategory !== 'Tarjetas' && (
                        <div
                            className={`p-4 rounded-lg border ${selectedCardId ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
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
                        </div>
                    )}

                    {/* ✅ --- TIPO DE GASTO (CORREGIDO) --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Gasto</label>
                        <div className="flex space-x-4">
                            {/* Usamos `value="false"` y `value="true"` (strings)
                              react-hook-form comparará esto con el 'defaultValue' (booleano 'false') y marcará el correcto.
                              'setValueAs' convierte el string del 'value' de nuevo a booleano.
                            */}
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('fixed', {
                                        setValueAs: (v) => v === 'true' // Convierte a booleano
                                    })}
                                    value="false" // Valor string
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Variable</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('fixed', {
                                        setValueAs: (v) => v === 'true' // Convierte a booleano
                                    })}
                                    value="true" // Valor string
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Fijo</span>
                            </label>
                        </div>
                        {/* El error de 'fixed' no se mostrará, pero lo dejamos por si acaso */}
                        {errors.fixed && <p className="text-red-500 text-sm mt-1">{errors.fixed.message}</p>}
                    </div>

                    {/* Cuotas (sin cambios) */}
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
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">

                                <FormInput
                                    label="Cuota Actual *"
                                    name="currentInstallment"
                                    register={register}
                                    errors={errors}
                                    registerOptions={{ valueAsNumber: true }}
                                    type="number"
                                    min="1"
                                />

                                <FormInput
                                    label="Total de Cuotas *"
                                    name="totalInstallments"
                                    register={register}
                                    errors={errors}
                                    registerOptions={{ valueAsNumber: true }}
                                    type="number"
                                    min="1"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones (sin cambios) */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button type="button" onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Agregar Gasto</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}