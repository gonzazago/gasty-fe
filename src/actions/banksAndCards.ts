'use server';

import { Bank, Card } from '@/types/dashboard';
import { apiClient } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';
import { mapApiBankToBank, mapBankToApiBank, mapApiCardToCard, mapCardToApiCard } from '@/lib/api/mappers';

// Acciones para Bancos
export async function getAllBanks(): Promise<Bank[]> {
  try {
    console.log('getAllBanks');
    const apiBanks = await apiClient.get<Array<{
      id: string;
      name: string;
      balance: number;
      createdAt: string;
      updatedAt: string;
    }>>(API_CONFIG.endpoints.banks);
    
    // Mapear bancos de la API al formato del frontend
    // Por ahora usamos colores por defecto, pero esto se puede mejorar
    const colors = ['#E31837', '#004481', '#0066CC', '#003366', '#9333ea'];
    return apiBanks.map((bank, index) => 
      mapApiBankToBank(bank, colors[index % colors.length])
    );
  } catch (error) {
    console.error('Error al obtener bancos:', error);
    // En caso de error, retornar array vacío o lanzar el error
    throw error;
  }
}

export async function getBank(bankId: string): Promise<Bank | undefined> {
  try {
    const banks = await getAllBanks();
    return banks.find(bank => bank.id === bankId);
  } catch (error) {
    console.error('Error al obtener banco:', error);
    return undefined;
  }
}

export async function createBank(bankData: Omit<Bank, 'id' | 'createdAt'>): Promise<Bank> {
  try {
    console.log('createBank');
    const apiBankData = mapBankToApiBank(bankData);
    const createdBank = await apiClient.post<{
      id: string;
      name: string;
      balance: number;
      createdAt: string;
      updatedAt: string;
    }>(API_CONFIG.endpoints.banks, apiBankData);
    
    return mapApiBankToBank(createdBank, bankData.color);
  } catch (error) {
    console.error('Error al crear banco:', error);
    throw error;
  }
}

// Acciones para Tarjetas
export async function getAllCards(): Promise<Card[]> {
  try {
    const apiCards = await apiClient.get<Array<{
      id: string;
      bankId: string;
      name: string;
      type: 'visa' | 'mastercard' | 'amex' | 'other';
      lastFourDigits: string;
      color: string;
      createdAt: string;
      updatedAt: string;
    }>>(API_CONFIG.endpoints.cards);
  
    return apiCards.map(card => mapApiCardToCard(card));
  } catch (error) {
    console.error('Error al obtener tarjetas:', error);
    throw error;
  }
}

export async function getCardsByBankId(bankId: string): Promise<Card[]> {
  try {
    const apiCards = await apiClient.get<Array<{
      id: string;
      bankId: string;
      name: string;
      type: 'visa' | 'mastercard' | 'amex' | 'other';
      lastFourDigits: string;
      color: string;
      createdAt: string;
      updatedAt: string;
    }>>(`${API_CONFIG.endpoints.cards}/bank/${bankId}`);
    
    return apiCards.map(card => mapApiCardToCard(card));
  } catch (error) {
    console.error('Error al obtener tarjetas por banco:', error);
    throw error;
  }
}

export async function getCard(cardId: string): Promise<Card | undefined> {
  try {
    const apiCard = await apiClient.get<{
      id: string;
      bankId: string;
      name: string;
      type: 'visa' | 'mastercard' | 'amex' | 'other';
      lastFourDigits: string;
      color: string;
      createdAt: string;
      updatedAt: string;
    }>(`${API_CONFIG.endpoints.cards}/${cardId}`);
  
    return mapApiCardToCard(apiCard);
  } catch (error) {
    console.error('Error al obtener tarjeta:', error);
    return undefined;
  }
}

export async function createCard(cardData: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
  try {
    const apiCardData = mapCardToApiCard(cardData);
    const createdCard = await apiClient.post<{
      id: string;
      bankId: string;
      name: string;
      type: 'visa' | 'mastercard' | 'amex' | 'other';
      lastFourDigits: string;
      color: string;
      createdAt: string;
      updatedAt: string;
    }>(API_CONFIG.endpoints.cards, apiCardData);
    
    return mapApiCardToCard(createdCard);
  } catch (error) {
    console.error('Error al crear tarjeta:', error);
    throw error;
  }
}

// Acción para obtener datos completos de banks con sus tarjetas
export async function getBanksWithCards(): Promise<(Bank & { cards: Card[] })[]> {
  try {
    const banks = await getAllBanks();
    const cards = await getAllCards();
  
    return banks.map(bank => ({
    ...bank,
      cards: cards.filter(card => card.bankId === bank.id)
  }));
  } catch (error) {
    console.error('Error al obtener bancos con tarjetas:', error);
    throw error;
  }
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
