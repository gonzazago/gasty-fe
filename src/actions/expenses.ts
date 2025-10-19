'use server';

import { expenseDetailsByMonth } from '@/data/expenseDetailsData';
import { metricsData, balanceData, expenseData, monthlyData } from '@/data/mockData';
import { ExpenseDataDetail, MetricData, BalanceData, ExpenseData, MonthlyData } from '@/types/dashboard';

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
  
  return { total, fixed, variable, installments };
}
