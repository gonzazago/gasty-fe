// src/app/(dashboard)/layout.tsx

import NavigationWrapper from '@/components/NavigationWrapper/NavigationWrapper';
import {getAllCards} from "@/actions/banksAndCards";

// Este componente es Server Component
export default async function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const cards = await getAllCards();
    return (
        <div className="flex h-screen bg-gray-50">
            {/* NavigationWrapper se encarga del Sidebar, Header y la lógica de estado/hooks */}
            <NavigationWrapper initialCards={cards}>
                {children}
            </NavigationWrapper>
        </div>
    );
}