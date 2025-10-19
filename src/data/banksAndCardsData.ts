import { Bank, Card } from '@/types/dashboard';

// Datos mock de banks
export const banksData: Bank[] = [
  {
    id: 'bank-1',
    name: 'Santander',
    color: '#E31837',
    logo: '/logos/santander.png',
    createdAt: '2024-01-15'
  },
  {
    id: 'bank-2',
    name: 'BBVA',
    color: '#004481',
    logo: '/logos/bbva.png',
    createdAt: '2024-02-20'
  },
  {
    id: 'bank-3',
    name: 'Nación',
    color: '#0066CC',
    logo: '/logos/nacion.png',
    createdAt: '2024-03-10'
  },
  {
    id: 'bank-4',
    name: 'Galicia',
    color: '#003366',
    logo: '/logos/galicia.png',
    createdAt: '2024-04-05'
  }
];

// Datos mock de tarjetas
export const cardsData: Card[] = [
  {
    id: 'card-1',
    bankId: 'bank-1',
    name: 'Visa Santander',
    type: 'visa',
    lastFourDigits: '1234',
    color: '#E31837',
    createdAt: '2024-01-15'
  },
  {
    id: 'card-2',
    bankId: 'bank-1',
    name: 'Mastercard Santander',
    type: 'mastercard',
    lastFourDigits: '5678',
    color: '#E31837',
    createdAt: '2024-01-20'
  },
  {
    id: 'card-3',
    bankId: 'bank-2',
    name: 'Visa BBVA',
    type: 'visa',
    lastFourDigits: '9012',
    color: '#004481',
    createdAt: '2024-02-20'
  },
  {
    id: 'card-4',
    bankId: 'bank-2',
    name: 'American Express BBVA',
    type: 'amex',
    lastFourDigits: '3456',
    color: '#004481',
    createdAt: '2024-02-25'
  },
  {
    id: 'card-5',
    bankId: 'bank-3',
    name: 'Visa Nación',
    type: 'visa',
    lastFourDigits: '7890',
    color: '#0066CC',
    createdAt: '2024-03-10'
  }
];

// Función helper para obtener tarjetas por banco
export const getCardsByBank = (bankId: string): Card[] => {
  return cardsData.filter(card => card.bankId === bankId);
};

// Función helper para obtener banco por ID
export const getBankById = (bankId: string): Bank | undefined => {
  return banksData.find(bank => bank.id === bankId);
};

// Función helper para obtener tarjeta por ID
export const getCardById = (cardId: string): Card | undefined => {
  return cardsData.find(card => card.id === cardId);
};
