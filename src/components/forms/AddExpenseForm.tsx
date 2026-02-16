// src/components/forms/AddExpenseForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus } from 'lucide-react';
import { Bank, Card } from '@/types/dashboard';
import { FormInput, FormSelect } from '@/components/forms/components';
import PrimaryButton from "@/components/ui/PrimaryButton";
import {useEffect} from "react";

interface AddExpenseFormProps {
    onClose: () => void;
    onAddExpense: (expense: any) => void;
    banks: Bank[];
    cards: Card[];
}

const schema = yup.object({
    amount: yup.number().required('El monto es obligatorio').positive('El monto debe ser positivo'),
    description: yup.string().required('La descripción es obligatoria'),
    category: yup.string().required('La categoría es obligatoria'),
    date: yup.string().required('La fecha es obligatoria'),
    bankOrCardId: yup.string().nullable().optional(),
    fixed: yup.boolean().required('El tipo de gasto es obligatorio'),
    hasInstallments: yup.boolean().default(false),
    installments: yup.number().when('hasInstallments', {
        is: true,
        then: (schema) => schema.required('El número de cuotas es obligatorio').integer('Debe ser un número entero').positive('Debe ser un número positivo'),
        otherwise: (schema) => schema.optional(),
    }),
    installmentAmount: yup.number().when('hasInstallments', {
        is: true,
        then: (schema) => schema.required('El monto de la cuota es obligatorio').positive('Debe ser un número positivo'),
        otherwise: (schema) => schema.optional(),
    }),
});

type FormData = yup.InferType<typeof schema>;

const categories = [
    'Comida',
    'Transporte',
    'Alojamiento',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Ropa',
    'Otros',
];

export default function AddExpenseForm({ onClose, onAddExpense, banks, cards }: AddExpenseFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            fixed: false,
            hasInstallments: false,
        },
    });

    const hasInstallments = watch('hasInstallments');

    useEffect(() => {
        if (!hasInstallments) {
            setValue('installments', undefined);
            setValue('installmentAmount', undefined);
        }
    }, [hasInstallments, setValue]);

    const onSubmit = (data: FormData) => {
        onAddExpense({
            ...data,
            amount: data.amount,
        });
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Agregar Gasto</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            aria-label="close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <FormInput
                        label="Monto"
                        name="amount"
                        register={register}
                        errors={errors}
                        type="number"
                        placeholder="0.00"
                    />

                    <FormInput
                        label="Descripción"
                        name="description"
                        register={register}
                        errors={errors}
                        placeholder="Ej: Almuerzo en..."
                    />

                    <FormSelect
                        label="Categoría"
                        name="category"
                        register={register}
                        errors={errors}
                        options={categories.map(c => ({ value: c, label: c }))}
                    />

                    <FormInput
                        label="Fecha"
                        name="date"
                        register={register}
                        errors={errors}
                        type="date"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            Tipo de Gasto
                        </label>
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            <label className="flex items-center cursor-pointer flex-1 sm:flex-initial min-w-[100px]">
                                <input
                                    type="radio"
                                    name="fixed"
                                    value="false"
                                    checked={watch('fixed') === false}
                                    onChange={() => setValue('fixed', false, { shouldValidate: true })}
                                    className="mr-2 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Variable</span>
                            </label>
                            <label className="flex items-center cursor-pointer flex-1 sm:flex-initial min-w-[100px]">
                                <input
                                    type="radio"
                                    name="fixed"
                                    value="true"
                                    checked={watch('fixed') === true}
                                    onChange={() => setValue('fixed', true, { shouldValidate: true })}
                                    className="mr-2 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Fijo</span>
                            </label>
                        </div>
                        {errors.fixed && (
                            <p className="text-red-500 text-sm mt-1">{errors.fixed.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center mb-2 sm:mb-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('hasInstallments')}
                                className="mr-2 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Es un gasto en cuotas
                            </span>
                        </label>
                        {errors.hasInstallments && (
                            <p className="text-red-500 text-sm mt-1">{errors.hasInstallments.message}</p>
                        )}
                    </div>

                    {hasInstallments && (
                        <>
                            <FormInput
                                label="Número de Cuotas"
                                name="installments"
                                register={register}
                                errors={errors}
                                type="number"
                                placeholder="Ej: 3, 6, 12"
                            />
                            <FormInput
                                label="Monto por Cuota"
                                name="installmentAmount"
                                register={register}
                                errors={errors}
                                type="number"
                                placeholder="0.00"
                            />
                        </>
                    )}

                    <FormSelect
                        label="Banco o Tarjeta"
                        name="bankOrCardId"
                        register={register}
                        errors={errors}
                        options={[
                            { value: '', label: 'Ninguno' },
                            ...(banks ?? []).map(b => ({ value: b.id, label: b.name })),
                            ...(cards ?? []).map(c => ({ value: c.id, label: c.name })),
                        ]}
                    />

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton type="submit" iconLeft={<Plus />}>
                            Agregar Gasto
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
