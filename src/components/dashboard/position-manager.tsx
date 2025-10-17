import { Target, XCircle, LogIn, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const atr = 250.75;
const currentPrice = 67345.5;
const riskMultiplier = 1.5;
const rewardMultiplier = 2.5;

const entryPrice = currentPrice;
const stopLoss = currentPrice - atr * riskMultiplier;
const takeProfit = currentPrice + atr * rewardMultiplier;

export function PositionManager() {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogIn className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Entry Level</p>
              <p className="font-semibold text-base">${entryPrice.toLocaleString()}</p>
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
      </CardContent>
    </Card>
  );
}
