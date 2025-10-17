
'use server';
/**
 * @fileOverview An AI agent that generates realistic market data for a given time period.
 *
 * - generateMarketData - A function that generates market data.
 * - GenerateMarketDataInput - The input type for the generateMarketData function.
 * - GenerateMarketDataOutput - The return type for the generateMarketData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DataPointSchema = z.object({
  date: z.string().describe("The date for the data point, formatted as 'Mon DD'."),
  price: z.number().describe('The closing price for the data point.'),
  ema20: z.number().describe('The 20-period exponential moving average.'),
  sma50: z.number().describe('The 50-period simple moving average.'),
});

const GenerateMarketDataInputSchema = z.object({
  timeframe: z.enum(['1H', '4H', '1D', '1W']).describe('The time frame for the data.'),
  days: z.number().describe('The number of days of data to generate.'),
  initialPrice: z.number().describe('The starting price.'),
  volatility: z.number().describe('A factor affecting price fluctuation.'),
});

export type GenerateMarketDataInput = z.infer<typeof GenerateMarketDataInputSchema>;

const GenerateMarketDataOutputSchema = z.object({
  data: z.array(DataPointSchema),
});

export type GenerateMarketDataOutput = z.infer<typeof GenerateMarketDataOutputSchema>;

export async function generateMarketData(
  input: GenerateMarketDataInput
): Promise<GenerateMarketDataOutput> {
  return generateMarketDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketDataPrompt',
  input: { schema: GenerateMarketDataInputSchema },
  output: { schema: GenerateMarketDataOutputSchema },
  prompt: `You are a financial data simulation expert. Generate a realistic series of BTC/USD price data points for the specified timeframe.

  Instructions:
  1.  Generate '{{days}}' data points.
  2.  Start with an initial price of {{initialPrice}}.
  3.  Introduce price changes based on a volatility factor of {{volatility}}. The price should have random but plausible fluctuations.
  4.  For each data point, calculate a realistic 20-period EMA (ema20) and a 50-period SMA (sma50).
  5.  The 'date' for each point should be formatted as 'MMM DD' (e.g., 'May 20').
  6.  Ensure prices never go below 1000.

  Provide the output as a JSON object containing a 'data' array of data points.`,
});

const generateMarketDataFlow = ai.defineFlow(
  {
    name: 'generateMarketDataFlow',
    inputSchema: GenerateMarketDataInputSchema,
    outputSchema: GenerateMarketDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
