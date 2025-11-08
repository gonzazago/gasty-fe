import HeaderActions from "@/components/Header/components/HeaderActions";
import { Menu } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle: string;
    onOpenAddExpense: () => void;
    onOpenAddMonth: () => void;
    isDashboardRoute: boolean;
    onToggleSidebar: () => void;
}

export default function Header({title, subtitle, onOpenAddExpense, onOpenAddMonth, isDashboardRoute, onToggleSidebar}: HeaderProps) {

    return (
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
            {/* Top Header - Títulos estáticos */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Botón de menú (visible en móvil y desktop) */}
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Abrir/cerrar menú"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
                    </div>
                </div>

                {/* HeaderActions - Componente de Cliente */}
                <HeaderActions
                    onOpenAddExpense={onOpenAddExpense}
                    onOpenAddMonth={onOpenAddMonth}
                    isDashboardRoute={isDashboardRoute}
                />

            </div>
        </div>
    );
}