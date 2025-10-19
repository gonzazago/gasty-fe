'use server';

import { banksData, cardsData, getCardsByBank, getBankById, getCardById } from '@/data/banksAndCardsData';
import { Bank, Card } from '@/types/dashboard';

// Acciones para Bancos
export async function getAllBanks(): Promise<Bank[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return banksData;
}

export async function getBank(bankId: string): Promise<Bank | undefined> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return getBankById(bankId);
}

export async function createBank(bankData: Omit<Bank, 'id' | 'createdAt'>): Promise<Bank> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newBank: Bank = {
    ...bankData,
    id: `bank-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  // En una implementación real, aquí se guardaría en la base de datos
  // banksData.push(newBank);
  
  return newBank;
}

// Acciones para Tarjetas
export async function getAllCards(): Promise<Card[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return cardsData;
}

export async function getCardsByBankId(bankId: string): Promise<Card[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return getCardsByBank(bankId);
}

export async function getCard(cardId: string): Promise<Card | undefined> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return getCardById(cardId);
}

export async function createCard(cardData: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newCard: Card = {
    ...cardData,
    id: `card-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  // En una implementación real, aquí se guardaría en la base de datos
  // cardsData.push(newCard);
  
  return newCard;
}

// Acción para obtener datos completos de banks con sus tarjetas
export async function getBanksWithCards(): Promise<(Bank & { cards: Card[] })[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return banksData.map(bank => ({
    ...bank,
    cards: getCardsByBank(bank.id)
  }));
}

// Acción para obtener estadísticas de uso de tarjetas
export async function getCardUsageStats(): Promise<{ cardId: string; cardName: string; bankName: string; totalAmount: number; transactionCount: number }[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En una implementación real, esto vendría de la base de datos
  // Por ahora retornamos datos mock
  return [
    {
      cardId: 'card-1',
      cardName: 'Visa Santander',
      bankName: 'Santander',
      totalAmount: 2500000,
      transactionCount: 15
    },
    {
      cardId: 'card-2',
      cardName: 'Mastercard Santander',
      bankName: 'Santander',
      totalAmount: 1800000,
      transactionCount: 8
    },
    {
      cardId: 'card-3',
      cardName: 'Visa BBVA',
      bankName: 'BBVA',
      totalAmount: 1200000,
      transactionCount: 12
    }
  ];
}
