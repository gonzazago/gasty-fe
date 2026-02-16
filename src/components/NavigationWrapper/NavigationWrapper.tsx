// src/components/NavigationWrapper/NavigationWrapper.tsx
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AddExpenseForm, Header, Sidebar } from '@/components';
import { Bank, Card, ExpenseDataDetail } from '@/types/dashboard';
import { addExpense, addMonth } from "@/actions/expenses";
import AddMonthForm from "@/components/forms/AddMonthForm";
import { MonthProvider, useMonth } from './MonthContext';

interface NavigationWrapperProps {
    children: React.ReactNode;
    initialCards: Card[];
    initialBanks: Bank[];
    initialMonths: ExpenseDataDetail[];
}

interface DashboardContentProps {
    children: React.ReactNode;
    initialCards: Card[];
    initialBanks: Bank[];
    initialMonths: ExpenseDataDetail[];
}

const getPageContext = (path: string) => {
    const context = {title: 'Panel', subtitle: 'Bienvenido', isDashboardRoute: false};

    if (path.startsWith('/dashboard')) {
        context.title = 'Análisis';
        context.subtitle = 'Vista detallada de tu situación financiera';
        context.isDashboardRoute = true;
    } else if (path.startsWith('/detalle')) {
        context.title = 'Detalle de Gastos';
        context.subtitle = 'Análisis y desglose de gastos mensuales';
        context.isDashboardRoute = false;
    } else if (path.startsWith('/banks')) {
        context.title = 'Bancos y Tarjetas';
        context.subtitle = 'Gestiona tus cuentas y plásticos';
        context.isDashboardRoute = false;
    }
    return context;
};

function DashboardContent({ children, initialCards, initialBanks, initialMonths }: DashboardContentProps) {
    const pathname = usePathname();
    const { title, subtitle, isDashboardRoute } = getPageContext(pathname);
    const router = useRouter();

    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddMonth, setShowAddMonth] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { currentMonthIndex } = useMonth();

    const handleAddMonth = async (monthIndex: number, year: number, totalIncome: number) => {
        await addMonth(monthIndex, year, totalIncome);
        router.refresh();
        setShowAddMonth(false);
    };

    const handleAddExpense = async (expenseData: any) => {
        const date = new Date(expenseData.date);
        const monthId = `month-${date.getMonth() + 1}-${date.getFullYear()}`;

        const expenseDetail: any = {
            category: expenseData.category,
            place: expenseData.description,
            amount: expenseData.amount,
            date: expenseData.date,
            fixed: expenseData.fixed,
            split: null,
            cardId: expenseData.bankOrCardId,
        };

        if (expenseData.hasInstallments) {
            expenseDetail.split = {
                current: 1,
                total: expenseData.installments,
                lefts: expenseData.installments - 1,
            }
            expenseDetail.amount = expenseData.installmentAmount;
        }

        await addExpense(monthId, expenseDetail);
        router.refresh();
        setShowAddExpense(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 relative overflow-hidden">
            <Sidebar
                currentPath={pathname}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-0'}`}>
                <Header
                    title={title}
                    subtitle={subtitle}
                    onOpenAddMonth={() => setShowAddMonth(true)}
                    onOpenAddExpense={() => setShowAddExpense(true)}
                    isDashboardRoute={isDashboardRoute}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
                    {children}
                </main>
            </div>

            {showAddMonth && (
                <AddMonthForm
                    onClose={() => setShowAddMonth(false)}
                    onAddMonth={handleAddMonth}
                />
            )}

            {showAddExpense && (
                <AddExpenseForm
                    onClose={() => setShowAddExpense(false)}
                    onAddExpense={handleAddExpense}
                    cards={initialCards}
                    banks={initialBanks}
                />
            )}
        </div>
    );
}

export default function NavigationWrapper({ children, initialCards, initialBanks, initialMonths }: NavigationWrapperProps) {
    const monthListForDropdown = initialMonths.map(month => ({
        id: month.id,
        label: month.month
    }));
    const initialIndex = initialMonths.length > 0 ? initialMonths.length - 1 : 0;

    return (
        <MonthProvider monthList={monthListForDropdown} initialIndex={initialIndex}>
            <DashboardContent initialCards={initialCards} initialBanks={initialBanks} initialMonths={initialMonths}>
                {children}
            </DashboardContent>
        </MonthProvider>
    );
}