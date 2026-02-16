// src/app/(dashboard)/layout.tsx

import NavigationWrapper from '@/components/NavigationWrapper/NavigationWrapper';
import {getAllCards, getAllBanks} from "@/actions/banksAndCards";
import {getExpenseDetailsByMonth} from "@/actions/expenses";

// Este componente es Server Component
export default async function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const [cards, monthData, banks] = await Promise.all([getAllCards(), getExpenseDetailsByMonth(), getAllBanks()]);
    return (
        <div className="h-screen bg-gray-50">
            {/* NavigationWrapper se encarga del Sidebar, Header y la lógica de estado/hooks */}
            <NavigationWrapper initialCards={cards} initialMonths={monthData} initialBanks={banks}>
                {children}
            </NavigationWrapper>
        </div>
    );
}