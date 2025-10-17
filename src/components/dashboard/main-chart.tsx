'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { timeframes } from '@/lib/data';
import { ChartTooltipContent } from '@/components/ui/chart';
import { generateMarketData, type GenerateMarketDataOutput } from '@/ai/flows/market-data-generator';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type ChartData = GenerateMarketDataOutput['data'];

const dataConfig: { [key: string]: { days: number; volatility: number; initialPrice: number } } = {
  '1H': { days: 24, volatility: 200, initialPrice: 67500 },
  '4H': { days: 60, volatility: 800, initialPrice: 67500 },
  '1D': { days: 30, volatility: 1000, initialPrice: 67500 },
  '1W': { days: 52, volatility: 3000, initialPrice: 67500 },
};

export function MainChart() {
  const [data, setData] = React.useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState('1D');
  const { toast } = useToast();

  const fetchData = React.useCallback(async (tf: string) => {
    setIsLoading(true);
    try {
      const config = dataConfig[tf];
      const result = await generateMarketData({
        timeframe: tf as '1H' | '4H' | '1D' | '1W',
        ...config,
      });
      setData(result.data);
    } catch (error) {
      console.error('Error generating market data:', error);
      toast({
        variant: 'destructive',
        title: 'Chart Error',
        description: 'Could not load chart data. Please try again.',
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData(timeframe);
  }, [fetchData, timeframe]);

  const handleTabChange = (value: string) => {
    setTimeframe(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="font-headline text-2xl">BTC/USD Trend Analysis</CardTitle>
          <CardDescription>Real-time market trend visualization</CardDescription>
        </div>
        <Tabs defaultValue="1D" className="w-auto" onValueChange={handleTabChange}>
          <TabsList>
            {timeframes.map((tf) => (
              <TabsTrigger key={tf} value={tf} disabled={isLoading}>
                {tf}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {isLoading || !data ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: -10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema20" stroke="hsl(var(--chart-1))" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="sma50" stroke="hsl(var(--chart-2))" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
