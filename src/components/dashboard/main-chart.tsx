'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { chartData, timeframes } from '@/lib/data';
import { ChartTooltipContent } from '@/components/ui/chart';

export function MainChart() {
  const [data, setData] = React.useState(chartData.daily);

  const handleTabChange = (value: string) => {
    switch (value) {
      case '1H':
        setData(chartData.hourly);
        break;
      case '4H':
        setData(chartData.fourHourly);
        break;
      case '1W':
        setData(chartData.weekly);
        break;
      default:
        setData(chartData.daily);
    }
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
              <TabsTrigger key={tf} value={tf}>
                {tf}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
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
        </div>
      </CardContent>
    </Card>
  );
}
