'use client';

import {Bell, Calendar, Plus, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useMonth } from '@/components/NavigationWrapper/MonthContext';

interface HeaderActionsProps {
    // Función para abrir el modal (ahora es obligatorio pasarla)
    onOpenAddExpense: () => void;
    onOpenAddMonth: () => void;
    isDashboardRoute: boolean;
}

export default function HeaderActions({
                                          onOpenAddExpense,
                                          onOpenAddMonth,
                                          isDashboardRoute,
                                      }: HeaderActionsProps) {
    const router = useRouter();
    const { monthList, currentMonthIndex, setCurrentMonthIndex } = useMonth();

    const handleNavigateToDetalle = () => {
        router.push('/detalle');
    };

    return (
        <div className="w-full">
            {/* Top Section - User and Global Actions (Estructura de la primera barra) */}
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Selector de Mes Global */}
                <select
                    value={currentMonthIndex}
                    onChange={(e) => setCurrentMonthIndex(Number(e.target.value))}
                    className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-medium bg-white"
                    aria-label="Seleccionar mes"
                >
                    {monthList.map((mes, i) => (
                        <option key={mes.id} value={i}>
                            {mes.label}
                        </option>
                    ))}
                </select>
                {/* Otros iconos/botones (search, bell, avatar...) siguen igual */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Search className="w-5 h-5 text-gray-600"/>
                    </button>
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                        <Bell className="w-5 h-5 text-gray-600"/>
                        <span
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        3
                    </span>
                    </button>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs sm:text-sm font-medium">AL</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">Adaline Lively</p>
                            <p className="text-xs text-gray-500">adalineal@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Management and Action Buttons (Estructura de la segunda barra) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                    <button className="text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors px-2 py-1 rounded hover:bg-gray-50">
                        Gestionar widgets
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    {/* Botón "Ver Detalle" (Sigue siendo condicional a /dashboard) */}
                    {isDashboardRoute && (
                        <PrimaryButton iconLeft={<Plus />} onClick={handleNavigateToDetalle} className="">
                            Ver Detalle
                        </PrimaryButton>
                    )}
                    <PrimaryButton iconLeft={<Plus />} onClick={onOpenAddMonth} className="">
                        Agregar Mes
                    </PrimaryButton>
                    <PrimaryButton iconLeft={<Plus />} onClick={onOpenAddExpense} className="">
                        Agregar Gasto
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}