// src/app/(dashboard)/layout.tsx

import NavigationWrapper from '@/components/NavigationWrapper/NavigationWrapper';
import {getAllCards} from "@/actions/banksAndCards";
import {getExpenseDetailsByMonth} from "@/actions/expenses";

// Este componente es Server Component
export default async function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const [cards, monthData] = await Promise.all([getAllCards(),getExpenseDetailsByMonth()]);
    console.log(cards)
    return (
        <div className="flex h-screen bg-gray-50">
            {/* NavigationWrapper se encarga del Sidebar, Header y la lógica de estado/hooks */}
            <NavigationWrapper initialCards={cards} initialMonths={monthData} >
                {children}
            </NavigationWrapper>
        </div>
    );
}