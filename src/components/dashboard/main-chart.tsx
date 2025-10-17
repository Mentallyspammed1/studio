'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '../ui/skeleton';
import type { ChartData } from '@/app/page';
import type { SupportResistanceOutput } from '@/ai/flows/support-resistance-analyzer';

interface MainChartProps {
  data: ChartData | null;
  isLoading: boolean;
  timeframe: string;
  setTimeframe: (value: string) => void;
  timeframes: string[];
  supportResistance: SupportResistanceOutput | null;
}

export function MainChart({ data, isLoading, timeframe, setTimeframe, timeframes, supportResistance }: MainChartProps) {
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
                  domain={['dataMin - 1000', 'dataMax + 1000']}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema20" stroke="hsl(var(--chart-1))" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="sma50" stroke="hsl(var(--chart-2))" strokeWidth={1.5} dot={false} />

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
