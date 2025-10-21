import {Sidebar, Header} from '@/components';

export default function DashboardLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header/>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}