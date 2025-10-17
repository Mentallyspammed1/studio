'use client';

import * as React from 'react';
import { BrainCircuit, Lightbulb, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { availableStrategies } from '@/lib/data';
import { adaptiveStrategyAdvisor, type AdaptiveStrategyAdvisorOutput } from '@/ai/flows/adaptive-strategy-advisor';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  marketConditions: z.string().min(10, {
    message: 'Please describe market conditions in at least 10 characters.',
  }),
  currentStrategy: z.string({
    required_error: 'Please select a current strategy.',
  }),
});

export function StrategyAdvisor() {
  const [result, setResult] = React.useState<AdaptiveStrategyAdvisorOutput | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marketConditions: "BTC is consolidating around $67,000. Low volume, but RSI shows potential bullish divergence.",
      currentStrategy: "Trend Following"
    }
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsPending(true);
    setResult(null);
    try {
      const response = await adaptiveStrategyAdvisor({
        ...data,
        availableStrategies,
      });
      setResult(response);
    } catch (error) {
      console.error('Error getting strategy advice:', error);
      toast({
        variant: 'destructive',
        title: 'Strategy Analysis Failed',
        description: 'Could not get a strategy suggestion. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Adaptive Strategy Advisor
        </CardTitle>
        <CardDescription>AI-powered suggestions for the optimal trading strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="marketConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Conditions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., High volatility, price near resistance..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentStrategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableStrategies.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {strategy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Advice
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-4 space-y-3 rounded-lg border bg-background/50 p-4">
            <h4 className="font-semibold text-base flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              AI Suggestion
            </h4>
            <p>
              <strong>Suggested Strategy:</strong>{' '}
              <span className="font-medium text-accent">{result.suggestedStrategy}</span>
            </p>
            <div>
              <p><strong>Reasoning:</strong></p>
              <p className="text-sm text-muted-foreground">{result.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
