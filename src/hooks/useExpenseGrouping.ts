// src/hooks/useExpenseGrouping.ts
import { useMemo } from 'react';
import { ExpenseDetail, Card } from '@/types/dashboard';

// 1. Definimos los tipos de fila que la tabla puede renderizar
export type CardSummaryRow = {
    type: 'CARD_SUMMARY';
    cardId: string;
    cardName: string;
    cardLogo?: string;
    cardColor: string;
    totalAmount: number;
    childExpenses: ExpenseDetail[];
};

export type StandaloneExpenseRow = {
    type: 'STANDALONE_EXPENSE';
    expense: ExpenseDetail;
};

export type ProcessedRow = CardSummaryRow | StandaloneExpenseRow;

// 2. El Hook de agrupación
export function useExpenseGrouping(expenses: ExpenseDetail[], cards: Card[]): ProcessedRow[] {

    return useMemo(() => {
        const cardExpensesMap = new Map<string, ExpenseDetail[]>();
        const standaloneExpenses: StandaloneExpenseRow[] = [];

        // 1. Clasificar gastos
        for (const expense of expenses) {
            if (expense.cardId) {
                if (!cardExpensesMap.has(expense.cardId)) {
                    cardExpensesMap.set(expense.cardId, []);
                }
                cardExpensesMap.get(expense.cardId)!.push(expense);
            } else {
                standaloneExpenses.push({ type: 'STANDALONE_EXPENSE', expense });
            }
        }

        // 2. Crear las filas de resumen de tarjeta
        const cardSummaryRows: CardSummaryRow[] = [];
        for (const [cardId, childExpenses] of cardExpensesMap.entries()) {
            console.log(cards)
            const cardInfo = cards.find(c => c.id === cardId);
            const totalAmount = childExpenses.reduce((sum, exp) => sum + exp.amount, 0);

            cardSummaryRows.push({
                type: 'CARD_SUMMARY',
                cardId: cardId,
                cardName: cardInfo?.name || 'Tarjeta Desconocida',
                cardColor: cardInfo?.color || '#6B7280', // Gris por defecto
                totalAmount: totalAmount,
                childExpenses: childExpenses,
            });
        }

        return [...cardSummaryRows, ...standaloneExpenses];

    }, [expenses, cards]);
}