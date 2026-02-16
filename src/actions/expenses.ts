'use server';
import {revalidatePath} from 'next/cache';
import {balanceData} from '@/data/mockData';
import {BalanceData, ExpenseData, ExpenseDataDetail, ExpenseDetail, MetricData, MonthlyData, Card} from '@/types/dashboard';
import {getAllCards} from './banksAndCards';
import { apiClient } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';
import { mapApiExpenseToExpenseDetail, mapExpenseDetailToApiExpense } from '@/lib/api/mappers';
import { groupExpensesByMonth, filterExpensesByDateRange } from '@/lib/api/expenseHelpers';

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

// Acción para obtener métricas del dashboard
export async function getMetricsData(): Promise<MetricData[]> {
    try {
        // Obtener todos los gastos de la API
        const expenses = await apiClient.get<ApiExpense[]>(API_CONFIG.endpoints.expenses);
        const expenseDetails = groupExpensesByMonth(expenses);

        // Obtener el mes más reciente
        const currentMonthData = expenseDetails[expenseDetails.length - 1];

    if (!currentMonthData) return []; // Manejar si no hay datos

        const totalIncome = currentMonthData.totalIncome || 0;
    const totalExpenses = currentMonthData.totalCurrentMonth;
    const balance = totalIncome - totalExpenses;

    const prevBalance = currentMonthData.totalPreviousMonth
            ? totalIncome - currentMonthData.totalPreviousMonth
        : 0;

    const balanceChange = prevBalance > 0 ? ((balance - prevBalance) / prevBalance) * 100 : (balance > 0 ? 100 : 0);

        // Contar categorías únicas
        const uniqueCategories = new Set(currentMonthData.expenses.map(e => e.category)).size;

    return [
        {
            title: 'Total Ingresos',
            value: `$${totalIncome.toLocaleString('es-AR')}`,
            currency: 'ARS',
            change: {
                    percentage: '0.0%',
                isPositive: true,
                description: `Mes de ${currentMonthData.month}`
            },
                details: {transactions: 0, categories: 0}
        },
        {
            title: 'Total Gastos',
            value: `$${totalExpenses.toLocaleString('es-AR')}`,
            currency: 'ARS',
            change: {
                percentage: `${currentMonthData.totalVariation.toFixed(1)}%`,
                    isPositive: currentMonthData.totalVariation <= 0,
                description: 'vs mes anterior'
            },
                details: {transactions: currentMonthData.expenses.length, categories: uniqueCategories}
        },
        {
            title: 'Resto',
            value: `$${balance.toLocaleString('es-AR')}`,
            currency: 'ARS',
            change: {
                percentage: `${balanceChange.toFixed(1)}%`,
                isPositive: balanceChange >= 0,
                description: 'vs mes anterior'
            },
            details: {transactions: 0, categories: 0}
        }
    ];
    } catch (error) {
        console.error('Error al obtener métricas:', error);
        return [];
    }
}

// Acción para obtener datos de balance
export async function getBalanceData(): Promise<BalanceData[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    return balanceData;
}

// Acción para obtener datos de gastos por tipo
export async function getExpenseData(): Promise<ExpenseData[]> {
    try {
        // Obtener todos los gastos de la API
        const expenses = await apiClient.get<ApiExpense[]>(API_CONFIG.endpoints.expenses);
        const expenseDetails = groupExpensesByMonth(expenses);

        // Obtener el mes más reciente
        const currentMonthData = expenseDetails[expenseDetails.length - 1];
    if (!currentMonthData) return [];

        // Agrupar gastos por categoría
    const expensesByCategory = new Map<string, number>();
    for (const expense of currentMonthData.expenses) {
        const currentAmount = expensesByCategory.get(expense.category) || 0;
        expensesByCategory.set(expense.category, currentAmount + expense.amount);
    }

        // Convertir al formato de gráfico (ExpenseData)
    const colors = ['#9333ea', '#c084fc', '#7e22ce', '#a855f7', '#6b21a8'];
    const totalExpenses = currentMonthData.totalCurrentMonth;

    const expenseData: ExpenseData[] = [];
    let colorIndex = 0;

    for (const [name, value] of expensesByCategory.entries()) {
        expenseData.push({
            name: name,
            value: value,
            color: colors[colorIndex % colors.length],
                percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0
        });
        colorIndex++;
    }

    return expenseData;
    } catch (error) {
        console.error('Error al obtener datos de gastos:', error);
        return [];
    }
}

// Acción para obtener datos mensuales
export async function getMonthlyData(): Promise<MonthlyData[]> {
    try {
        // Obtener todos los gastos de la API
        const expenses = await apiClient.get<ApiExpense[]>(API_CONFIG.endpoints.expenses);
        const expenseDetails = groupExpensesByMonth(expenses);

        return expenseDetails.map(monthData => ({
        month: monthData.month.split(' ')[0].substring(0, 3), // "Octubre 2025" -> "Oct"
        expense: monthData.totalCurrentMonth,
            budget: monthData.totalIncome || 0
    }));
    } catch (error) {
        console.error('Error al obtener datos mensuales:', error);
        return [];
    }
}

// Acción para obtener datos de gastos detallados por mes
export async function getExpenseDetailsByMonth(): Promise<ExpenseDataDetail[]> {
    try {
        // Obtener todos los gastos de la API
        const expenses = await apiClient.get<ApiExpense[]>(API_CONFIG.endpoints.expenses);
        return groupExpensesByMonth(expenses);
    } catch (error) {
        console.error('Error al obtener detalles de gastos por mes:', error);
        return [];
    }
}

// Acción para obtener datos de gastos detallados de un mes específico
export async function getExpenseDetailsForMonth(monthIndex: number): Promise<ExpenseDataDetail> {
    try {
        const expenseDetails = await getExpenseDetailsByMonth();
        const data = expenseDetails[monthIndex];

    if (!data) {
        throw new Error(`No se encontraron datos para el mes ${monthIndex}`);
    }

    return data;
    } catch (error) {
        console.error('Error al obtener detalles del mes:', error);
        throw error;
    }
}

// Acción para obtener el total de gastos de un mes
export async function getTotalExpensesForMonth(monthIndex: number): Promise<{
    total: number;
    fixed: number;
    variable: number;
    installments: number;
}> {
    try {
        const data = await getExpenseDetailsForMonth(monthIndex);

    const total = data.totalCurrentMonth;
    const fixed = data.expenses
        .filter(e => e.fixed)
        .reduce((sum, expense) => sum + expense.amount, 0);
    const variable = data.expenses
        .filter(e => !e.fixed)
        .reduce((sum, expense) => sum + expense.amount, 0);
    const installments = data.expenses
        .filter(e => e.split !== null)
        .reduce((sum, expense) => sum + expense.amount, 0);

    return {total, fixed, variable, installments};
    } catch (error) {
        console.error('Error al obtener totales del mes:', error);
        throw error;
    }
}

// ✅ ACCIÓN 'addExpense' CORREGIDA
export async function addExpense(monthId: string, expense: ExpenseDetail): Promise<void> {
    try {
        // Mapear el gasto al formato de la API
        const apiExpenseData = mapExpenseDetailToApiExpense(expense, monthId);
        
        // Crear el gasto en la API
        await apiClient.post<ApiExpense>(API_CONFIG.endpoints.expenses, apiExpenseData);
        
        // Revalidar las rutas para que Next.js actualice la UI
    revalidatePath('/detalle');
    revalidatePath('/dashboard');
    } catch (error) {
        console.error('Error al agregar gasto:', error);
        throw error;
    }
}


export async function addMonth(monthIndex: number, year: number, totalIncome: number): Promise<void> {
    // Nota: El backend no tiene un concepto de "mes" como entidad separada.
    // Los meses se generan automáticamente al agrupar gastos por fecha.
    // Esta función ahora solo revalida las rutas, ya que el mes se creará
    // automáticamente cuando se agreguen gastos para ese período.
    
    // TODO: Si se necesita almacenar totalIncome por mes, se podría:
    // 1. Agregar un endpoint en el backend para configuraciones de mes
    // 2. O almacenar el totalIncome en algún lugar (localStorage, base de datos separada, etc.)
    
    revalidatePath('/detalle');
}

// Acción para obtener datos de evolución de gastos en cuotas por tarjeta
export async function getInstallmentEvolutionData(): Promise<{ month: string; [cardName: string]: string | number }[]> {
    try {
    // 1. Obtener todas las tarjetas
    const cards = await getAllCards();
    const cardMap = new Map<string, Card>();
    cards.forEach(card => {
        cardMap.set(card.id, card);
    });

        // 2. Obtener todos los gastos de la API
        const expenses = await apiClient.get<ApiExpense[]>(API_CONFIG.endpoints.expenses);
        const expenseDetails = groupExpensesByMonth(expenses);

        // 3. Procesar gastos en cuotas por mes y tarjeta
    const monthlyData = new Map<string, Map<string, number>>(); // month -> cardName -> amount

        expenseDetails.forEach(monthData => {
        const monthKey = monthData.month.split(' ')[0].substring(0, 3); // "Octubre 2025" -> "Oct"
        const cardAmounts = new Map<string, number>();

        monthData.expenses.forEach(expense => {
            // Solo procesar gastos que tienen cuotas (split) y están asociados a una tarjeta
                // Nota: El backend no tiene el campo split aún, así que por ahora solo filtramos por cardId
            if (expense.split !== null && expense.cardId) {
                const card = cardMap.get(expense.cardId);
                if (card) {
                    const currentAmount = cardAmounts.get(card.name) || 0;
                    // Sumar el monto de la cuota (ya está dividido por el total de cuotas)
                    cardAmounts.set(card.name, currentAmount + expense.amount);
                }
            }
        });

        if (cardAmounts.size > 0) {
            monthlyData.set(monthKey, cardAmounts);
        }
    });

        // 4. Obtener todos los meses únicos y todas las tarjetas que tienen datos
    const months = Array.from(monthlyData.keys());
    const allCardNames = new Set<string>();
    monthlyData.forEach(cardAmounts => {
        cardAmounts.forEach((_, cardName) => {
            allCardNames.add(cardName);
        });
    });

        // 5. Construir el array de datos para el gráfico
    const chartData = months.map(month => {
        const dataPoint: { month: string; [cardName: string]: string | number } = { month };
        const cardAmounts = monthlyData.get(month);
        
        allCardNames.forEach(cardName => {
            dataPoint[cardName] = cardAmounts?.get(cardName) || 0;
        });

        return dataPoint;
    });

    return chartData;
    } catch (error) {
        console.error('Error al obtener datos de evolución de cuotas:', error);
        return [];
    }
}
