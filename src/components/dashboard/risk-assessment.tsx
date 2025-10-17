import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const riskData = {
  level: 'Moderate',
  score: 45,
  summary: 'Market volatility is average. Monitor open positions closely.',
};

const getRiskInfo = (level: string) => {
  switch (level.toLowerCase()) {
    case 'low':
      return { Icon: Shield, color: 'bg-green-500', badgeVariant: 'default' as const };
    case 'moderate':
      return { Icon: ShieldAlert, color: 'bg-yellow-500', badgeVariant: 'secondary' as const };
    case 'high':
      return { Icon: ShieldAlert, color: 'bg-red-500', badgeVariant: 'destructive' as const };
    default:
      return { Icon: Shield, color: 'bg-gray-500', badgeVariant: 'outline' as const };
  }
};

export function RiskAssessment() {
  const { Icon, color, badgeVariant } = getRiskInfo(riskData.level);

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
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current Risk Level</span>
          <Badge variant={badgeVariant}>{riskData.level}</Badge>
        </div>
        <div className="space-y-2">
          <Progress value={riskData.score} indicatorClassName={color} />
          <p className="text-xs text-muted-foreground text-right">Risk Score: {riskData.score}/100</p>
        </div>
        <p className="text-sm text-muted-foreground">{riskData.summary}</p>
      </CardContent>
    </Card>
  );
}
