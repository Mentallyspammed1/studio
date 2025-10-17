'use client';

import * as React from 'react';
import { BrainCircuit, Newspaper, ThumbsDown, ThumbsUp, HelpCircle, Loader2 } from 'lucide-react';
import { newsItems } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { analyzeNewsSentiment, type AnalyzeNewsSentimentOutput } from '@/ai/flows/external-news-sentiment-integration';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

type NewsItemWithSentiment = (typeof newsItems)[0] & {
  sentimentResult?: AnalyzeNewsSentimentOutput;
  isLoading?: boolean;
};

const SentimentIcon = ({ sentiment }: { sentiment: 'positive' | 'negative' | 'neutral' }) => {
  switch (sentiment) {
    case 'positive':
      return <ThumbsUp className="h-4 w-4 text-green-500" />;
    case 'negative':
      return <ThumbsDown className="h-4 w-4 text-red-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-yellow-500" />;
  }
};

export function NewsSentiment() {
  const [analyzedNews, setAnalyzedNews] = React.useState<NewsItemWithSentiment[]>(newsItems);
  const { toast } = useToast();

  const handleAnalysis = async (id: number, newsHeadline: string, ticker: string) => {
    setAnalyzedNews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLoading: true } : item))
    );

    try {
      const result = await analyzeNewsSentiment({ newsHeadline, ticker });
      setAnalyzedNews((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, sentimentResult: result, isLoading: false } : item
        )
      );
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze news sentiment. Please try again.',
      });
      setAnalyzedNews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isLoading: false } : item))
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          News Sentiment
        </CardTitle>
        <CardDescription>Real-time news sentiment analysis for enriched trade confidence.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <div className="space-y-4">
            {analyzedNews.map((item, index) => (
              <div key={item.id}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">{item.headline}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.source} - {item.ticker}
                      </p>
                    </div>
                    {!item.sentimentResult && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAnalysis(item.id, item.headline, item.ticker)}
                        disabled={item.isLoading}
                      >
                        {item.isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BrainCircuit className="h-4 w-4" />
                        )}
                        <span className="sr-only">Analyze</span>
                      </Button>
                    )}
                  </div>
                  {item.sentimentResult && (
                    <div className="text-xs space-y-2 rounded-md bg-background/50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SentimentIcon sentiment={item.sentimentResult.sentiment} />
                          <Badge variant={item.sentimentResult.sentiment === 'positive' ? 'default' : item.sentimentResult.sentiment === 'negative' ? 'destructive' : 'secondary'} className="capitalize">
                            {item.sentimentResult.sentiment}
                          </Badge>
                        </div>
                        <span className="font-mono text-muted-foreground">
                          Confidence: {(item.sentimentResult.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-muted-foreground">{item.sentimentResult.reasoning}</p>
                    </div>
                  )}
                </div>
                {index < analyzedNews.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
