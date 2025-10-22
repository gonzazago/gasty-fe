import {
    LayoutDashboard,
    Table,
    Building2,
    PieChart,
    // ... (otros iconos)
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
    { icon: LayoutDashboard, label: 'Panel', href: '/dashboard' },
    { icon: Table, label: 'Detalle', href: '/detalle' },
    { icon: Building2, label: 'Bancos', href: '/banks' },
];

interface SidebarProps {
    currentPath: string; // Recibe el path como prop
}

// 💡 NO TIENE 'use client'
export default function Sidebar({ currentPath }: SidebarProps) {

    return (
        <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                currentPath.startsWith(item.href) ? 'bg-purple-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}