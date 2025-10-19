'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  Table,
  Building2,
  Settings, 
  HelpCircle, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: LayoutDashboard, label: 'Panel', href: '/dashboard', active: false },
  { icon: Table, label: 'Detalle', href: '/detalle', active: false },
  { icon: Building2, label: 'Bancos', href: '/banks', active: false },
  // { icon: CreditCard, label: 'Préstamos', href: '/prestamos', active: false }, // Futuro
];

const utilityItems = [
  { icon: Settings, label: 'Configuración', active: false },
  { icon: HelpCircle, label: 'Ayuda', active: false },
  { icon: LogOut, label: 'Cerrar sesión', active: false },
];

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-bold">Gasty</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active ? 'bg-purple-600' : 'hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Analytics - Active */}
        <div className="mt-6">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-purple-600 cursor-pointer">
            <PieChart className="w-5 h-5" />
            <span className="text-sm">Análisis</span>
          </div>
        </div>

        {/* Utilities */}
        <div className="mt-8 space-y-2">
          {utilityItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4" />
            <span className="text-sm">Claro</span>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4" />
            <span className="text-sm">Oscuro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
