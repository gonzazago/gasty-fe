'use server';
import {revalidatePath} from 'next/cache'; // <-- Importar revalidatePath
import {expenseDetailsByMonth} from '@/data/expenseDetailsData';
import {balanceData} from '@/data/mockData';
import {BalanceData, ExpenseData, ExpenseDataDetail, ExpenseDetail, MetricData, MonthlyData} from '@/types/dashboard';

// Acción para obtener métricas del dashboard
export async function getMetricsData(): Promise<MetricData[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    // 1. Obtener el mes más reciente de tus datos
    const currentMonthData = expenseDetailsByMonth[expenseDetailsByMonth.length - 1];

    if (!currentMonthData) return []; // Manejar si no hay datos

    const totalIncome = currentMonthData.totalIncome;
    const totalExpenses = currentMonthData.totalCurrentMonth;
    const balance = totalIncome - totalExpenses;

    const prevBalance = currentMonthData.totalPreviousMonth
        ? currentMonthData.totalIncome - currentMonthData.totalPreviousMonth // Asume mismo ingreso
        : 0;

    const balanceChange = prevBalance > 0 ? ((balance - prevBalance) / prevBalance) * 100 : (balance > 0 ? 100 : 0);

    // 2. Generar las Métricas dinámicamente
    const metricsData: MetricData[] = [
        {
            title: 'Total Ingresos',
            value: `$${totalIncome.toLocaleString('es-AR')}`,
            currency: 'ARS',
            change: {
                percentage: '0.0%', // No tenemos historial de ingresos
                isPositive: true,
                description: `Mes de ${currentMonthData.month}`
            },
            details: {transactions: 0, categories: 0} // Podríamos calcular esto si quisiéramos
        },
        {
            title: 'Total Gastos',
            value: `$${totalExpenses.toLocaleString('es-AR')}`,
            currency: 'ARS',
            change: {
                percentage: `${currentMonthData.totalVariation.toFixed(1)}%`,
                isPositive: currentMonthData.totalVariation <= 0, // Menos gasto es positivo
                description: 'vs mes anterior'
            },
            details: {transactions: currentMonthData.expenses.length, categories: 0}
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

    return metricsData;
}

// Acción para obtener datos de balance
export async function getBalanceData(): Promise<BalanceData[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    return balanceData;
}

// Acción para obtener datos de gastos por tipo
export async function getExpenseData(): Promise<ExpenseData[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // 1. Obtener gastos del mes más reciente
    const currentMonthData = expenseDetailsByMonth[expenseDetailsByMonth.length - 1];
    if (!currentMonthData) return [];

    // 2. Agrupar gastos por categoría
    const expensesByCategory = new Map<string, number>();
    for (const expense of currentMonthData.expenses) {
        const currentAmount = expensesByCategory.get(expense.category) || 0;
        expensesByCategory.set(expense.category, currentAmount + expense.amount);
    }

    // 3. Convertir al formato de gráfico (ExpenseData)
    const colors = ['#9333ea', '#c084fc', '#7e22ce', '#a855f7', '#6b21a8'];
    const totalExpenses = currentMonthData.totalCurrentMonth;

    const expenseData: ExpenseData[] = [];
    let colorIndex = 0;

    for (const [name, value] of expensesByCategory.entries()) {
        expenseData.push({
            name: name,
            value: value,
            color: colors[colorIndex % colors.length],
            percentage: (value / totalExpenses) * 100
        });
        colorIndex++;
    }

    return expenseData;
}

// Acción para obtener datos mensuales
export async function getMonthlyData(): Promise<MonthlyData[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // 1. Mapear todos los meses de tus datos
    const monthlyData: MonthlyData[] = expenseDetailsByMonth.map(monthData => ({
        month: monthData.month.split(' ')[0].substring(0, 3), // "Octubre 2025" -> "Oct"
        expense: monthData.totalCurrentMonth,
        budget: monthData.totalIncome // Asumimos que el ingreso es el presupuesto
    }));

    return monthlyData;
}

// Acción para obtener datos de gastos detallados por mes
export async function getExpenseDetailsByMonth(): Promise<ExpenseDataDetail[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    return expenseDetailsByMonth;
}

// Acción para obtener datos de gastos detallados de un mes específico
export async function getExpenseDetailsForMonth(monthIndex: number): Promise<ExpenseDataDetail> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = expenseDetailsByMonth[monthIndex];
    if (!data) {
        throw new Error(`No se encontraron datos para el mes ${monthIndex}`);
    }

    return data;
}

// Acción para obtener el total de gastos de un mes
export async function getTotalExpensesForMonth(monthIndex: number): Promise<{
    total: number;
    fixed: number;
    variable: number;
    installments: number;
}> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = expenseDetailsByMonth[monthIndex];
    if (!data) {
        throw new Error(`No se encontraron datos para el mes ${monthIndex}`);
    }

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
}

// ✅ ACCIÓN 'addExpense' CORREGIDA
export async function addExpense(monthId: string, expense: ExpenseDetail): Promise<void> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));
// 1. Encontrar el mes por ID (mucho más rápido y fiable)
    const targetMonthData = expenseDetailsByMonth.find(
        (data) => data.id === monthId
    );

    if (targetMonthData) {
        // 2. Agregar el gasto
        targetMonthData.expenses.push(expense);

        // 3. Recalcular totales
        const newTotal = targetMonthData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        targetMonthData.totalCurrentMonth = newTotal;

        const prevTotal = targetMonthData.totalPreviousMonth;
        if (prevTotal > 0) {
            targetMonthData.totalVariation = ((newTotal - prevTotal) / prevTotal) * 100;
        } else if (newTotal > 0) {
            targetMonthData.totalVariation = 100;
        } else {
            targetMonthData.totalVariation = 0;
        }

    } else {
        console.error(`Error: No se encontró el mes con ID "${monthId}".`);
    }

    // 6. Revalidar la ruta para que Next.js actualice la UI
    revalidatePath('/detalle');
}


export async function addMonth(monthIndex: number, year: number, totalIncome: number): Promise<void> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));
    await new Promise(resolve => setTimeout(resolve, 100));

    // 1. Generar ID único y Nombre
    const monthId = `month-${monthIndex + 1}-${year}`; // Ej: month-12-2025

    const date = new Date(year, monthIndex);
    const monthName = date.toLocaleString('es-ES', {month: 'long', timeZone: 'UTC'});
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const monthString = `${capitalizedMonth} ${year}`;

    // 2. Verificar si ya existe
    if (expenseDetailsByMonth.some(m => m.id === monthId)) {
        console.warn(`El mes con id ${monthId} ya existe.`);
        return; // O manejar el error
    }

    // 3. Obtener datos del mes anterior
    const lastMonth = expenseDetailsByMonth[expenseDetailsByMonth.length - 1];
    const previousMonthTotal = lastMonth ? lastMonth.totalCurrentMonth : 0;
    const variation = previousMonthTotal > 0 ? -100 : 0;

    // 4. Crear nuevo mes con ID
    const newMonth: ExpenseDataDetail = {
        id: monthId, // <-- ID asignado
        month: monthString,
        totalIncome: totalIncome,
        totalCurrentMonth: 0,
        totalPreviousMonth: previousMonthTotal,
        totalVariation: variation,
        expenses: [],
    };

    expenseDetailsByMonth.push(newMonth);
    // 5. Revalidar la ruta
    revalidatePath('/detalle');
}
