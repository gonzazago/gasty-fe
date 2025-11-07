'use client';

import {useState} from 'react';
import {Building2, CreditCard, Edit, Plus, Trash2} from 'lucide-react';
import {Bank, Card} from '@/types/dashboard';
import {AddBankForm, AddCardForm} from '@/components/forms';

interface BanksAndCardsManagerProps {
    initialBanks: Bank[];
    initialCards: Card[];
}

export default function BanksAndCardsManager({initialBanks, initialCards,}: BanksAndCardsManagerProps) {

    const [banks, setBanks] = useState(initialBanks);
    const [cards, setCards] = useState(initialCards);
    const [showAddBank, setShowAddBank] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);

    const getCardsByBank = (bankId: string) => {
        return cards.filter(card => card.bankId === bankId);
    };

    const getCardTypeIcon = (type: string) => {
        switch (type) {
            case 'visa':
                return '💳';
            case 'mastercard':
                return '💳';
            case 'amex':
                return '💳';
            default:
                return '💳';
        }
    };


    const onAddBank = async (bank: Omit<Bank, 'id' | 'createdAt'>) => {

        // Simulación de una Server Action + actualización de UI
        // ✅ CORREGIDO: Convertido a string
        const newBank = {...bank, id: crypto.randomUUID(), createdAt: new Date().toISOString()};
        setBanks(prev => [...prev, newBank]);
        setShowAddBank(false);
    };

    const handleAddCard = async (card: Omit<Card, 'id' | 'createdAt'>) => {
        // 💡 Aquí invocarías tu Server Action:
        // const newCard = await addCard(card);

        // Simulación de una Server Action + actualización de UI
        // ✅ CORREGIDO: Convertido a string
        const newCard = {...card, id: crypto.randomUUID(), createdAt: new Date().toISOString()};
        setCards(prev => [...prev, newCard]);
        setShowAddCard(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Bancos y Tarjetas</h2>
                    <p className="text-gray-600">Gestiona tus bancos y tarjetas de crédito</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowAddBank(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4"/>
                        <span>Agregar Banco</span>
                    </button>
                    <button
                        onClick={() => setShowAddCard(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4"/>
                        <span>Agregar Tarjeta</span>
                    </button>
                </div>
            </div>

            {/* Lista de Bancos */}
            <div className="space-y-6">
                {banks.map((bank) => {
                    const bankCards = getCardsByBank(bank.id);

                    return (
                        <div key={bank.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                            {/* Header del Banco */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                            style={{backgroundColor: bank.color}}
                                        >
                                            {bank.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{bank.name}</h3>
                                            <p className="text-gray-500">{bankCards.length} tarjeta{bankCards.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjetas del Banco */}
                            {bankCards.length > 0 ? (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {bankCards.map((card) => (
                                            <div
                                                key={card.id}
                                                className="relative p-4 rounded-lg text-white overflow-hidden"
                                                style={{backgroundColor: card.color}}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="text-sm opacity-80">{bank.name}</div>
                                                        <div className="font-semibold">{card.name}</div>
                                                    </div>
                                                    <div className="text-2xl">{getCardTypeIcon(card.type)}</div>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="text-sm opacity-80">
                                                        **** **** **** {card.lastFourDigits}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button className="p-1 opacity-60 hover:opacity-100">
                                                            <Edit className="w-3 h-3"/>
                                                        </button>
                                                        <button className="p-1 opacity-60 hover:opacity-100">
                                                            <Trash2 className="w-3 h-3"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                                    <p>No hay tarjetas agregadas para este banco</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Estado vacío */}
            {banks.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay bancos agregados</h3>
                    <p className="text-gray-500 mb-6">Comienza agregando tu primer banco</p>
                    <button
                        onClick={() => setShowAddBank(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                    >
                        <Plus className="w-4 h-4"/>
                        <span>Agregar Banco</span>
                    </button>
                </div>
            )}

            {/* Modales */}
            {showAddBank && (
                <AddBankForm
                    onClose={() => setShowAddBank(false)}
                    onAddBank={onAddBank}
                />
            )}

            {showAddCard && (
                <AddCardForm
                    onClose={() => setShowAddCard(false)}
                    onAddCard={handleAddCard}
                    banks={banks}
                />
            )}
        </div>
    );
}