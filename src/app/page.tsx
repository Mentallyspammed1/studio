'use client';

import * as React from 'react';
import {
  GanttChartSquare,
  LayoutDashboard,
  Newspaper,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { Header } from '@/components/dashboard/header';
import { MainChart } from '@/components/dashboard/main-chart';
import { PerformanceCards } from '@/components/dashboard/performance-cards';
import { StrategyAdvisor } from '@/components/dashboard/strategy-advisor';
import { NewsSentiment } from '@/components/dashboard/news-sentiment';
import { TradeHistory } from '@/components/dashboard/trade-history';
import { PositionManager } from '@/components/dashboard/position-manager';
import { RiskAssessment } from '@/components/dashboard/risk-assessment';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { TradeAnalysis } from '@/components/dashboard/trade-analysis';
import { useToast } from '@/hooks/use-toast';
import { timeframes, menuItems } from '@/lib/data';
import { OrderBook } from '@/components/dashboard/order-book';
import { SupportResistance } from '@/components/dashboard/support-resistance';
import { Level2Analysis } from '@/components/dashboard/l2-analysis';
import type { OrderBookData } from '@/lib/bybit-api';
import type { SupportResistanceOutput } from '@/ai/flows/support-resistance-analyzer';
import { fetchKlineData, type KlineData } from '@/lib/bybit-api';
import { calculateIndicators } from '@/ai/flows/indicator-calculator';
import { SymbolProvider, useSymbol } from '@/contexts/symbol-context';


export type ChartData = Awaited<ReturnType<typeof calculateIndicators>>['data'];

function DashboardContent() {
  const pathname = usePathname();
  const { symbol } = useSymbol();
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [orderBookData, setOrderBookData] = React.useState<OrderBookData | null>(null);
  const [supportResistance, setSupportResistance] = React.useState<SupportResistanceOutput | null>(null);
  const [isLoadingChart, setIsLoadingChart] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState('1D');
  const { toast } = useToast();

  const fetchChartData = React.useCallback(async (tf: string, currentSymbol: string) => {
    setIsLoadingChart(true);
    setChartData(null); // Clear previous chart data
    setSupportResistance(null); // Clear previous S/R levels
    try {
      // Map our timeframe to Bybit's interval
      const intervalMap: { [key: string]: string } = {
        '1H': '60',
        '4H': '240',
        '1D': 'D',
        '1W': 'W',
      };
      const bybitInterval = intervalMap[tf];
      const rawKlineData = await fetchKlineData({ symbol: currentSymbol, interval: bybitInterval, limit: 100 });
      
      if (rawKlineData.length === 0) {
        setChartData([]); // Set to empty array to indicate no data
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


  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="size-7 shrink-0" />
              <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
                TradeAlchemist
              </span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 pt-6 md:space-y-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <PerformanceCards />
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <MainChart 
                data={chartData}
                isLoading={isLoadingChart}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                timeframes={timeframes}
                supportResistance={supportResistance}
              />
            </div>
            <div className="space-y-4 md:space-y-8">
              <StrategyAdvisor />
              <NewsSentiment />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-3">
            <OrderBook chartData={chartData} onData={setOrderBookData} />
            <SupportResistance chartData={chartData} onData={setSupportResistance} />
            <Level2Analysis orderBookData={orderBookData} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TradeHistory />
            </div>
            <div className="space-y-4 md:space-y-8">
              <PositionManager chartData={chartData}/>
              <RiskAssessment chartData={chartData} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <TradeAnalysis />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardPage() {
  return (
    <SymbolProvider>
      <DashboardContent />
    </SymbolProvider>
  );
}
