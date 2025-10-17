'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MainChart } from '@/components/dashboard/main-chart';
import { PerformanceCards } from '@/components/dashboard/performance-cards';
import { StrategyAdvisor } from '@/components/dashboard/strategy-advisor';
import { NewsSentiment } from '@/components/dashboard/news-sentiment';
import { TradeHistory } from '@/components/dashboard/trade-history';
import { PositionManager } from '@/components/dashboard/position-manager';
import { RiskAssessment } from '@/components/dashboard/risk-assessment';
import { TradeAnalysis } from '@/components/dashboard/trade-analysis';
import { timeframes } from '@/lib/data';
import { OrderBook } from '@/components/dashboard/order-book';
import { SupportResistance } from '@/components/dashboard/support-resistance';
import { Level2Analysis } from '@/components/dashboard/l2-analysis';
import { SymbolProvider } from '@/contexts/symbol-context';
import { MarketDataProvider, useMarketData } from '@/components/dashboard/market-data-container';
import ErrorBoundary from '@/components/error-boundary';

function DashboardContent() {
  const {
    chartData,
    orderBookData,
    supportResistance,
    isLoadingChart,
    timeframe,
    setTimeframe,
    setOrderBookData,
    setSupportResistance,
  } = useMarketData();

  return (
    <DashboardLayout>
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
          <PositionManager chartData={chartData} />
          <RiskAssessment chartData={chartData} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        <TradeAnalysis />
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <SymbolProvider>
      <MarketDataContainer>
        <ErrorBoundary>
          <DashboardContent />
        </ErrorBoundary>
      </MarketDataContainer>
    </SymbolProvider>
  );
}