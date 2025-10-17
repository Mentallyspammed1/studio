'use client';

import * as React from 'react';
import { Layers, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { analyzeSupportResistance, type SupportResistanceOutput } from '@/ai/flows/support-resistance-analyzer';
import type { ChartData } from '@/app/page';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

interface SupportResistanceProps {
  chartData: ChartData | null;
  onData: (data: SupportResistanceOutput) => void;
}

export function SupportResistance({ chartData, onData }: SupportResistanceProps) {
  const [data, setData] = React.useState<SupportResistanceOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchLevels = React.useCallback(async (marketData: ChartData) => {
    setIsLoading(true);
    try {
      const result = await analyzeSupportResistance({
        marketData: marketData.map(d => ({ date: d.date, price: d.price })),
        count: 3,
      });
      setData(result);
      onData(result);
    } catch (error) {
      console.error('Error analyzing support/resistance:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: 'Could not load support & resistance levels.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, onData]);

  React.useEffect(() => {
    if (chartData && chartData.length > 0) {
        fetchLevels(chartData);
    } else {
        setIsLoading(true);
        setData(null);
    }
  }, [chartData, fetchLevels]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Support & Resistance
        </CardTitle>
        <CardDescription>
          Key price levels identified by AI analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[348px]">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            {[...Array(6)].map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
            ))}
          </div>
        ) : data ? (
            <div className="space-y-4 pt-2">
                <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Resistance Levels</h4>
                    <div className="space-y-3">
                        {data.resistance.map((level, i) => (
                            <div key={`res-${i}`} className='flex justify-between items-baseline'>
                                <span className='text-xs text-muted-foreground'>R{i+1}</span>
                                <p className="font-mono text-base text-right">${level.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <Separator />
                 <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Support Levels</h4>
                    <div className="space-y-3">
                        {data.support.map((level, i) => (
                             <div key={`sup-${i}`} className='flex justify-between items-baseline'>
                                <span className='text-xs text-muted-foreground'>S{i+1}</span>
                                <p className="font-mono text-base text-right">${level.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
          <p className="text-muted-foreground text-sm">Not enough data to determine levels.</p>
        )}
      </CardContent>
    </Card>
  );
}
