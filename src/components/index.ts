// Layout Components
export { default as Sidebar } from './Sidebar';
export { default as Header } from './Header';
export {default as Navigation} from './NavigationWrapper';

// Chart Components
export { default as BalanceChart } from './BalanceChart';
export { default as ExpenseChart } from './ExpenseChart';
export { default as MonthlyExpenseChart } from './MonthlyExpenseChart';
export { default as InstallmentEvolutionChart } from './InstallmentEvolutionChart';

// Card Components
export { default as MetricCard } from './MetricCard';

// Table Components
export * from './Table'; // Esto ahora importa desde './Table/index.ts'

// Page Components
export { default as DetalleClient } from './DetalleClient';

// Manager Components
export { default as BanksAndCardsManager } from './BanksAndCardsManager';

// Forms
export * from './forms';
