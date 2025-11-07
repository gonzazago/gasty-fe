// src/data/expenseDetailsData.ts

import { ExpenseDataDetail } from '@/types/dashboard';

// Datos para múltiples meses
export const expenseDetailsByMonth: ExpenseDataDetail[] = [
    {
        id: "month-10-2025", // ✅ ID Corregido
        month: "Octubre 2025",
        totalIncome: 3000000.00,
        totalCurrentMonth: 2850000.00,
        totalPreviousMonth: 2750000.00,
        totalVariation: 3.6,
        expenses: [
            // --- GASTOS CON TARJETA (Se agruparán) ---
            {
                category: "Tarjetas",
                place: "Pago Resumen Visa",
                amount: 1500000.00,
                date: "2024-10-01",
                fixed: true,
                split: null,
                cardId: "card-1" // ✅ ID de Tarjeta agregado
            },
            {
                category: "Comida",
                place: "Supermercado Coto",
                amount: 75000.00,
                date: "2024-10-10",
                fixed: false,
                split: null,
                cardId: "card-1" // ✅ ID de Tarjeta agregado
            },
            {
                category: "Transporte",
                place: "Uber",
                amount: 15000.00,
                date: "2024-10-15",
                fixed: false,
                split: null,
                cardId: "card-1" // ✅ ID de Tarjeta agregado
            },
            {
                category: "Entretenimiento",
                place: "Netflix",
                amount: 4500.00,
                date: "2024-10-01",
                fixed: true,
                split: null,
                cardId: "card-1" // ✅ ID de Tarjeta agregado
            },

            // --- GASTOS SUELTOS (No se agruparán) ---
            {
                category: "Hogar",
                place: "Alquiler",
                amount: 900000.00,
                date: "2024-10-01",
                fixed: true,
                split: null,
                // Sin cardId
            },
            {
                category: "Servicios",
                place: "Luz",
                amount: 16500.00,
                date: "2024-10-15",
                fixed: true,
                split: null,
                // Sin cardId
            },
            {
                category: "Servicios",
                place: "Gas",
                amount: 11000.00,
                date: "2024-10-20",
                fixed: true,
                split: null,
                // Sin cardId
            },
            {
                category: "Comida",
                place: "Pedidos Ya",
                amount: 28000.00,
                date: "2024-10-22",
                fixed: false,
                split: null,
                cardId: "card-3" // ✅ Otro cardId para probar otro grupo
            }
        ]
    },
    // (Puedes agregar más meses aquí)
];

// Export para el mes actual (Octubre 2025)
export const expenseDetailsData = expenseDetailsByMonth[0];