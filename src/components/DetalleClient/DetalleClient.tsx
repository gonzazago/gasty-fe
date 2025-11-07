// src/components/DetalleClient/DetalleClient.tsx
'use client';

import {Fragment, useEffect, useMemo, useState} from 'react';
import {type Column, FixedCell, InstallmentCell, Table, VariationCell} from '@/components';
import {ChevronDown, ChevronLeft, ChevronRight} from 'lucide-react';
import {Card, ExpenseDataDetail, ExpenseDetail} from '@/types/dashboard';
import {type ProcessedRow, useExpenseGrouping} from '@/hooks/useExpenseGrouping'; // Hook de agrupación

interface DetalleClientProps {
    initialData: ExpenseDataDetail[];
    initialCards: Card[]; // Necesario para agrupar por tarjeta
}
const headerColumns: Column<ProcessedRow>[] = [
    {key: 'category', header: 'Tipo de Gasto', accessor: 'type', className: 'font-medium'},
    {key: 'place', header: 'Lugar/Descripción', accessor: 'type', className: 'text-gray-600'},
    {key: 'fixed', header: 'Fijo', accessor: 'type'},
    {key: 'split', header: 'Cuotas', accessor: 'type'},
    {key: 'amount', header: 'Monto', accessor: 'type', className: 'text-right'}
];

// 2. Columnas para las FILAS de gastos (hijos y sueltos).
const expenseColumns: Column<ExpenseDetail>[] = [
    {
        key: 'category',
        header: 'Tipo de Gasto',
        accessor: 'category',
        className: 'font-medium'
    },
    {
        key: 'place',
        header: 'Lugar/Descripción',
        accessor: 'place',
        className: 'text-gray-600'
    },
    {
        key: 'fixed',
        header: 'Fijo',
        accessor: 'fixed',
        render: (value) => <FixedCell fixed={value as boolean}/>
    },
    {
        key: 'split',
        header: 'Cuotas',
        accessor: 'split',
        render: (value) => <InstallmentCell split={value as ExpenseDetail['split']}/>
    },
    {
        key: 'amount',
        header: 'Monto',
        accessor: 'amount',
        render: (value) => (
            <span className="font-semibold text-gray-900">
              ${(value as number).toLocaleString('es-AR', {minimumFractionDigits: 2})}
            </span>
        ),
        className: 'text-right'
    }
];

export default function DetalleClient({initialData, initialCards}: DetalleClientProps) {

    // ... (Estados, useEffect, Navegación de Mes, Lógica de Expansión se mantienen) ...
    const [currentMonthIndex, setCurrentMonthIndex] = useState(initialData.length > 0 ? initialData.length - 1 : 0);
    const [expensesData, setExpensesData] = useState<ExpenseDataDetail[]>(initialData);
    const expenseDetailsData = expensesData[currentMonthIndex] || expensesData[0];

    useEffect(() => {
        setExpensesData(initialData);
        if (initialData.length > 0) {
            setCurrentMonthIndex(initialData.length - 1);
        }
    }, [initialData]);

    const goToPreviousMonth = () => {
        if (currentMonthIndex > 0) {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonthIndex < expensesData.length - 1) {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    const [expandedCardIds, setExpandedCardIds] = useState(new Set<string>());
    const processedRows = useExpenseGrouping(expenseDetailsData?.expenses || [], initialCards);

    const toggleExpand = (cardId: string) => {
        setExpandedCardIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cardId)) newSet.delete(cardId);
            else newSet.add(cardId);
            return newSet;
        });
    };

// ✅ 2. CORRECCIÓN EN useMemo (para los widgets)
    const {totalIncome, fixedExpenses, variableExpenses, cuotasExpenses} = useMemo(() => {
        if (!expenseDetailsData) {
            return {totalIncome: 0, fixedExpenses: 0, variableExpenses: 0, cuotasExpenses: 0};
        }

        const totalIncome = expenseDetailsData.totalIncome || 0;

        const fixedExpenses = expenseDetailsData.expenses
            .filter(e => e.fixed)// Maneja booleano o string
            .reduce((sum, expense) => sum + (expense.amount || 0), 0);

        const variableExpenses = expenseDetailsData.expenses
            .filter(e => !e.fixed)
            .reduce((sum, expense) => sum + (expense.amount || 0), 0);

        const cuotasExpenses = expenseDetailsData.expenses
            .filter(e => e.split !== null)
            .reduce((sum, expense) => sum + (expense.amount || 0), 0);

        return {totalIncome, fixedExpenses, variableExpenses, cuotasExpenses};
    }, [expenseDetailsData]);

    if (!expenseDetailsData) {
        return <div className="p-6 text-center text-gray-500">Cargando datos del mes...</div>;
    }

    // ... (la función renderCustomRow se mantiene igual) ...
    const renderCustomRow = (row: ProcessedRow) => {
        if (row.type === 'CARD_SUMMARY') {
            const isExpanded = expandedCardIds.has(row.cardId);
            return (
                <Fragment key={row.cardId}>
                    <tr onClick={() => toggleExpand(row.cardId)} className="hover:bg-gray-50 cursor-pointer group">
                        <td className="px-4 py-4 font-medium" colSpan={2}>
                            <div className="flex items-center">
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform mr-2 ${isExpanded ? 'rotate-180' : ''}`}/>
                                <span className="font-bold" style={{color: row.cardColor}}>
                                    {row.cardName}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">({row.childExpenses.length} gastos)</span>
                            </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td className="px-4 py-4 text-right font-semibold text-gray-900">
                            ${row.totalAmount.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                        </td>
                    </tr>
                    {isExpanded && row.childExpenses.map(expense => (
                        <ExpenseRow key={`${expense.place}-${expense.amount}-${Math.random()}`} expense={expense}
                                    columns={expenseColumns} isChild={true}/>
                    ))}
                </Fragment>
            );
        }
        if (row.type === 'STANDALONE_EXPENSE') {
            return <ExpenseRow key={`${row.expense.place}-${row.expense.amount}-${Math.random()}`} expense={row.expense}
                               columns={expenseColumns}/>;
        }
        return null;
    };


    return (
        <>
            {/* ✅ --- NAVEGACIÓN DE MES (RESTAURADA) --- */}
            <div className="mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={goToPreviousMonth}
                                disabled={currentMonthIndex === 0}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5"/>
                            </button>
                            <div className="text-center">
                                <div className="text-xl font-semibold text-gray-900">
                                    {expenseDetailsData.month}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {currentMonthIndex + 1} de {expensesData.length} meses
                                </div>
                            </div>
                            <button
                                onClick={goToNextMonth}
                                disabled={currentMonthIndex === expensesData.length - 1}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                                ${expenseDetailsData.totalCurrentMonth.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                            </div>
                            <div className="flex items-center justify-end space-x-1">
                                <VariationCell value={expenseDetailsData.totalVariation}/>
                                <span className="text-sm text-gray-500">vs mes anterior</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ --- WIDGETS DE RESUMEN (RESTAURADOS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Ingresos</h3>
                    <div className="text-3xl font-bold text-green-600">
                        ${totalIncome.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastos Fijos</h3>
                    <div className="text-3xl font-bold text-blue-600">
                        ${fixedExpenses.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastos Variables</h3>
                    <div className="text-3xl font-bold text-orange-600">
                        ${variableExpenses.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastos en Cuotas</h3>
                    <div className="text-3xl font-bold text-purple-600">
                        ${cuotasExpenses.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                </div>
            </div>

            {/* --- TABLA GENÉRICA CON RENDERIZADO CUSTOM --- */}
            <Table
                columns={headerColumns} // <-- Pasa las columnas del header
                data={processedRows}
                keyExtractor={(row: ProcessedRow) =>
                    row.type === 'CARD_SUMMARY' ? row.cardId : `${row.expense.place}-${row.expense.amount}-${Math.random()}`
                }
                renderRow={(row) => renderCustomRow(row as ProcessedRow)}
            />
        </>
    );
}

type ExpenseRowProps = {
    expense: ExpenseDetail;
    columns: Column<ExpenseDetail>[];
    isChild?: boolean;
};

function ExpenseRow({expense, columns, isChild = false}: ExpenseRowProps) {
    return (
        <tr className={isChild ? 'bg-purple-50/30 hover:bg-purple-50' : 'hover:bg-gray-50'}>
            {columns.map(col => {
                let value: unknown;
                if (typeof col.accessor === 'function') {
                    value = col.accessor(expense);
                } else {
                    value = (expense as unknown as Record<string, unknown>)[col.accessor as string];
                }

                return (
                    <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''} ${isChild && col.key === 'category' ? 'pl-12' : ''}`}
                    >
                        {isChild && col.key === 'category' && (
                            <span className="absolute left-6 w-5 h-5 border-l border-b border-gray-300 -mt-3"></span>
                        )}

                        {col.render
                            ? col.render(value, expense)
                            : (value !== null && value !== undefined ? String(value) : 'N/A')
                        }
                    </td>
                );
            })}
        </tr>
    );
}