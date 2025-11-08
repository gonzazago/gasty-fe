'use client';

import {Bell, Calendar, Plus, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';

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

    const handleNavigateToDetalle = () => {
        router.push('/detalle');
    };

    const handleThisMonth = () => {
        console.log("Navegación 'Este mes' triggered");
    };

    return (
        <div className="w-full">
            {/* Top Section - User and Global Actions (Estructura de la primera barra) */}
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                    onClick={handleThisMonth}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                    <Calendar className="w-4 h-4"/>
                    <span className="whitespace-nowrap">Este mes</span>
                </button>

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
                        <button
                            onClick={handleNavigateToDetalle}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-800 flex items-center space-x-2 transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4"/>
                            <span>Ver Detalle</span>
                        </button>
                    )}

                    <button
                        onClick={onOpenAddMonth}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-800 flex items-center space-x-2 transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4"/>
                        <span>Agregar Mes</span>
                    </button>

                    {/* BOTÓN AGREGAR GASTO (AHORA SIEMPRE VISIBLE) */}
                    <button
                        onClick={onOpenAddExpense}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-800 flex items-center space-x-2 transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4"/>
                        <span>Agregar Gasto</span>
                    </button>
                </div>
            </div>
        </div>
    );
}