'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BookOpen, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { generateOrderBook, type OrderBookData } from '@/ai/flows/order-book-generator';
import type { ChartData } from '@/app/page';
import { useToast } from '@/hooks/use-toast';

interface OrderBookProps {
    chartData: ChartData | null;
    onData: (data: OrderBookData) => void;
}

export function OrderBook({ chartData, onData }: OrderBookProps) {
  const [data, setData] = React.useState<OrderBookData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const latestPrice = chartData && chartData.length > 0 ? chartData[chartData.length - 1].price : null;

  const fetchOrderBook = React.useCallback(async (price: number) => {
    setIsLoading(true);
    try {
      const result = await generateOrderBook({
        currentPrice: price,
        depth: 10,
      });
      setData(result);
      onData(result);
    } catch (error) {
      console.error('Error generating order book:', error);
      toast({
        variant: 'destructive',
        title: 'Order Book Error',
        description: 'Could not load order book data.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, onData]);

  React.useEffect(() => {
    if (latestPrice) {
      fetchOrderBook(latestPrice);
      const interval = setInterval(() => fetchOrderBook(latestPrice), 15000); // Refresh every 15s
      return () => clearInterval(interval);
    } else {
        setIsLoading(true);
        setData(null);
    }
  }, [latestPrice, fetchOrderBook]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Order Book (BTC/USD)
        </CardTitle>
        <CardDescription>
          Real-time market depth and liquidity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !data ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-[300px] overflow-hidden">
            <div className="flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-green-400">Bid Price</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className="overflow-y-auto">
                <Table>
                    <TableBody>
                    {data?.bids.map((bid) => (
                        <TableRow key={bid.price} className="relative">
                            <TableCell className="font-mono text-sm text-green-400 p-2">{bid.price.toFixed(2)}</TableCell>
                            <TableCell className="font-mono text-sm text-right p-2">{bid.size.toFixed(4)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-red-400">Ask Price</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                  </TableRow>
                </TableHeader>
                </Table>
                <div className="overflow-y-auto">
                    <Table>
                        <TableBody>
                        {data?.asks.map((ask) => (
                            <TableRow key={ask.price}>
                                <TableCell className="font-mono text-sm text-red-400 p-2">{ask.price.toFixed(2)}</TableCell>
                                <TableCell className="font-mono text-sm text-right p-2">{ask.size.toFixed(4)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </div>
        )}
         <div className="mt-4 text-center text-xs text-muted-foreground flex justify-between items-center">
            {isLoading && data && <Loader2 className="size-4 animate-spin text-primary" />}
            {data && <p>Spread: <span className="font-mono">${data.spread.toFixed(2)}</span></p>}
            <p>Updates automatically</p>
          </div>
      </CardContent>
    </Card>
  );
}
