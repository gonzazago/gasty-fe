
'use client';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Plus, X} from 'lucide-react';
import {Bank, Card} from '@/types/dashboard';
import {FormInput, FormSelect} from "@/components/forms/components";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import {useState} from 'react';


interface AddCardFormProps {
    onClose: () => void;
    onAddCard: (card: Omit<Card, 'id' | 'createdAt'>) => void;
    banks: Bank[];
}

interface FormData {
    bankId: string;
    name: string;
    type: 'visa' | 'mastercard' | 'amex' | 'other';
    lastFourDigits: string;
    color: string;
}

const schema = yup.object({
    bankId: yup.string().required('Debe seleccionar un banco'),
    name: yup.string().required('El nombre de la tarjeta es obligatorio'),
    type: yup.string().oneOf(['visa', 'mastercard', 'amex', 'other']).required('El tipo de tarjeta es obligatorio'),
    lastFourDigits: yup.string().required('Los últimos 4 dígitos son obligatorios').matches(/^\d{4}$/, 'Debe tener exactamente 4 dígitos'),
    color: yup.string().required('El color es obligatorio')
});

const cardTypes = [
    {value: 'visa', label: 'Visa', icon: '💳'},
    {value: 'mastercard', label: 'Mastercard', icon: '💳'},
    {value: 'amex', label: 'American Express', icon: '💳'},
    {value: 'other', label: 'Otra', icon: '💳'}
];

const cardColors = [
    {name: 'Rojo', value: '#E31837'},
    {name: 'Azul', value: '#004481'},
    {name: 'Verde', value: '#10B981'},
    {name: 'Naranja', value: '#F59E0B'},
    {name: 'Púrpura', value: '#8B5CF6'},
    {name: 'Negro', value: '#1F2937'},
    {name: 'Dorado', value: '#F59E0B'},
    {name: 'Plata', value: '#6B7280'}
];

export default function AddCardForm({onClose, onAddCard, banks}: AddCardFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            bankId: '',
            name: '',
            type: 'visa',
            lastFourDigits: '',
            color: '#E31837'
        }
    });

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'success'|'error'>('success');
    const [modalMessage, setModalMessage] = useState('');

    const selectedBankId = watch('bankId');
    const selectedColor = watch('color');
    const selectedType = watch('type');
    const selectedBank = banks.find(bank => bank.id === selectedBankId);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await onAddCard({
                bankId: data.bankId,
                name: data.name,
                type: data.type as 'visa' | 'mastercard' | 'amex' | 'other',
                lastFourDigits: data.lastFourDigits,
                color: data.color,
            });
            reset();
            setModalType('success');
            setModalMessage('¡Tarjeta agregada correctamente!');
            setModalOpen(true);
            // onClose lo hará el usuario al cerrar modal
        } catch (e) {
            setModalType('error');
            setModalMessage('Hubo un error al agregar la tarjeta');
            setModalOpen(true);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Agregar Tarjeta</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* ✅ Banco (Refactorizado) */}
                    <FormSelect
                        label="Banco *"
                        name="bankId"
                        register={register}
                        errors={errors}
                    >
                        <option value="">Seleccionar banco</option>
                        {banks.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                                {bank.name}
                            </option>
                        ))}
                    </FormSelect>

                    {/* ✅ Nombre de la Tarjeta (Refactorizado) */}
                    <FormInput
                        label="Nombre de la Tarjeta *"
                        name="name"
                        register={register}
                        errors={errors}
                        type="text"
                        placeholder="Ej: Visa Santander, Mastercard BBVA..."
                    />

                    {/* Tipo de Tarjeta (Se mantiene custom por la UI de íconos) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tipo de Tarjeta *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {cardTypes.map((type) => (
                                <label key={type.value}
                                       className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        {...register('type')}
                                        value={type.value}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl">{type.icon}</span>
                                    <span className="text-sm text-gray-700">{type.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    {/* ✅ Últimos 4 Dígitos (Refactorizado) */}
                    <FormInput
                        label="Últimos 4 Dígitos *"
                        name="lastFourDigits"
                        register={register}
                        errors={errors}
                        type="text"
                        placeholder="1234"
                        maxLength={4}
                    />

                    {/* Color (Se mantiene custom por la UI de swatches) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Color de la Tarjeta *
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {cardColors.map((color) => (
                                <label key={color.value} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        {...register('color')}
                                        value={color.value}
                                        className="sr-only"
                                    />
                                    <div className={`w-8 h-8 rounded-lg border-2 ${
                                        selectedColor === color.value ? 'border-gray-400' : 'border-gray-200'
                                    }`} style={{backgroundColor: color.value}}></div>
                                    <span className="text-xs text-gray-700">{color.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.color && (
                            <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
                        )}
                    </div>

                    {/* Preview de la Tarjeta (Se mantiene igual) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vista Previa
                        </label>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div
                                className="w-full h-24 rounded-lg p-4 flex flex-col justify-between text-white relative overflow-hidden"
                                style={{backgroundColor: selectedColor}}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm opacity-80">
                                            {selectedBank?.name || 'Nombre del Banco'}
                                        </div>
                                        <div className="text-lg font-semibold">
                                            {watch('name') || 'Nombre de la Tarjeta'}
                                        </div>
                                    </div>
                                    <div className="text-2xl">
                                        {cardTypes.find(t => t.value === selectedType)?.icon || '💳'}
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm opacity-80">**** ****
                                        **** {watch('lastFourDigits') || '1234'}</div>
                                    <div className="text-sm opacity-80">
                                        {cardTypes.find(t => t.value === selectedType)?.label || 'Visa'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                            {loading ? <Spinner /> : 'Agregar Tarjeta'}
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