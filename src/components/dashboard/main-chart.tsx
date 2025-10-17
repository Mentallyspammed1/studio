'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '../ui/skeleton';
import type { ChartData } from '@/app/page';
import type { SupportResistanceOutput } from '@/ai/flows/support-resistance-analyzer';
import { useSymbol } from '@/contexts/symbol-context';

interface MainChartProps {
  data: ChartData | null;
  isLoading: boolean;
  timeframe: string;
  setTimeframe: (value: string) => void;
  timeframes: string[];
  supportResistance: SupportResistanceOutput | null;
}

export function MainChart({ data, isLoading, timeframe, setTimeframe, timeframes, supportResistance }: MainChartProps) {
  const { symbol } = useSymbol();
  const handleTabChange = (value: string) => {
    setTimeframe(value);
  };
  
  const yAxisDomain = React.useMemo(() => {
    if (!data || data.length === 0) return ['auto', 'auto'];
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [data]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="font-headline text-2xl">{symbol} Trend Analysis</CardTitle>
          <CardDescription>Real-time market trend visualization</CardDescription>
        </div>
        <Tabs value={timeframe} className="w-auto" onValueChange={handleTabChange}>
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
               {!data && !isLoading ? <p className='text-muted-foreground'>No data available for this symbol.</p> : <Skeleton className="h-full w-full" />}
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
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  domain={yAxisDomain}
                  allowDataOverflow={true}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Price" />
                <Line type="monotone" dataKey="ema20" stroke="hsl(var(--chart-1))" strokeWidth={1.5} dot={false} name="EMA 20" />
                <Line type="monotone" dataKey="sma50" stroke="hsl(var(--chart-2))" strokeWidth={1.5} dot={false} name="SMA 50" />

                {supportResistance?.support.map((level, index) => (
                    <ReferenceLine 
                      key={`support-${index}`} 
                      y={level} 
                      label={{ value: `S${index + 1}`, position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      stroke="hsl(var(--chart-2))" 
                      strokeDasharray="3 3" 
                    />
                ))}
                {supportResistance?.resistance.map((level, index) => (
                    <ReferenceLine 
                      key={`resistance-${index}`} 
                      y={level} 
                      label={{ value: `R${index + 1}`, position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      stroke="hsl(var(--chart-5))" 
                      strokeDasharray="3 3" 
                    />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
