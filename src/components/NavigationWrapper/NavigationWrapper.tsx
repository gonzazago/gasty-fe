// src/components/NavigationWrapper/NavigationWrapper.tsx
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AddExpenseForm, Header, Sidebar } from '@/components';
import { Card, ExpenseDataDetail, ExpenseDetail } from '@/types/dashboard';
import { addExpense, addMonth } from "@/actions/expenses";
import AddMonthForm from "@/components/forms/AddMonthForm";

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

    // 2. Crea una lista optimizada solo con lo que el dropdown necesita
    const monthListForDropdown = initialMonths.map(month => ({
        id: month.id,
        month: month.month // El string 'month' (ej: "Noviembre 2024")
    }));

    // Handler para 'addExpense' (firma ya correcta)
    const handleAddExpense = async (monthId: string, expense: ExpenseDetail) => {
        await addExpense(monthId, expense);
        router.refresh();
        setShowAddExpense(false);
    };

    // 3. Handler para 'addMonth' (firma actualizada)
    const handleAddMonth = async (monthIndex: number, year: number, totalIncome: number) => {
        await addMonth(monthIndex, year, totalIncome);
        router.refresh();
        setShowAddMonth(false);
    };

    return (
        <>
            <Sidebar currentPath={pathname} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title={title}
                    subtitle={subtitle}
                    onOpenAddMonth={() => setShowAddMonth(true)}
                    onOpenAddExpense={() => setShowAddExpense(true)}
                    isDashboardRoute={isDashboardRoute}
                />
                <main className="flex-1 overflow-y-auto p-6">
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
                    months={monthListForDropdown} // 4. Pasa la lista correcta
                />
            )}
        </>
    );
}