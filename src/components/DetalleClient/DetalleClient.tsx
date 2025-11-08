// src/components/DetalleClient/DetalleClient.tsx
'use client';

import {Fragment, useEffect, useMemo, useState} from 'react';
import {type Column, FixedCell, InstallmentCell, Table, VariationCell} from '@/components';
import {ChevronDown, ChevronLeft, ChevronRight, TrendingUp, DollarSign, CreditCard, ShoppingCart, Calendar} from 'lucide-react';
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
        <div className="flex flex-col min-w-0 w-full">
            {/* ✅ --- NAVEGACIÓN DE MES MEJORADA --- */}
            <div className="mb-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <button
                                onClick={goToPreviousMonth}
                                disabled={currentMonthIndex === 0}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                                aria-label="Mes anterior"
                            >
                                <ChevronLeft className="w-5 h-5"/>
                            </button>
                            <div className="text-center flex-1 sm:flex-initial">
                                <div className="text-lg sm:text-xl font-bold text-gray-900">
                                    {expenseDetailsData.month}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    {currentMonthIndex + 1} de {expensesData.length} meses
                                </div>
                            </div>
                            <button
                                onClick={goToNextMonth}
                                disabled={currentMonthIndex === expensesData.length - 1}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                                aria-label="Mes siguiente"
                            >
                                <ChevronRight className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                ${expenseDetailsData.totalCurrentMonth.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                            </div>
                            <div className="flex items-center sm:justify-end space-x-1">
                                <VariationCell value={expenseDetailsData.totalVariation}/>
                                <span className="text-xs sm:text-sm text-gray-500">vs mes anterior</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ --- WIDGETS DE RESUMEN MEJORADOS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {/* Widget Total Ingresos */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 shadow-sm border border-green-100 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            Ingresos
                        </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Total Ingresos</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                        ${totalIncome.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                    {totalIncome > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {Math.max(0, ((totalIncome - expenseDetailsData.totalCurrentMonth) / totalIncome * 100)).toFixed(1)}% disponible
                        </p>
                    )}
                </div>

                {/* Widget Gastos Fijos */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 sm:p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                            Fijos
                        </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Gastos Fijos</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                        ${fixedExpenses.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                    {totalIncome > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {((fixedExpenses / totalIncome) * 100).toFixed(1)}% del total
                        </p>
                    )}
                </div>

                {/* Widget Gastos Variables */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 sm:p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                            Variables
                        </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Gastos Variables</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                        ${variableExpenses.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                    {totalIncome > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {((variableExpenses / totalIncome) * 100).toFixed(1)}% del total
                        </p>
                    )}
                </div>

                {/* Widget Gastos en Cuotas */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 sm:p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                            Cuotas
                        </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Gastos en Cuotas</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                        ${cuotasExpenses.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </div>
                    {totalIncome > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {((cuotasExpenses / totalIncome) * 100).toFixed(1)}% del total
                        </p>
                    )}
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
        </div>
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