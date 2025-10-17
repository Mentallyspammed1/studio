'use client';

import * as React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ChartData } from '@/app/page';
import { Skeleton } from '../ui/skeleton';

interface RiskAssessmentProps {
  chartData: ChartData | null;
}

const getRiskInfo = (score: number) => {
  if (score < 33) {
    return { level: 'Low', Icon: Shield, color: 'bg-green-500', badgeVariant: 'default' as const, summary: 'Market conditions appear stable. Low volatility detected.' };
  }
  if (score < 66) {
    return { level: 'Moderate', Icon: ShieldAlert, color: 'bg-yellow-500', badgeVariant: 'secondary' as const, summary: 'Market volatility is average. Monitor open positions closely.' };
  }
  return { level: 'High', Icon: ShieldAlert, color: 'bg-red-500', badgeVariant: 'destructive' as const, summary: 'High market volatility detected. Exercise caution and consider tighter stop-losses.' };
};

export function RiskAssessment({ chartData }: RiskAssessmentProps) {
  const riskScore = React.useMemo(() => {
    if (!chartData || chartData.length < 2) {
      return 45; // Default score
    }
    const latestAtr = chartData[chartData.length - 1].atr;
    const price = chartData[chartData.length - 1].price;
    const volatilityPercent = (latestAtr / price) * 100;

    // Normalize volatility to a 0-100 score. Assume normal volatility is between 1% and 5%.
    const score = Math.min(100, Math.max(0, (volatilityPercent - 1) / (5 - 1) * 100));
    return Math.round(score);
  }, [chartData]);

  const { Icon, color, badgeVariant, level, summary } = getRiskInfo(riskScore);
  const isLoading = !chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Risk Assessment
        </CardTitle>
        <CardDescription>Dynamic risk assessment based on current market conditions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
             <Skeleton className="h-6 w-1/2" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Risk Level</span>
              <Badge variant={badgeVariant}>{level}</Badge>
            </div>
            <div className="space-y-2">
              <Progress value={riskScore} className={cn(color)} />
              <p className="text-xs text-muted-foreground text-right">Risk Score: {riskScore}/100</p>
            </div>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
