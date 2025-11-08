// src/components/forms/AddMonthForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus } from 'lucide-react';
import {FormInput, FormSelect} from "@/components/forms/components";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useState } from 'react';


interface AddMonthFormProps {
    onClose: () => void;
    onAddMonth: (monthIndex: number, year: number, totalIncome:number) => void;
}

interface FormData {
    month: number;
    year: number;
    totalIncome: number;
}

const monthOptions = [
    { value: 0, name: 'Enero' }, { value: 1, name: 'Febrero' },
    { value: 2, name: 'Marzo' }, { value: 3, name: 'Abril' },
    { value: 4, name: 'Mayo' }, { value: 5, name: 'Junio' },
    { value: 6, name: 'Julio' }, { value: 7, name: 'Agosto' },
    { value: 8, name: 'Septiembre' }, { value: 9, name: 'Octubre' },
    { value: 10, name: 'Noviembre' }, { value: 11, name: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

const schema = yup.object({
    month: yup.number().min(0).max(11).required('El mes es obligatorio'),
    year: yup.number().min(new Date().getFullYear()).required('El año es obligatorio'),
    totalIncome: yup.number().min(0).required('El ingreso inicial es obligatorio'),
});

export default function AddMonthForm({ onClose, onAddMonth }: AddMonthFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            month: new Date().getMonth(),
            year: currentYear,
            totalIncome: 0,
        },
    });

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'success'|'error'>('success');
    const [modalMessage, setModalMessage] = useState('');

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await onAddMonth(data.month, data.year, data.totalIncome);
            reset();
            setModalType('success');
            setModalMessage('¡Mes agregado correctamente!');
            setModalOpen(true);
            // onClose lo hará el usuario al cerrar modal
        } catch (e) {
            setModalType('error');
            setModalMessage('Hubo un error al agregar el mes');
            setModalOpen(true);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* ✅ Mes (Refactorizado) */}
                        <FormSelect
                            label="Mes *"
                            name="month"
                            register={register}
                            errors={errors}
                            registerOptions={{ valueAsNumber: true }}
                        >
                            {monthOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.name}</option>
                            ))}
                        </FormSelect>

                        {/* ✅ Año (Refactorizado) */}
                        <FormSelect
                            label="Año *"
                            name="year"
                            register={register}
                            errors={errors}
                            registerOptions={{ valueAsNumber: true }}
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </FormSelect>
                    </div>

                    {/* ✅ Ingreso Inicial (Refactorizado) */}
                    <FormInput
                        label="Ingreso Inicial *"
                        name="totalIncome"
                        register={register}
                        errors={errors}
                        registerOptions={{ valueAsNumber: true }}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        prefix="$"
                    />

                    {/* Botones (Se mantienen igual) */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton type="submit" iconLeft={<Plus />} disabled={loading}>
                            {loading ? <Spinner /> : 'Agregar Mes'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
            <Modal open={modalOpen} onClose={() => { setModalOpen(false); onClose(); }} type={modalType}>
                <div className="text-center font-medium text-base p-2">
                    {modalMessage}
                </div>
            </Modal>
        </div>
    );
}