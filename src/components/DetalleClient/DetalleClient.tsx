'use client';

import { useState, useEffect } from 'react';
import { GenericTable, VariationCell, InstallmentsCell, FixedCell, AddExpenseForm, type Column } from '@/components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ExpenseDetail, ExpenseDataDetail } from '@/types/dashboard';

interface DetalleClientProps {
  initialData: ExpenseDataDetail[];
}

export default function DetalleClient({ initialData }: DetalleClientProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // Empezar en Noviembre 2024
  const [showAddForm, setShowAddForm] = useState(false);
  const [expensesData, setExpensesData] = useState<ExpenseDataDetail[]>(initialData);
  const expenseDetailsData = expensesData[currentMonthIndex] || expensesData[1];
  
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

  const handleAddExpense = (expense: ExpenseDetail) => {
    setExpensesData(prevData => {
      const updatedData = [...prevData];
      if (updatedData[currentMonthIndex]) {
        updatedData[currentMonthIndex] = {
          ...updatedData[currentMonthIndex],
          expenses: [...updatedData[currentMonthIndex].expenses, expense]
        };
        
        // Recalcular totales
        const totalCurrentMonth = updatedData[currentMonthIndex].expenses.reduce((sum, expense) => sum + expense.amount, 0);
        updatedData[currentMonthIndex] = {
          ...updatedData[currentMonthIndex],
          totalCurrentMonth
        };
      }
      return updatedData;
    });
  };

  useEffect(() => {
    const handleOpenForm = () => {
      setShowAddForm(true);
    };

    window.addEventListener('openAddExpenseForm', handleOpenForm);
    return () => {
      window.removeEventListener('openAddExpenseForm', handleOpenForm);
    };
  }, []);

  // Definir las columnas de la tabla
  const columns: Column<ExpenseDetail>[] = [
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
      render: (value: unknown) => <FixedCell fixed={value as boolean} />
    },
    {
      key: 'split',
      header: 'Cuotas',
      accessor: 'split',
      render: (value: unknown) => <InstallmentsCell split={value as { current: number; total: number; lefts: number } | null} />
    },
    {
      key: 'totalInstallments',
      header: 'Cuotas Totales',
      accessor: (item: ExpenseDetail) => item.split ? item.split.total : '-',
      className: 'text-center'
    },
    {
      key: 'remainingInstallments',
      header: 'Cuotas Restantes',
      accessor: (item: ExpenseDetail) => item.split ? item.split.lefts : '-',
      className: 'text-center'
    },
    {
      key: 'variation',
      header: 'Variación',
      accessor: 'variation',
      render: (value: unknown) => <VariationCell value={value as number} />
    },
    {
      key: 'amount',
      header: 'Monto',
      accessor: 'amount',
      render: (value: unknown) => (
        <span className="font-semibold text-gray-900">
          ${(value as number).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      ),
      className: 'text-right'
    }
  ];

  // Calcular totales
  const fixedExpenses = expenseDetailsData.expenses.filter(e => e.fixed).reduce((sum, expense) => sum + expense.amount, 0);
  const variableExpenses = expenseDetailsData.expenses.filter(e => !e.fixed).reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      {/* Navegación entre meses */}
      <div className="mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousMonth}
                disabled={currentMonthIndex === 0}
                className={`p-2 rounded-lg border ${
                  currentMonthIndex === 0
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
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
                className={`p-2 rounded-lg border ${
                  currentMonthIndex === expensesData.length - 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${expenseDetailsData.totalCurrentMonth.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-end space-x-1">
                <VariationCell value={expenseDetailsData.totalVariation} />
                <span className="text-sm text-gray-500">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen por categorías */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastos Fijos</h3>
          <div className="text-3xl font-bold text-blue-600">
            ${fixedExpenses.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {expenseDetailsData.expenses.filter(e => e.fixed).length} gastos
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastos Variables</h3>
          <div className="text-3xl font-bold text-orange-600">
            ${variableExpenses.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {expenseDetailsData.expenses.filter(e => !e.fixed).length} gastos
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastos en Cuotas</h3>
          <div className="text-3xl font-bold text-purple-600">
            ${expenseDetailsData.expenses
              .filter(e => e.split !== null)
              .reduce((sum, expense) => sum + expense.amount, 0)
              .toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {expenseDetailsData.expenses.filter(e => e.split !== null).length} gastos
          </div>
        </div>
      </div>

      {/* Tabla de gastos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Gastos</h2>
        </div>
        <div className="p-6">
          <GenericTable
            columns={columns}
            data={expenseDetailsData.expenses}
            className="min-w-full"
          />
        </div>
      </div>

      {/* Modal de agregar gasto */}
      {showAddForm && (
        <AddExpenseForm
          onClose={() => setShowAddForm(false)}
          onAddExpense={handleAddExpense}
        />
      )}
    </>
  );
}
