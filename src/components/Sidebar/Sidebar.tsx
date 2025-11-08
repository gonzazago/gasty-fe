'use client';

import {
    LayoutDashboard,
    Table,
    Building2,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Panel', href: '/dashboard' },
    { icon: Table, label: 'Detalle', href: '/detalle' },
    { icon: Building2, label: 'Bancos', href: '/banks' },
];

interface SidebarProps {
    currentPath: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ currentPath, isOpen, onClose }: SidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Cerrar sidebar al hacer click fuera (solo en móvil)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                // Solo cerrar en móvil (cuando el sidebar es fixed y hay overlay)
                if (window.innerWidth < 640) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Cerrar sidebar al hacer click en un link (solo en móvil)
    const handleLinkClick = () => {
        // Solo cerrar en móvil
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            setTimeout(() => {
                onClose();
            }, 100);
        }
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`
                    fixed sm:fixed
                    top-0 left-0
                    w-64 bg-gray-900 text-white h-screen flex flex-col z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    sm:z-40 flex-shrink-0
                `}
            >
                {/* Header con botón de cerrar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold">Menú</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Cerrar menú"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                                    currentPath.startsWith(item.href) 
                                        ? 'bg-purple-600 text-white' 
                                        : 'hover:bg-gray-800 text-gray-300'
                                }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
}