'use client';

import { Search, Bell, Calendar, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return { title: 'Análisis', subtitle: 'Vista detallada de tu situación financiera' };
      case '/detalle':
        return { title: 'Gasty', subtitle: 'Dashboard Financiero' };
      default:
        return { title: 'Análisis', subtitle: 'Vista detallada de tu situación financiera' };
    }
  };

  const { title, subtitle } = getPageTitle();

  const handleAddWidget = () => {
    router.push('/detalle');
  };

  const handleThisMonth = () => {
    router.push('/detalle');
  };

  const handleAddExpense = () => {
    // Este evento será manejado por el componente padre
    const event = new CustomEvent('openAddExpenseForm');
    window.dispatchEvent(event);
  };
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleThisMonth}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4" />
            <span>Este mes</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AL</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Adaline Lively</p>
                <p className="text-xs text-gray-500">adalineal@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Management */}
      <div className="flex items-center justify-between">
        <button className="text-gray-600 hover:text-gray-900">
          Gestionar widgets
        </button>
        {pathname === '/dashboard' && (
          <button 
            onClick={handleAddWidget}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ver Detalle</span>
          </button>
        )}
        {pathname === '/detalle' && (
          <button 
            onClick={handleAddExpense}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Gasto</span>
          </button>
        )}
      </div>
    </div>
  );
}
