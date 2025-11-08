import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MonthEntry {
  id: string;
  label: string;
}

interface MonthContextProps {
  currentMonthIndex: number;
  setCurrentMonthIndex: (idx: number) => void;
  monthList: MonthEntry[];
}

const MonthContext = createContext<MonthContextProps | undefined>(undefined);

export function useMonth() {
  const ctx = useContext(MonthContext);
  if (!ctx) throw new Error('useMonth debe usarse dentro de MonthProvider');
  return ctx;
}

interface MonthProviderProps {
  children: ReactNode;
  monthList: MonthEntry[];
  initialIndex?: number;
}

export function MonthProvider({ children, monthList, initialIndex = 0 }: MonthProviderProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialIndex);

  return (
    <MonthContext.Provider value={{ currentMonthIndex, setCurrentMonthIndex, monthList }}>
      {children}
    </MonthContext.Provider>
  );
}
