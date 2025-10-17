'use client';

import * as React from 'react';
import { BrainCircuit, Loader2, BarChartBig, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { analyzeL2Data, type L2AnalysisOutput } from '@/ai/flows/l2-analyzer';
import { useToast } from '@/hooks/use-toast';
import { type OrderBookData } from '@/ai/flows/order-book-generator';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

interface Level2AnalysisProps {
  orderBookData: OrderBookData | null;
}

export function Level2Analysis({ orderBookData }: Level2AnalysisProps) {
  const [analysis, setAnalysis] = React.useState<L2AnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const fetchAnalysis = React.useCallback(async (orderBook: OrderBookData) => {
    setIsLoading(true);
    try {
      const result = await analyzeL2Data({ orderBook });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing L2 data:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: 'Could not perform L2 analysis.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (orderBookData) {
      fetchAnalysis(orderBookData);
    }
  }, [orderBookData, fetchAnalysis]);

  const SentimentIcon = analysis ? {
    Bullish: <TrendingUp className="h-5 w-5 text-green-500" />,
    Bearish: <TrendingDown className="h-5 w-5 text-red-500" />,
    Neutral: <BarChartBig className="h-5 w-5 text-yellow-500" />,
  }[analysis.sentiment] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          L2 Market Analysis
        </CardTitle>
        <CardDescription>
          AI-powered insights from the live order book.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[348px]">
        {!orderBookData ? (
           <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Waiting for order book data...</p>
           </div>
        ) : isLoading ? (
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-7 w-32" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/6" />
            </div>
        ) : analysis ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Sentiment</h4>
              <Badge variant={analysis.sentiment === 'Bullish' ? 'default' : analysis.sentiment === 'Bearish' ? 'destructive' : 'secondary'} className="flex gap-2">
                {SentimentIcon}
                {analysis.sentiment}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Summary</h4>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Details</h4>
              <p className="text-sm text-muted-foreground">{analysis.details}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
