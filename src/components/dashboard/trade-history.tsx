import { tradeHistory } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
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

export function TradeHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Trade History</CardTitle>
        <CardDescription>A log of your most recent trades.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">P/L</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeHistory.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.pair}</TableCell>
                <TableCell>
                  <Badge variant={trade.type === 'Buy' ? 'default' : 'secondary'} className={trade.type === 'Buy' ? 'bg-green-700/20 text-green-400 border-green-700/30' : 'bg-red-700/20 text-red-400 border-red-700/30'}>
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{trade.amount.toFixed(4)}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    trade.pl > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  ${trade.pl.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{trade.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
