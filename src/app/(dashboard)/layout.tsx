// src/app/(dashboard)/layout.tsx

import NavigationWrapper from '@/components/NavigationWrapper/NavigationWrapper';

// Este componente es Server Component
export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* NavigationWrapper se encarga del Sidebar, Header y la lógica de estado/hooks */}
            <NavigationWrapper>
                {children}
            </NavigationWrapper>
        </div>
    );
}