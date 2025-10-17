'use client';

import * as React from 'react';
import { Award, BarChart, BrainCircuit, Lightbulb, Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  analyzeTradeHistory,
  type TradeHistoryAnalyzerOutput,
} from '@/ai/flows/trade-history-analyzer';
import { tradeHistory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function TradeAnalysis() {
  const [analysis, setAnalysis] = React.useState<TradeHistoryAnalyzerOutput | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsPending(true);
    setAnalysis(null);
    try {
      const result = await analyzeTradeHistory({ trades: tradeHistory });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing trade history:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze trade history. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <BarChart className="h-6 w-6 text-primary" />
          Trade Performance Analysis
        </CardTitle>
        <CardDescription>
          AI-powered feedback on your recent trading activity to help you improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <p className="mb-4 text-muted-foreground">Analyze your trade history to get personalized insights.</p>
            <Button onClick={handleAnalysis} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              Analyze My Trades
            </Button>
          </div>
        )}

        {isPending && !analysis && (
          <div className="mt-4 flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p>Your personal AI trading coach is analyzing your trades...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div>
              <h3 className="font-headline text-lg mb-2">Performance Summary</h3>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-green-400">
                  <ThumbsUp className="h-5 w-5" />
                  Strengths
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysis.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-red-400">
                  <ThumbsDown className="h-5 w-5" />
                  Weaknesses
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysis.weaknesses.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
                <h4 className="font-semibold flex items-center gap-2 text-yellow-400 mb-3">
                    <Lightbulb className="h-5 w-5" />
                    Actionable Suggestions
                </h4>
                <div className="space-y-3">
                    {analysis.suggestions.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border">
                           <Award className="h-5 w-5 mt-1 text-accent shrink-0"/>
                           <p className="text-muted-foreground">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
             <Button onClick={handleAnalysis} disabled={isPending} variant="outline" size="sm">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              Re-analyze Trades
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
