// src/components/forms/AddExpenseForm.tsx
'use client';

import {useEffect, useState} from 'react';
import {useForm, Resolver} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {CreditCard, Plus, X} from 'lucide-react';
import {Card, ExpenseDataDetail, ExpenseDetail} from '@/types/dashboard';
import {FormInput, FormSelect} from '@/components/forms/components';
import { addExpense } from '@/actions/expenses';


interface AddExpenseFormProps {
    onClose: () => void;
    cards?: Card[];
    months: Pick<ExpenseDataDetail, 'id' | 'month'>[];
}

const schema = yup.object({
    monthId: yup.string().required('Debes seleccionar un mes'),
    category: yup.string().required('La categoría es obligatoria'),
    place: yup.string().required('El lugar/descripción es obligatorio'),
    amount: yup.number().positive('El monto debe ser mayor a 0').required('El monto es obligatorio'),
    date: yup.string().required('La fecha es obligatoria'),
    fixed: yup.boolean().required(),
    hasInstallments: yup.boolean().required(),
    currentInstallment: yup.number().optional().when('hasInstallments', {
        is: true,
        then: (schema) => schema.
        required('La cuota actual es obligatoria').
        positive('Debe ser mayor a 0'),
        otherwise: (schema) => schema.optional()
    }),
    totalInstallments: yup.number().optional().when('hasInstallments', {
        is: true,
        then: (schema) => schema.
        required('El total de cuotas es obligatorio').
        positive('Debe ser mayor a 0').
        min(yup.ref('currentInstallment'), 'El total debe ser mayor o igual a la cuota actual'),
        otherwise: (schema) => schema.optional()
    }),
    cardId: yup.string().optional().when('category', {
        is: (val: string) => val === 'Tarjetas',
        then: (schema) => schema.
        required('Debes seleccionar la tarjeta correspondiente'),
        otherwise: (schema) => schema.optional()
    })
});

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

const categories = [
    'Tarjetas', 'Hogar', 'Comida', 'Transporte',
    'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Otros'
];

const toInputDate = (date: Date) => date.toISOString().split('T')[0];

export default function AddExpenseForm({onClose, cards = [], months = []}: AddExpenseFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch,
        setValue
    } = useForm<FormData>({
        resolver: yupResolver(schema) as Resolver<FormData>,
        defaultValues: {
            monthId: '',
            category: '',
            place: '',
            amount: 0,
            date: '',
            fixed: false,
            hasInstallments: false,
            currentInstallment: undefined,
            totalInstallments: undefined,
            cardId: undefined,
        }
    });

    const hasInstallments = watch('hasInstallments');
    const selectedCardId = watch('cardId');
    const selectedCategory = watch('category');

    const watchedMonthId = watch('monthId');
    const [dateConfig, setDateConfig] = useState({min: '', max: ''});

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

                    setDateConfig({min: minDate, max: maxDate});
                    setValue('date', minDate);
                    return;
                }
            }
        }
        setDateConfig({min: '', max: ''});
        setValue('date', '');
    }, [watchedMonthId, setValue]);

    const onSubmit = async (data: FormData) => {
        const {monthId, ...expenseData} = data;

        let finalAmount = expenseData.amount;
        if (expenseData.hasInstallments && expenseData.totalInstallments && expenseData.totalInstallments > 0) {
            finalAmount = expenseData.amount / expenseData.totalInstallments;
        }

        const expense: ExpenseDetail = {
            category: expenseData.category,
            place: expenseData.place,
            amount: finalAmount,
            date: expenseData.date,
            fixed: expenseData.fixed,
            split: expenseData.hasInstallments && expenseData.currentInstallment && expenseData.totalInstallments ? {
                current: expenseData.currentInstallment ?? 1,
                total: expenseData.totalInstallments?? 1,
                lefts: expenseData.totalInstallments - expenseData.currentInstallment
            } : null,
            cardId: expenseData.cardId || ''
        };

        await addExpense(monthId, expense);
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-none sm:rounded-xl shadow-xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Agregar Gasto</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6">

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4 sm:space-y-6">
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

                        <FormInput
                            label="Lugar/Descripción *"
                            name="place"
                            register={register}
                            errors={errors}
                            type="text"
                            placeholder={selectedCategory === 'Tarjetas' ? "Ej: Resumen Noviembre" : "Ej: Supermercado..."}
                        />

                        <FormInput
                            label={hasInstallments ? "Monto TOTAL (a dividir)" : "Monto *"}
                            name="amount"
                            register={register}
                            errors={errors}
                            registerOptions={{valueAsNumber: true}}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            prefix="$"
                        />

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

                    {cards.length > 0 && selectedCategory !== 'Tarjetas' && (
                        <div
                            className={`p-3 sm:p-4 rounded-lg border ${selectedCardId ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <CreditCard className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"/>
                                <span className="text-xs sm:text-sm">Pagar con Tarjeta (Opcional)</span>
                            </label>
                            <select
                                {...register('cardId')}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Tipo de Gasto</label>
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            <label className="flex items-center cursor-pointer flex-1 sm:flex-initial min-w-[100px]">
                                <input
                                    type="radio"
                                    {...register('fixed', {
                                        setValueAs: (v) => v === 'true'
                                    })}
                                    value="false"
                                    className="mr-2 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Variable</span>
                            </label>
                            <label className="flex items-center cursor-pointer flex-1 sm:flex-initial min-w-[100px]">
                                <input
                                    type="radio"
                                    {...register('fixed', {
                                        setValueAs: (v) => v === 'true'
                                    })}
                                    value="true"
                                    className="mr-2 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Fijo</span>
                            </label>
                        </div>
                        {errors.fixed && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fixed.message}</p>}
                    </div>

                    <div>
                        <label className="flex items-center mb-2 sm:mb-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('hasInstallments')}
                                className="mr-2 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">Es un gasto en cuotas</span>
                        </label>

                        {hasInstallments && (
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">

                                <FormInput
                                    label="Cuota Actual *"
                                    name="currentInstallment"
                                    register={register}
                                    errors={errors}
                                    registerOptions={{valueAsNumber: true}}
                                    type="number"
                                    min="1"
                                />

                                <FormInput
                                    label="Total de Cuotas *"
                                    name="totalInstallments"
                                    register={register}
                                    errors={errors}
                                    registerOptions={{valueAsNumber: true}}
                                    type="number"
                                    min="1"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
                        <button type="button" onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium">
                            Cancelar
                        </button>
                        <button type="submit"
                                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base font-medium">
                            <Plus className="w-4 h-4"/>
                            <span>Agregar Gasto</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}