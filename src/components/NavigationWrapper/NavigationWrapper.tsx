// src/components/NavigationWrapper/NavigationWrapper.tsx

'use client';

import {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {AddExpenseForm, Header, Sidebar} from '@/components';
import {Card, ExpenseDetail} from '@/types/dashboard';
import {addExpense, addMonth} from "@/actions/expenses";
import AddMonthForm from "@/components/forms/AddMonthForm";
import {getAllCards} from "@/actions/banksAndCards";

interface NavigationWrapperProps {
    children: React.ReactNode;
    initialCards: Card[];
}

// Lógica centralizada para determinar el título y contexto de la página
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

export default function NavigationWrapper({children,initialCards}: NavigationWrapperProps) {
    const pathname = usePathname();
    const {title, subtitle, isDashboardRoute} = getPageContext(pathname);
    const router = useRouter();

    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddMonth, setShowAddMonth] = useState(false);


    // Handler para la simulación de Server Action
    const handleAddExpense = async (expense: ExpenseDetail) => {
        // 💡 Aquí se llamaría a la Server Action (ej. createExpense(expense))
        await addExpense(expense);
        setShowAddExpense(false);
        router.refresh()
    };

    const handleAddMonth = async (month: string, totalIncome: number) => {
        await addMonth(month, totalIncome)
        setShowAddMonth(false)
        router.refresh()

    }

    return (
        <>
            {/* 1. Sidebar (SC) - Usa el path del cliente para el link activo */}
            <Sidebar currentPath={pathname}/>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 2. Header (SC) - Recibe los datos y handlers del wrapper */}
                <Header
                    title={title}
                    subtitle={subtitle}
                    onOpenAddMonth={() => setShowAddMonth(true)}
                    onOpenAddExpense={() => setShowAddExpense(true)}
                    isDashboardRoute={isDashboardRoute}
                />
                <main className="flex-1 overflow-y-auto p-6">
                    {children} {/* Contenido de la página actual */}
                </main>
            </div>

            {showAddMonth && (
                <AddMonthForm
                    onClose={() => setShowAddMonth(false)}
                    onAddMonth={handleAddMonth} // Pasa el handler de mutación
                />
            )}

            {/* 3. Modal (Gestionado por el wrapper) */}
            {showAddExpense && (
                <AddExpenseForm
                    onClose={() => setShowAddExpense(false)}
                    onAddExpense={handleAddExpense} // Pasa el handler de mutación
                    cards={initialCards}
                />
            )}
        </>
    );
}