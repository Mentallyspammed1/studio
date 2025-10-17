'use client';

import * as React from 'react';
import { Target, XCircle, LogIn, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ChartData } from '@/app/page';
import { Skeleton } from '../ui/skeleton';

interface PositionManagerProps {
  chartData: ChartData | null;
}

export function PositionManager({ chartData }: PositionManagerProps) {
  const latestDataPoint = chartData && chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const atr = latestDataPoint?.atr ?? 250.75;
  const currentPrice = latestDataPoint?.price ?? 67345.50;
  
  const riskMultiplier = 1.5;
  const rewardMultiplier = 2.5;

  const entryPrice = currentPrice;
  const stopLoss = currentPrice - atr * riskMultiplier;
  const takeProfit = currentPrice + atr * rewardMultiplier;

  const isLoading = !latestDataPoint;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Position Manager
        </CardTitle>
        <CardDescription>ATR-based entry, stop loss, and take profit levels.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogIn className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Entry Level</p>
                  <p className="font-semibold text-base">${entryPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="font-semibold text-base">${stopLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">ATR x {riskMultiplier}</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Take Profit</p>
                  <p className="font-semibold text-base">${takeProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">ATR x {rewardMultiplier}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
