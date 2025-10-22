import HeaderActions from "@/components/Header/components/HeaderActions";

interface HeaderProps {
    title: string;
    subtitle: string;
    onOpenAddExpense: () => void;
    isDashboardRoute: boolean;
}

// 💡 NO TIENE 'use client'
export default function Header({ title, subtitle, onOpenAddExpense, isDashboardRoute }: HeaderProps) {

    return (
        <div className="bg-white border-b border-gray-200 p-6">
            {/* Top Header - Títulos estáticos */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600">{subtitle}</p>
                </div>

                {/* HeaderActions - Componente de Cliente */}
                <HeaderActions
                    onOpenAddExpense={onOpenAddExpense}
                    isDashboardRoute={isDashboardRoute}
                />

            </div>
        </div>
    );
}