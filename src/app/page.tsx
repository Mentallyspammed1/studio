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
import { generateMarketData } from '@/ai/flows/market-data-generator';
import type { GenerateMarketDataOutput } from '@/ai/flows/market-data-generator';
import { useToast } from '@/hooks/use-toast';
import { timeframes, dataConfig, menuItems } from '@/lib/data';

export type ChartData = GenerateMarketDataOutput['data'];

export default function DashboardPage() {
  const pathname = usePathname();
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [isLoadingChart, setIsLoadingChart] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState('1D');
  const { toast } = useToast();

  const fetchChartData = React.useCallback(async (tf: string) => {
    setIsLoadingChart(true);
    try {
      const config = dataConfig[tf];
      const result = await generateMarketData({
        timeframe: tf as '1H' | '4H' | '1D' | '1W',
        ...config,
      });
      setChartData(result.data);
    } catch (error) {
      console.error('Error generating market data:', error);
      toast({
        variant: 'destructive',
        title: 'Chart Error',
        description: 'Could not load chart data. Please try again.',
      });
      setChartData([]);
    } finally {
      setIsLoadingChart(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchChartData(timeframe);
  }, [fetchChartData, timeframe]);


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
              />
            </div>
            <div className="space-y-4 md:space-y-8">
              <StrategyAdvisor />
              <NewsSentiment />
            </div>
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
