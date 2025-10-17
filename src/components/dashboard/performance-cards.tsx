'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, BarChart, Percent, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performanceStats as initialStats } from '@/lib/data';

const statIcons = {
  pnl: TrendingUp,
  winRate: Percent,
  totalTrades: BarChart,
  avgTrade: TrendingUp,
};

type StatKeys = keyof typeof initialStats;

export function PerformanceCards() {
  const [stats, setStats] = React.useState(initialStats);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        pnl: {
          ...prevStats.pnl,
          value: prevStats.pnl.value + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.45) * 2,
        },
        winRate: {
          ...prevStats.winRate,
          value: Math.max(0, Math.min(100, prevStats.winRate.value + (Math.random() - 0.5) * 0.5)),
          change: (Math.random() - 0.5) * 1,
        },
        totalTrades: {
          ...prevStats.totalTrades,
          value: prevStats.totalTrades.value + (Math.random() > 0.7 ? 1 : 0),
          change: (Math.random() - 0.3) * 5,
        },
        avgTrade: {
          ...prevStats.avgTrade,
          value: prevStats.avgTrade.value + (Math.random() - 0.5) * 5,
          change: (Math.random() - 0.5) * 3,
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {Object.entries(stats).map(([key, stat]) => {
        const Icon = statIcons[key as StatKeys];
        const isPositive = stat.change >= 0;
        const ChangeIcon = isPositive ? ArrowUp : ArrowDown;
        const formattedValue =
          key === 'pnl' || key === 'avgTrade'
            ? `$${stat.value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : key === 'winRate'
            ? `${stat.value.toFixed(2)}%`
            : stat.value.toString();

        return (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formattedValue}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ChangeIcon
                  className={`h-3 w-3 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                />
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  {isPositive ? '+' : ''}
                  {stat.change.toFixed(2)}%
                </span>
                <span className="ml-1">from last period</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
