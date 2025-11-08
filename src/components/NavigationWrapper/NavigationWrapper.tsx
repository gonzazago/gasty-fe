// src/components/NavigationWrapper/NavigationWrapper.tsx
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AddExpenseForm, Header, Sidebar } from '@/components';
import { Card, ExpenseDataDetail } from '@/types/dashboard';
import { addMonth } from "@/actions/expenses";
import AddMonthForm from "@/components/forms/AddMonthForm";
import { MonthProvider } from './MonthContext';

interface NavigationWrapperProps {
    children: React.ReactNode;
    initialCards: Card[];
    initialMonths: ExpenseDataDetail[]; // 1. Recibe los datos completos
}

// ... (la función getPageContext se mantiene igual)
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


export default function NavigationWrapper({
                                              children,
                                              initialCards,
                                              initialMonths // Array completo desde el layout
                                          }: NavigationWrapperProps) {
    const pathname = usePathname();
    const { title, subtitle, isDashboardRoute } = getPageContext(pathname);
    const router = useRouter();

    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddMonth, setShowAddMonth] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 2. Crea una lista optimizada solo con lo que el dropdown necesita
    const monthListForDropdown = initialMonths.map(month => ({
        id: month.id,
        label: month.month // ej: "Noviembre 2024"
    }));
    const initialIndex = initialMonths.length > 0 ? initialMonths.length - 1 : 0;


    // 3. Handler para 'addMonth' (firma actualizada)
    const handleAddMonth = async (monthIndex: number, year: number, totalIncome: number) => {
        await addMonth(monthIndex, year, totalIncome);
        router.refresh();
        setShowAddMonth(false);
    };

    return (
        <MonthProvider monthList={monthListForDropdown} initialIndex={initialIndex}>
            <div className="flex h-screen bg-gray-50 relative overflow-hidden">
                <Sidebar
                    currentPath={pathname}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    isSidebarOpen ? 'sm:ml-64' : 'sm:ml-0'
                }`}>
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

                {/* Modal de Mes (usa el handler actualizado) */}
                {showAddMonth && (
                    <AddMonthForm
                        onClose={() => setShowAddMonth(false)}
                        onAddMonth={handleAddMonth}
                    />
                )}

                {/* Modal de Gasto (usa la lista optimizada) */}
                {showAddExpense && (
                    <AddExpenseForm
                        onClose={() => setShowAddExpense(false)}
                        cards={initialCards}
                        months={monthListForDropdown}
                    />
                )}
            </div>
        </MonthProvider>
    );
}