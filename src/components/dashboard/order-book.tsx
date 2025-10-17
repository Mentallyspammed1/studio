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
import { fetchOrderBook, type OrderBookData } from '@/lib/bybit-api';
import type { ChartData } from '@/app/page';
import { useToast } from '@/hooks/use-toast';
import { useSymbol } from '@/contexts/symbol-context';

interface OrderBookProps {
    chartData: ChartData | null;
    onData: (data: OrderBookData) => void;
}

export function OrderBook({ onData }: OrderBookProps) {
  const [data, setData] = React.useState<OrderBookData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const { symbol } = useSymbol();

  const fetchOrderBookData = React.useCallback(async () => {
    // No setIsLoading(true) here to allow silent refresh
    try {
      const result = await fetchOrderBook({ symbol, limit: 10 });
      setData(result);
      onData(result);
    } catch (error) {
      console.error('Error fetching order book:', error);
      setData(null); // Clear old data on error
      toast({
        variant: 'destructive',
        title: 'Order Book Error',
        description: 'Could not load order book data from Bybit.',
      });
    } finally {
        if(isLoading) setIsLoading(false);
    }
  }, [toast, onData, isLoading, symbol]);

  React.useEffect(() => {
    setIsLoading(true);
    fetchOrderBookData(); // Initial fetch for new symbol
    const interval = setInterval(fetchOrderBookData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [symbol]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Order Book ({symbol})
        </CardTitle>
        <CardDescription>
          Real-time market depth and liquidity from Bybit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
          </div>
        ) : !data || data.bids.length === 0 && data.asks.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground text-sm">No order book data for this symbol.</p>
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
                    {data?.bids.map(([price, size]) => (
                        <TableRow key={price} className="relative">
                            <TableCell className="font-mono text-sm text-green-400 p-2">{Number(price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                            <TableCell className="font-mono text-sm text-right p-2">{Number(size).toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})}</TableCell>
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
                        {data?.asks.map(([price, size]) => (
                            <TableRow key={price}>
                                <TableCell className="font-mono text-sm text-red-400 p-2">{Number(price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                                <TableCell className="font-mono text-sm text-right p-2">{Number(size).toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </div>
        )}
         <div className="mt-4 text-center text-xs text-muted-foreground flex justify-between items-center">
            {!isLoading && <Loader2 className="size-4 animate-spin text-primary" />}
            {data && <p>Spread: <span className="font-mono">${data.spread.toFixed(2)}</span></p>}
            <p>Live updates</p>
          </div>
      </CardContent>
    </Card>
  );
}
