'use server';
import {revalidatePath} from 'next/cache'; // <-- Importar revalidatePath
import {expenseDetailsByMonth, expenseDetailsData} from '@/data/expenseDetailsData';
import {balanceData, expenseData, metricsData, monthlyData} from '@/data/mockData';
import {BalanceData, ExpenseData, ExpenseDataDetail, ExpenseDetail, MetricData, MonthlyData} from '@/types/dashboard';

// Acción para obtener métricas del dashboard
export async function getMetricsData(): Promise<MetricData[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

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
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    return expenseData;
}

// Acción para obtener datos mensuales
export async function getMonthlyData(): Promise<MonthlyData[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

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
export async function addExpense(expense: ExpenseDetail): Promise<void> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    // 2. Obtener el mes y año de la fecha del gasto
    // new Date() maneja 'YYYY-MM-DD' correctamente
    const dateObj = new Date(expense.date);

    // 3. Formatear el string del mes (Ej: "Noviembre 2025")
    // Importante: 'es-ES' para el nombre del mes en español
    const monthName = dateObj.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
    const year = dateObj.getUTCFullYear();

    // Capitalizar la primera letra (ej: "noviembre" -> "Noviembre")
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const targetMonthString = `${capitalizedMonth} ${year}`;

    // 4. Encontrar el mes correspondiente en la "base de datos"
    const targetMonthData = expenseDetailsByMonth.find(
        (data) => data.month === targetMonthString
    );

    // 5. Si se encuentra el mes, agregar el gasto y recalcular
    if (targetMonthData) {
        // Agregar el gasto al array de ese mes
        targetMonthData.expenses.push(expense);

        // Recalcular el total de gastos para ESE mes
        const newTotal = targetMonthData.expenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
        );
        targetMonthData.totalCurrentMonth = newTotal;

        // (Opcional) Recalcular la variación de ese mes
        const prevTotal = targetMonthData.totalPreviousMonth;
        if (prevTotal > 0) {
            targetMonthData.totalVariation = ((newTotal - prevTotal) / prevTotal) * 100;
        } else if (newTotal > 0) {
            targetMonthData.totalVariation = 100; // Si el anterior era 0
        } else {
            targetMonthData.totalVariation = 0; // Si ambos son 0
        }

    } else {
        // Manejar el caso donde el mes no existe (aunque no debería pasar si la UI está bien)
        console.error(`Error: No se encontró el mes "${targetMonthString}" en 'expenseDetailsByMonth'.`);
        // Como fallback, podrías agregarlo al último mes, pero es mejor que falle y lo notes.
    }

    // 6. Revalidar la ruta para que Next.js actualice la UI
    revalidatePath('/detalle');
}


export async function addMonth(monthName: string, totalIncome: number): Promise<void> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));

    // 1. Obtener el total del último mes para usarlo como "mes anterior"
    const lastMonth = expenseDetailsByMonth[expenseDetailsByMonth.length - 1];
    const previousMonthTotal = lastMonth ? lastMonth.totalCurrentMonth : 0;

    // 2. Calcular la variación (si el mes anterior tuvo gastos, la variación es -100%)
    const variation = previousMonthTotal > 0 ? -100 : 0;

    // 3. Crear el nuevo registro de mes (vacío)
    const newMonth: ExpenseDataDetail = {
        month: monthName,
        totalIncome: totalIncome, // Inicia en 0
        totalCurrentMonth: 0, // Inicia en 0
        totalPreviousMonth: previousMonthTotal,
        totalVariation: variation,
        expenses: [], // Array de gastos vacío
    };

    // 4. Agregar el nuevo mes a la data (simulación de DB)
    expenseDetailsByMonth.push(newMonth);

    // 5. Revalidar la ruta
    revalidatePath('/detalle');
}
