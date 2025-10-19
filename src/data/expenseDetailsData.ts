import { ExpenseDataDetail } from '@/types/dashboard';

// Datos para múltiples meses
export const expenseDetailsByMonth: ExpenseDataDetail[] = [
  {
    month: "Octubre 2024",
    totalCurrentMonth: 2850000.00,
    totalPreviousMonth: 2750000.00,
    totalVariation: 3.6,
    expenses: [
      {
        category: "Tarjetas",
        place: "Visa Santander",
        amount: 1500000.00,
        date: "2024-10-01",
        fixed: true,
        split: null,
        variation: 0
      },
      {
        category: "Hogar",
        place: "Alquiler",
        amount: 900000.00,
        date: "2024-10-01",
        fixed: true,
        split: null,
        variation: 0
      },
      {
        category: "Comida",
        place: "Supermercado",
        amount: 75000.00,
        date: "2024-10-10",
        fixed: false,
        split: null,
        variation: 5.2
      },
      {
        category: "Transporte",
        place: "Uber",
        amount: 15000.00,
        date: "2024-10-15",
        fixed: false,
        split: null,
        variation: 12.5
      },
      {
        category: "Entretenimiento",
        place: "Netflix",
        amount: 4500.00,
        date: "2024-10-01",
        fixed: true,
        split: null,
        variation: 0
      },
      {
        category: "Servicios",
        place: "Luz",
        amount: 16500.00,
        date: "2024-10-15",
        fixed: true,
        split: null,
        variation: -2.1
      },
      {
        category: "Servicios",
        place: "Gas",
        amount: 11000.00,
        date: "2024-10-20",
        fixed: true,
        split: null,
        variation: 1.8
      }
    ]
  },
  {
    month: "Noviembre 2024",
    totalCurrentMonth: 3075975.74,
    totalPreviousMonth: 2850000.00,
    totalVariation: 7.9,
    expenses: [
    {
      category: "Tarjetas",
      place: "Visa Santander",
      amount: 1596475.84,
      date: "2024-11-01",
      fixed: true,
      split: null,
      variation: 5.2
    },
    {
      category: "Hogar",
      place: "Alquiler",
      amount: 900000.00,
      date: "2024-11-01",
      fixed: true,
      split: null,
      variation: 0
    },
    {
      category: "Comida",
      place: "CHANGOMAS",
      amount: 54899.90,
      date: "2024-11-05",
      fixed: false,
      split: {
        current: 7,
        total: 10,
        lefts: 3
      },
      variation: undefined // Sin variación porque está en cuotas
    },
    {
      category: "Transporte",
      place: "Uber",
      amount: 12500.00,
      date: "2024-11-06",
      fixed: false,
      split: null,
      variation: 8.5 // Con variación porque no está en cuotas
    },
    {
      category: "Entretenimiento",
      place: "Netflix",
      amount: 4500.00,
      date: "2024-11-01",
      fixed: true,
      split: null,
      variation: 0
    },
    {
      category: "Salud",
      place: "Farmacia",
      amount: 23500.00,
      date: "2024-11-08",
      fixed: false,
      split: {
        current: 3,
        total: 6,
        lefts: 3
      },
      variation: undefined // Sin variación porque está en cuotas
    },
    {
      category: "Educación",
      place: "Curso Online",
      amount: 150000.00,
      date: "2024-11-01",
      fixed: false,
      split: {
        current: 2,
        total: 12,
        lefts: 10
      },
      variation: undefined // Sin variación porque está en cuotas
    },
    {
      category: "Comida",
      place: "Supermercado",
      amount: 87500.00,
      date: "2024-11-10",
      fixed: false,
      split: null,
      variation: 3.7 // Con variación porque no está en cuotas
    },
    {
      category: "Servicios",
      place: "Luz",
      amount: 18500.00,
      date: "2024-11-15",
      fixed: true,
      split: null,
      variation: -4.2
    },
    {
      category: "Servicios",
      place: "Gas",
      amount: 12200.00,
      date: "2024-11-20",
      fixed: true,
      split: null,
      variation: 2.1
    },
    {
      category: "Tarjetas",
      place: "Mastercard BBVA",
      amount: 234000.00,
      date: "2024-11-25",
      fixed: false,
      split: {
        current: 1,
        total: 3,
        lefts: 2
      },
      variation: undefined // Sin variación porque está en cuotas
    },
    {
      category: "Entretenimiento",
      place: "Spotify",
      amount: 2800.00,
      date: "2024-11-01",
      fixed: true,
      split: null,
      variation: 0
    }
  ]
  }
];

// Export para el mes actual (Noviembre 2024)
export const expenseDetailsData = expenseDetailsByMonth[1]; // Noviembre 2024
