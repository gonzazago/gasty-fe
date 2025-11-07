export interface MetricData {
    title: string;
    value: string;
    currency: string;
    change: {
        percentage: string;
        isPositive: boolean;
        description: string;
    };
    details: {
        transactions: number;
        categories: number;
    };
}

export interface BalanceData {
    date: string;
    currentMonth: number;
    lastMonth: number;
}

export interface ExpenseData {
    name: string;
    value: number;
    color: string;
    percentage: number;
    [key: string]: unknown; // <-- Añade esta línea
}

export interface MonthlyData {
    month: string;
    expense: number;
    budget: number;
}

export interface Bank {
    id: string;
    name: string;
    color: string;
    logo?: string;
    createdAt: string;
}

export interface Card {
    id: string;
    bankId: string;
    name: string;
    type: 'visa' | 'mastercard' | 'amex' | 'other';
    lastFourDigits: string;
    color: string;
    createdAt: string;
}

export interface ExpenseDetail {
    category: string;
    place: string;
    amount: number;
    date: string;
    fixed: boolean;
    split: {
        current: number;
        total: number;
        lefts: number;
    } | null;
    cardId?: string; // Nueva propiedad para asociar con tarjeta
}

export interface ExpenseDataDetail {
    id: string
    month: string;
    expenses: ExpenseDetail[];
    totalIncome: number
    totalCurrentMonth: number;
    totalPreviousMonth: number;
    totalVariation: number;
}
