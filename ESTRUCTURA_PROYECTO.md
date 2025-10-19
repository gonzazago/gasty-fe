# Estructura del Proyecto Gasty Dashboard

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── (gasty)/
│   │   ├── layout.tsx          # Layout específico para el dashboard
│   │   └── page.tsx            # Página principal del dashboard
│   ├── globals.css             # Estilos globales
│   └── layout.tsx             # Layout raíz
├── components/
│   ├── Sidebar.tsx             # Barra lateral de navegación
│   ├── Header.tsx              # Encabezado del dashboard
│   ├── MetricCard.tsx          # Tarjeta de métricas (ingresos, gastos, resto)
│   ├── BalanceChart.tsx        # Gráfico de balance temporal
│   ├── ExpenseChart.tsx        # Gráfico de gastos por tipo (pie chart)
│   └── MonthlyExpenseChart.tsx # Gráfico de gastos mensuales vs presupuesto
├── data/
│   └── mockData.ts             # Datos de ejemplo para el dashboard
├── types/
│   └── dashboard.ts            # Interfaces TypeScript
└── interfaces/                 # Interfaces adicionales (si es necesario)
```

## 🎯 Componentes Principales

### 1. **Sidebar** (`components/Sidebar.tsx`)
- Navegación principal del dashboard
- Logo de la aplicación
- Menú de navegación (Dashboard, Transactions, Wallet, Goals, Budget)
- Sección de Analytics (activa)
- Utilidades (Settings, Help, Log out)
- Toggle de tema (Light/Dark)

### 2. **Header** (`components/Header.tsx`)
- Título y descripción del dashboard
- Filtro de fecha ("This month")
- Iconos de búsqueda y notificaciones
- Perfil de usuario
- Botones de gestión de widgets

### 3. **MetricCard** (`components/MetricCard.tsx`)
- Tarjetas de métricas principales:
  - **Total Ingresos**: $8,500.00
  - **Total Gastos**: $6,222.00  
  - **Resto**: $2,278.00
- Indicadores de cambio porcentual
- Número de transacciones y categorías

### 4. **BalanceChart** (`components/BalanceChart.tsx`)
- Gráfico de área mostrando el balance total
- Comparación entre mes actual y mes anterior
- Datos de los últimos 19 días

### 5. **ExpenseChart** (`components/ExpenseChart.tsx`)
- Gráfico de dona (pie chart) de gastos por tipo
- Distribución de gastos por categoría:
  - Money transfer (40%)
  - Cafe & Restaurants (19%)
  - Rent (16%)
  - Education (13%)
  - Food & Groceries (8%)
  - Others (4%)

### 6. **MonthlyExpenseChart** (`components/MonthlyExpenseChart.tsx`)
- Gráfico de barras comparando gastos vs presupuesto
- Datos de los últimos 7 meses
- Visualización de excesos presupuestarios

## 📊 Datos del Dashboard

### Métricas Principales
- **Total Ingresos**: $8,500.00 (+6.3%)
- **Total Gastos**: $6,222.00 (+2.4%)
- **Resto**: $2,278.00 (+12.1%)

### Gráficos
1. **Balance Overview**: Evolución del balance en los últimos 19 días
2. **Expense Distribution**: Distribución de gastos por categoría
3. **Budget vs Expense**: Comparación mensual de gastos vs presupuesto

## 🎨 Diseño y Estilos

- **Framework**: Next.js 15 con App Router
- **Styling**: Tailwind CSS
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Tema**: Colores púrpura (#9333ea) y grises
- **Layout**: Sidebar fijo + contenido principal responsive

## 🚀 Funcionalidades

1. **Dashboard Responsive**: Adaptable a diferentes tamaños de pantalla
2. **Gráficos Interactivos**: Tooltips y leyendas en los gráficos
3. **Navegación**: Sidebar con menú de navegación
4. **Métricas en Tiempo Real**: Tarjetas con indicadores de cambio
5. **Comparaciones**: Balance actual vs anterior, gastos vs presupuesto

## 📱 Responsive Design

- **Mobile**: Layout de una columna
- **Tablet**: Layout de dos columnas para gráficos
- **Desktop**: Layout completo con sidebar fijo

## 🔧 Configuración

Para ejecutar el proyecto:

```bash
npm install
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`
