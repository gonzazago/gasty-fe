import { Bank, Card, ExpenseDetail, ExpenseDataDetail } from '@/types/dashboard';

/**
 * Tipos de la API del backend
 */
interface ApiExpense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  bankId?: string;
  cardId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiBank {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapea un Expense de la API al formato del frontend
 */
export function mapApiExpenseToExpenseDetail(apiExpense: ApiExpense): ExpenseDetail {
  return {
    category: apiExpense.category,
    place: apiExpense.description, // Usamos description como place temporalmente
    amount: apiExpense.amount,
    date: new Date(apiExpense.date).toISOString().split('T')[0], // Formato YYYY-MM-DD
    fixed: false, // Por defecto, el backend no tiene este campo aún
    split: null, // Por defecto, el backend no tiene este campo aún
    cardId: apiExpense.cardId,
  };
}

/**
 * Mapea un Bank de la API al formato del frontend
 */
export function mapApiBankToBank(apiBank: ApiBank, color?: string): Bank {
  return {
    id: apiBank.id,
    name: apiBank.name,
    color: color || '#3B82F6', // Color por defecto si no se proporciona
    createdAt: apiBank.createdAt,
  };
}

/**
 * Mapea datos para crear un Expense en la API
 */
export function mapExpenseDetailToApiExpense(
  expense: ExpenseDetail,
  monthId?: string
): {
  amount: number;
  description: string;
  category: string;
  date: string;
  bankId?: string;
  cardId?: string;
} {
  return {
    amount: expense.amount,
    description: expense.place || expense.category, // Usamos place como description
    category: expense.category,
    date: expense.date,
    bankId: undefined, // El backend no tiene bankId directamente relacionado
    cardId: expense.cardId,
  };
}

/**
 * Mapea datos para crear un Bank en la API
 */
export function mapBankToApiBank(bank: Omit<Bank, 'id' | 'createdAt'>): {
  name: string;
  balance: number;
} {
  return {
    name: bank.name,
    balance: 0, // Por defecto, el backend no tiene balance inicial
  };
}

/**
 * Tipos de la API del backend para Card
 */
interface ApiCard {
  id: string;
  bankId: string;
  name: string;
  type: 'visa' | 'mastercard' | 'amex' | 'other';
  lastFourDigits: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapea un Card de la API al formato del frontend
 */
export function mapApiCardToCard(apiCard: ApiCard): Card {
  return {
    id: apiCard.id,
    bankId: apiCard.bankId,
    name: apiCard.name,
    type: apiCard.type,
    lastFourDigits: apiCard.lastFourDigits,
    color: apiCard.color,
    createdAt: apiCard.createdAt,
  };
}

/**
 * Mapea datos para crear un Card en la API
 */
export function mapCardToApiCard(card: Omit<Card, 'id' | 'createdAt'>): {
  bankId: string;
  name: string;
  type: 'visa' | 'mastercard' | 'amex' | 'other';
  lastFourDigits: string;
  color: string;
} {
  return {
    bankId: card.bankId,
    name: card.name,
    type: card.type,
    lastFourDigits: card.lastFourDigits,
    color: card.color,
  };
}

