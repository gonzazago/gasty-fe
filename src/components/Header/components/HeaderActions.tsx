'use client';

import { Search, Bell, Calendar, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderActionsProps {
    // Función para abrir el modal (ahora es obligatorio pasarla)
    onOpenAddExpense: () => void;
    isDashboardRoute: boolean;
}

export default function HeaderActions({
                                          onOpenAddExpense,
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
            <div className="flex items-center justify-end space-x-4 mb-4">
                <button
                    onClick={handleThisMonth}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <Calendar className="w-4 h-4" />
                    <span>Este mes</span>
                </button>

                <div className="flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        3
                    </span>
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">AL</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Adaline Lively</p>
                            <p className="text-xs text-gray-500">adalineal@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Management and Action Buttons (Estructura de la segunda barra) */}
            <div className="flex items-center justify-between">
                <button className="text-gray-600 hover:text-gray-900">
                    Gestionar widgets
                </button>

                <div className="flex items-center space-x-2">
                    {/* Botón "Ver Detalle" (Sigue siendo condicional a /dashboard) */}
                    {isDashboardRoute && (
                        <button
                            onClick={handleNavigateToDetalle}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Ver Detalle</span>
                        </button>
                    )}

                    {/* BOTÓN AGREGAR GASTO (AHORA SIEMPRE VISIBLE) */}
                    <button
                        onClick={onOpenAddExpense}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Gasto</span>
                    </button>
                </div>
            </div>
        </div>
    );
}