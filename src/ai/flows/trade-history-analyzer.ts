'use server';

/**
 * @fileOverview An AI agent that analyzes a user's trade history and provides performance feedback.
 *
 * - analyzeTradeHistory - A function that handles the trade history analysis.
 * - TradeHistoryAnalyzerInput - The input type for the analyzeTradeHistory function.
 * - TradeHistoryAnalyzerOutput - The return type for the analyzeTradeHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TradeSchema = z.object({
  id: z.number(),
  pair: z.string(),
  type: z.enum(['Buy', 'Sell']),
  amount: z.number(),
  pl: z.number().describe('Profit or Loss from the trade'),
  date: z.string(),
});

const TradeHistoryAnalyzerInputSchema = z.object({
  trades: z.array(TradeSchema),
});
export type TradeHistoryAnalyzerInput = z.infer<typeof TradeHistoryAnalyzerInputSchema>;

const TradeHistoryAnalyzerOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the overall trading performance.'),
  strengths: z.array(z.string()).describe('A list of identified trading strengths.'),
  weaknesses: z.array(z.string()).describe('A list of identified trading weaknesses.'),
  suggestions: z
    .array(z.string())
    .describe('A list of actionable suggestions for improvement.'),
});
export type TradeHistoryAnalyzerOutput = z.infer<typeof TradeHistoryAnalyzerOutputSchema>;

export async function analyzeTradeHistory(
  input: TradeHistoryAnalyzerInput
): Promise<TradeHistoryAnalyzerOutput> {
  return tradeHistoryAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tradeHistoryAnalyzerPrompt',
  input: {schema: TradeHistoryAnalyzerInputSchema},
  output: {schema: TradeHistoryAnalyzerOutputSchema},
  prompt: `You are an expert trading coach. Analyze the following trade history and provide a performance review.

  Your analysis should include:
  1.  A concise summary of the overall performance.
  2.  Key strengths demonstrated by the trading patterns.
  3.  Key weaknesses or areas for improvement.
  4.  A few actionable suggestions to improve trading performance.

  Here is the trade history data:
  {{#each trades}}
  - Pair: {{{pair}}}, Type: {{{type}}}, Amount: {{{amount}}}, P/L: {{{pl}}}, Date: {{{date}}}
  {{/each}}

  Analyze the data and provide your feedback in the requested JSON format.`,
});

const tradeHistoryAnalyzerFlow = ai.defineFlow(
  {
    name: 'tradeHistoryAnalyzerFlow',
    inputSchema: TradeHistoryAnalyzerInputSchema,
    outputSchema: TradeHistoryAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
