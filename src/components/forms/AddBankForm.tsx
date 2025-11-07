// src/components/forms/AddBankForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus } from 'lucide-react';
import { Bank } from '@/types/dashboard';
import {FormInput} from "@/components/forms/components";

interface AddBankFormProps {
    onClose: () => void;
    onAddBank: (bank: Omit<Bank, 'id' | 'createdAt'>) => void;
}

interface FormData {
    name: string;
    color: string;
    logo?: string;
}

const schema = yup.object({
    name: yup.string().required('El nombre del banco es obligatorio'),
    color: yup.string().required('El color es obligatorio'),
    logo: yup.string().optional()
});

const bankColors = [
    { name: 'Rojo', value: '#E31837' },
    { name: 'Azul', value: '#004481' },
    { name: 'Verde', value: '#0066CC' },
    { name: 'Naranja', value: '#FF6B35' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Negro', value: '#1F2937' },
    { name: 'Gris', value: '#6B7280' }
];

export default function AddBankForm({ onClose, onAddBank }: AddBankFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            color: '#E31837',
            logo: ''
        }
    });

    const selectedColor = watch('color');

    const onSubmit = (data: FormData) => {
        onAddBank({
            name: data.name,
            color: data.color,
            logo: data.logo || undefined
        });

        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Agregar Banco</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    <FormInput
                        label="Nombre del Banco *"
                        name="name"
                        register={register}
                        errors={errors}
                        type="text"
                        placeholder="Ej: Santander, BBVA, Galicia..."
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Color del Banco *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {bankColors.map((color) => (
                                <label key={color.value} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        {...register('color')}
                                        value={color.value}
                                        className="sr-only"
                                    />
                                    <div className={`w-8 h-8 rounded-lg border-2 ${
                                        selectedColor === color.value ? 'border-gray-400' : 'border-gray-200'
                                    }`} style={{ backgroundColor: color.value }}></div>
                                    <span className="text-sm text-gray-700">{color.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.color && (
                            <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vista Previa
                        </label>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                    style={{ backgroundColor: selectedColor }}
                                >
                                    {watch('name') ? watch('name').charAt(0).toUpperCase() : 'B'}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {watch('name') || 'Nombre del Banco'}
                                    </div>
                                    <div className="text-sm text-gray-500">Banco</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <FormInput
                        label="URL del Logo (Opcional)"
                        name="logo"
                        register={register}
                        errors={errors}
                        type="url"
                        placeholder="https://ejemplo.com/logo.png"
                    />
                    <p className="text-gray-500 text-sm -mt-5">
                        URL de la imagen del logo del banco
                    </p>

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
                            <span>Agregar Banco</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}