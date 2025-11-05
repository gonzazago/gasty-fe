import {ExpenseDataDetail} from '@/types/dashboard';

// Datos para múltiples meses
export const expenseDetailsByMonth: ExpenseDataDetail[] = [
    {
        month: "Octubre 2025",
        totalIncome: 3000000.00,
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

];

// Export para el mes actual (Noviembre 2024)
export const expenseDetailsData = expenseDetailsByMonth[0]; // Noviembre 2024
