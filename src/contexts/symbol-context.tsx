'use client';

import * as React from 'react';

type SymbolContextType = {
  symbol: string;
  setSymbol: (symbol: string) => void;
};

const SymbolContext = React.createContext<SymbolContextType | undefined>(undefined);

export function SymbolProvider({ children }: { children: React.ReactNode }) {
  const [symbol, setSymbol] = React.useState('BTCUSDT');

  return (
    <SymbolContext.Provider value={{ symbol, setSymbol }}>
      {children}
    </SymbolContext.Provider>
  );
}

export function useSymbol() {
  const context = React.useContext(SymbolContext);
  if (context === undefined) {
    throw new Error('useSymbol must be used within a SymbolProvider');
  }
  return context;
}
