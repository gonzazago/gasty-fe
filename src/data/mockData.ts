import { MetricData, BalanceData, ExpenseData, MonthlyData } from '@/types/dashboard';

export const metricsData: MetricData[] = [
  {
    title: 'Total Ingresos',
    value: '$8,500.00',
    currency: 'ARS',
    change: {
      percentage: '8.5%',
      isPositive: true,
      description: 'Ganaste $650 extra comparado al mes pasado'
    },
    details: {
      transactions: 32,
      categories: 8
    }
  },
  {
    title: 'Total Gastos',
    value: '$6,222.00',
    currency: 'ARS',
    change: {
      percentage: '3.8%',
      isPositive: false,
      description: 'Gastaste $228 extra comparado al mes pasado'
    },
    details: {
      transactions: 45,
      categories: 12
    }
  },
  {
    title: 'Resto',
    value: '$2,278.00',
    currency: 'ARS',
    change: {
      percentage: '15.2%',
      isPositive: true,
      description: 'Tienes $422 extra comparado al mes pasado'
    },
    details: {
      transactions: 77,
      categories: 20
    }
  }
];

export const balanceData: BalanceData[] = [
  // Mayo 2024
  { date: '1 May', currentMonth: 8000, lastMonth: 7500 },
  { date: '2 May', currentMonth: 8200, lastMonth: 7800 },
  { date: '3 May', currentMonth: 8500, lastMonth: 8000 },
  { date: '4 May', currentMonth: 8800, lastMonth: 8200 },
  { date: '5 May', currentMonth: 9200, lastMonth: 8500 },
  { date: '6 May', currentMonth: 9500, lastMonth: 8800 },
  { date: '7 May', currentMonth: 9800, lastMonth: 9000 },
  { date: '8 May', currentMonth: 10200, lastMonth: 9200 },
  { date: '9 May', currentMonth: 10500, lastMonth: 9500 },
  { date: '10 May', currentMonth: 10800, lastMonth: 9800 },
  { date: '11 May', currentMonth: 11200, lastMonth: 10000 },
  { date: '12 May', currentMonth: 11500, lastMonth: 10200 },
  { date: '13 May', currentMonth: 11800, lastMonth: 10500 },
  { date: '14 May', currentMonth: 12200, lastMonth: 10800 },
  { date: '15 May', currentMonth: 12500, lastMonth: 11000 },
  { date: '16 May', currentMonth: 12800, lastMonth: 11200 },
  { date: '17 May', currentMonth: 13200, lastMonth: 11500 },
  { date: '18 May', currentMonth: 13500, lastMonth: 11800 },
  { date: '19 May', currentMonth: 13800, lastMonth: 12000 },
  { date: '20 May', currentMonth: 14200, lastMonth: 12200 },
  { date: '21 May', currentMonth: 14500, lastMonth: 12500 },
  { date: '22 May', currentMonth: 14800, lastMonth: 12800 },
  { date: '23 May', currentMonth: 15200, lastMonth: 13000 },
  { date: '24 May', currentMonth: 15500, lastMonth: 13200 },
  { date: '25 May', currentMonth: 15800, lastMonth: 13500 },
  { date: '26 May', currentMonth: 16200, lastMonth: 13800 },
  { date: '27 May', currentMonth: 16500, lastMonth: 14000 },
  { date: '28 May', currentMonth: 16800, lastMonth: 14200 },
  { date: '29 May', currentMonth: 17200, lastMonth: 14500 },
  { date: '30 May', currentMonth: 17500, lastMonth: 14800 },
  { date: '31 May', currentMonth: 17800, lastMonth: 15000 },
  
  // Junio 2024
  { date: '1 Jun', currentMonth: 18000, lastMonth: 15200 },
  { date: '2 Jun', currentMonth: 18200, lastMonth: 15500 },
  { date: '3 Jun', currentMonth: 18500, lastMonth: 15800 },
  { date: '4 Jun', currentMonth: 18800, lastMonth: 16000 },
  { date: '5 Jun', currentMonth: 19200, lastMonth: 16200 },
  { date: '6 Jun', currentMonth: 19500, lastMonth: 16500 },
  { date: '7 Jun', currentMonth: 19800, lastMonth: 16800 },
  { date: '8 Jun', currentMonth: 20200, lastMonth: 17000 },
  { date: '9 Jun', currentMonth: 20500, lastMonth: 17200 },
  { date: '10 Jun', currentMonth: 20800, lastMonth: 17500 },
  { date: '11 Jun', currentMonth: 21200, lastMonth: 17800 },
  { date: '12 Jun', currentMonth: 21500, lastMonth: 18000 },
  { date: '13 Jun', currentMonth: 21800, lastMonth: 18200 },
  { date: '14 Jun', currentMonth: 22200, lastMonth: 18500 },
  { date: '15 Jun', currentMonth: 22500, lastMonth: 18800 },
  { date: '16 Jun', currentMonth: 22800, lastMonth: 19000 },
  { date: '17 Jun', currentMonth: 23200, lastMonth: 19200 },
  { date: '18 Jun', currentMonth: 23500, lastMonth: 19500 },
  { date: '19 Jun', currentMonth: 23800, lastMonth: 19800 },
  { date: '20 Jun', currentMonth: 24200, lastMonth: 20000 },
  { date: '21 Jun', currentMonth: 24500, lastMonth: 20200 },
  { date: '22 Jun', currentMonth: 24800, lastMonth: 20500 },
  { date: '23 Jun', currentMonth: 25200, lastMonth: 20800 },
  { date: '24 Jun', currentMonth: 25500, lastMonth: 21000 },
  { date: '25 Jun', currentMonth: 25800, lastMonth: 21200 },
  { date: '26 Jun', currentMonth: 26200, lastMonth: 21500 },
  { date: '27 Jun', currentMonth: 26500, lastMonth: 21800 },
  { date: '28 Jun', currentMonth: 26800, lastMonth: 22000 },
  { date: '29 Jun', currentMonth: 27200, lastMonth: 22200 },
  { date: '30 Jun', currentMonth: 27500, lastMonth: 22500 },
  
  // Julio 2024 (mes actual)
  { date: '1 Jul', currentMonth: 12000, lastMonth: 10000 },
  { date: '2 Jul', currentMonth: 12500, lastMonth: 10200 },
  { date: '3 Jul', currentMonth: 13000, lastMonth: 10500 },
  { date: '4 Jul', currentMonth: 12800, lastMonth: 10800 },
  { date: '5 Jul', currentMonth: 15000, lastMonth: 11000 },
  { date: '6 Jul', currentMonth: 14500, lastMonth: 11200 },
  { date: '7 Jul', currentMonth: 14000, lastMonth: 11500 },
  { date: '8 Jul', currentMonth: 14200, lastMonth: 11800 },
  { date: '9 Jul', currentMonth: 13800, lastMonth: 12000 },
  { date: '10 Jul', currentMonth: 13500, lastMonth: 12200 },
  { date: '11 Jul', currentMonth: 13200, lastMonth: 12500 },
  { date: '12 Jul', currentMonth: 13000, lastMonth: 12800 },
  { date: '13 Jul', currentMonth: 12800, lastMonth: 13000 },
  { date: '14 Jul', currentMonth: 12500, lastMonth: 13200 },
  { date: '15 Jul', currentMonth: 12200, lastMonth: 13500 },
  { date: '16 Jul', currentMonth: 12000, lastMonth: 13800 },
  { date: '17 Jul', currentMonth: 11800, lastMonth: 14000 },
  { date: '18 Jul', currentMonth: 11500, lastMonth: 14200 },
  { date: '19 Jul', currentMonth: 15700, lastMonth: 14500 }
];

export const expenseData: ExpenseData[] = [
  { name: 'Transferencias', value: 2500, color: '#9333ea', percentage: 40 },
  { name: 'Café y Restaurantes', value: 1200, color: '#9ca3af', percentage: 19 },
  { name: 'Alquiler', value: 1000, color: '#9333ea', percentage: 16 },
  { name: 'Educación', value: 800, color: '#9ca3af', percentage: 13 },
  { name: 'Comida y Comestibles', value: 500, color: '#9333ea', percentage: 8 },
  { name: 'Otros', value: 222, color: '#9ca3af', percentage: 4 }
];

export const monthlyData: MonthlyData[] = [
  { month: 'Ene', expense: 5000, budget: 6000 },
  { month: 'Feb', expense: 7200, budget: 6000 },
  { month: 'Mar', expense: 4500, budget: 6000 },
  { month: 'Abr', expense: 6800, budget: 6000 },
  { month: 'May', expense: 5200, budget: 6000 },
  { month: 'Jun', expense: 7500, budget: 6000 },
  { month: 'Jul', expense: 6222, budget: 6000 },
  { month: 'Ago', expense: 5800, budget: 6000 },
  { month: 'Sep', expense: 7100, budget: 6000 },
  { month: 'Oct', expense: 4900, budget: 6000 },
  { month: 'Nov', expense: 6800, budget: 6000 },
  { month: 'Dic', expense: 6200, budget: 6000 }
];
