
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchKlineData, type KlineData } from '@/lib/bybit-api';
import { calculateIndicators } from '@/ai/flows/indicator-calculator';
import { useSymbol } from '@/contexts/symbol-context';
import type { OrderBookData } from '@/lib/bybit-api';
import type { SupportResistanceOutput } from '@/ai/flows/support-resistance-analyzer';

export type ChartData = Awaited<ReturnType<typeof calculateIndicators>>['data'];

interface MarketDataContextType {
  chartData: ChartData | null;
  orderBookData: OrderBookData | null;
  supportResistance: SupportResistanceOutput | null;
  isLoadingChart: boolean;
  timeframe: string;
  setTimeframe: React.Dispatch<React.SetStateAction<string>>;
  setOrderBookData: React.Dispatch<React.SetStateAction<OrderBookData | null>>;
  setSupportResistance: React.Dispatch<React.SetStateAction<SupportResistanceOutput | null>>;
}

const MarketDataContext = React.createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const { symbol } = useSymbol();
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [orderBookData, setOrderBookData] = React.useState<OrderBookData | null>(null);
  const [supportResistance, setSupportResistance] = React.useState<SupportResistanceOutput | null>(null);
  const [isLoadingChart, setIsLoadingChart] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState('1D');
  const { toast } = useToast();

  const fetchChartData = React.useCallback(async (tf: string, currentSymbol: string) => {
    setIsLoadingChart(true);
    setChartData(null);
    setSupportResistance(null);
    try {
      const intervalMap: { [key: string]: string } = {
        '1H': '60',
        '4H': '240',
        '1D': 'D',
        '1W': 'W',
      };
      const bybitInterval = intervalMap[tf];
      const rawKlineData = await fetchKlineData({ symbol: currentSymbol, interval: bybitInterval, limit: 100 });

      if (rawKlineData.length === 0) {
        setChartData([]);
        return;
      }

      const prices = rawKlineData.map(d => d.close);
      const indicatorData = await calculateIndicators({ prices });

      setChartData(indicatorData.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast({
        variant: 'destructive',
        title: 'Chart Error',
        description: 'Could not load chart data. The symbol may not be supported.',
      });
      setChartData([]);
    } finally {
      setIsLoadingChart(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (symbol) {
      fetchChartData(timeframe, symbol);
    }
  }, [fetchChartData, timeframe, symbol]);

  const value = {
    chartData,
    orderBookData,
    supportResistance,
    isLoadingChart,
    timeframe,
    setTimeframe,
    setOrderBookData,
    setSupportResistance,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = React.useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}
