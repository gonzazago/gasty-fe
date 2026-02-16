import { ExpenseDataDetail, ExpenseDetail } from '@/types/dashboard';

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

/**
 * Agrupa gastos de la API por mes y los convierte al formato ExpenseDataDetail
 */
export function groupExpensesByMonth(expenses: ApiExpense[]): ExpenseDataDetail[] {
  // Agrupar gastos por mes
  const expensesByMonth = new Map<string, ApiExpense[]>();
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    if (!expensesByMonth.has(monthKey)) {
      expensesByMonth.set(monthKey, []);
    }
    expensesByMonth.get(monthKey)!.push(expense);
  });

  // Convertir a ExpenseDataDetail
  const result: ExpenseDataDetail[] = [];
  const sortedMonths = Array.from(expensesByMonth.keys()).sort();

  sortedMonths.forEach((monthKey, index) => {
    const monthExpenses = expensesByMonth.get(monthKey)!;
    const firstExpense = monthExpenses[0];
    const date = new Date(firstExpense.date);
    const monthName = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    // Mapear gastos al formato del frontend
    const mappedExpenses: ExpenseDetail[] = monthExpenses.map(exp => ({
      category: exp.category,
      place: exp.description,
      amount: exp.amount,
      date: exp.date,
      fixed: false, // El backend no tiene este campo aún
      split: null, // El backend no tiene este campo aún
      cardId: exp.cardId,
    }));

    // Calcular totales
    const totalCurrentMonth = mappedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Obtener total del mes anterior
    const previousMonthTotal = index > 0 
      ? result[index - 1].totalCurrentMonth 
      : 0;
    
    // Calcular variación
    const totalVariation = previousMonthTotal > 0
      ? ((totalCurrentMonth - previousMonthTotal) / previousMonthTotal) * 100
      : totalCurrentMonth > 0 ? 100 : 0;

    result.push({
      id: `month-${date.getMonth() + 1}-${date.getFullYear()}`,
      month: capitalizedMonth,
      totalIncome: 0, // El backend no tiene este campo aún, se puede configurar después
      totalCurrentMonth,
      totalPreviousMonth: previousMonthTotal,
      totalVariation,
      expenses: mappedExpenses,
    });
  });

  return result;
}

/**
 * Filtra gastos por rango de fechas
 */
export function filterExpensesByDateRange(
  expenses: ApiExpense[],
  startDate: Date,
  endDate: Date
): ApiExpense[] {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
}

