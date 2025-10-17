'use server';
/**
 * @fileOverview An AI agent that analyzes Level 2 order book data to provide market sentiment insights.
 *
 * - analyzeL2Data - A function that analyzes the L2 data.
 * - L2AnalysisInput - The input type for the analyzeL2Data function.
 * - L2AnalysisOutput - The return type for the analyzeL2Data function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const OrderSchema = z.object({
  price: z.number(),
  size: z.number(),
});

const OrderBookDataSchema = z.object({
  bids: z.array(OrderSchema),
  asks: z.array(OrderSchema),
  spread: z.number(),
});

const L2AnalysisInputSchema = z.object({
  orderBook: OrderBookDataSchema,
});
export type L2AnalysisInput = z.infer<typeof L2AnalysisInputSchema>;

const L2AnalysisOutputSchema = z.object({
  sentiment: z.enum(['Bullish', 'Bearish', 'Neutral']).describe('The overall market sentiment derived from the order book.'),
  summary: z.string().describe('A concise summary of the order book analysis.'),
  details: z.string().describe('A more detailed explanation of the current order book dynamics, including any significant buy or sell walls.'),
});
export type L2AnalysisOutput = z.infer<typeof L2AnalysisOutputSchema>;

export async function analyzeL2Data(
  input: L2AnalysisInput
): Promise<L2AnalysisOutput> {
  return analyzeL2DataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeL2DataPrompt',
  input: { schema: L2AnalysisInputSchema },
  output: { schema: L2AnalysisOutputSchema },
  prompt: `You are an expert market analyst specializing in order book (Level 2) analysis. Analyze the provided order book data and deliver a concise market sentiment report.

  Instructions:
  1.  Calculate the total volume of the top 10 bids and top 10 asks.
  2.  Compare the bid vs. ask volume to determine if buyers or sellers are more aggressive.
  3.  Identify any large order sizes (buy or sell "walls") that could act as short-term support or resistance.
  4.  Assess the spread. A tight spread usually indicates high liquidity and consensus on price, while a wide spread can indicate uncertainty or low liquidity.
  5.  Based on your analysis, determine the overall sentiment (Bullish, Bearish, or Neutral).
  6.  Provide a short 'summary' and a more detailed 'details' section explaining your reasoning.

  Order Book Data:
  Spread: {{orderBook.spread}}
  Bids (Buy Orders):
  {{#each orderBook.bids}}
  - Price: {{price}}, Size: {{size}}
  {{/each}}
  Asks (Sell Orders):
  {{#each orderBook.asks}}
  - Price: {{price}}, Size: {{size}}
  {{/each}}

  Provide your analysis as a JSON object.`,
});

const analyzeL2DataFlow = ai.defineFlow(
  {
    name: 'analyzeL2DataFlow',
    inputSchema: L2AnalysisInputSchema,
    outputSchema: L2AnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
