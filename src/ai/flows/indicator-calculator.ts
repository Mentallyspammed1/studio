'use server';
/**
 * @fileOverview An AI agent that calculates technical indicators from price data.
 *
 * - calculateIndicators - A function that calculates EMA, SMA, and ATR.
 * - IndicatorInput - The input type for the calculateIndicators function.
 * - IndicatorOutput - The return type for the calculateIndicators function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { format } from 'date-fns';

const DataPointSchema = z.object({
  date: z.string().describe("The date for the data point, formatted as 'Mon DD'."),
  price: z.number().describe('The closing price for the data point.'),
  ema20: z.number().describe('The 20-period exponential moving average.'),
  sma50: z.number().describe('The 50-period simple moving average.'),
  atr: z.number().describe('The Average True Range for the data point.'),
});

const IndicatorInputSchema = z.object({
  prices: z.array(z.number()).describe('An array of closing prices, from oldest to newest.'),
});

export type IndicatorInput = z.infer<typeof IndicatorInputSchema>;

const IndicatorOutputSchema = z.object({
  data: z.array(DataPointSchema),
});

export type IndicatorOutput = z.infer<typeof IndicatorOutputSchema>;

export async function calculateIndicators(
  input: IndicatorInput
): Promise<IndicatorOutput> {
  return calculateIndicatorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateIndicatorsPrompt',
  input: { schema: IndicatorInputSchema },
  output: { schema: IndicatorOutputSchema },
  prompt: `You are a financial data analysis expert. Given a series of closing prices, calculate the corresponding technical indicators for each point.

  Instructions:
  1.  The input is an array of closing prices, ordered from oldest to newest. The output should be an array of the same length.
  2.  For each price point, create a data object.
  3.  The 'date' for each point should be formatted as 'MMM DD' (e.g., 'May 20'), assuming today is the last day and counting backwards.
  4.  Calculate the 20-period Exponential Moving Average (EMA) for each point.
  5.  Calculate the 50-period Simple Moving Average (SMA) for each point.
  6.  Calculate the 14-period Average True Range (ATR). You will need to estimate High and Low prices to do this. Assume a daily High is price * 1.01 and Low is price * 0.99 for ATR calculation purposes.
  7.  For periods where there isn't enough preceding data (e.g., the first 49 points for a 50-period SMA), set the indicator value to a reasonable approximation or the same as the price.
  8.  Provide the output as a JSON object containing a 'data' array of data points.
  
  Price Data (oldest to newest):
  {{#each prices}}
  - {{this}}
  {{/each}}
  `,
});

// We need a custom date generation function because the AI was inconsistent
const generateDates = (count: number): string[] => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i));
        dates.push(format(date, 'MMM dd'));
    }
    return dates;
};


const calculateIndicatorsFlow = ai.defineFlow(
  {
    name: 'calculateIndicatorsFlow',
    inputSchema: IndicatorInputSchema,
    outputSchema: IndicatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI for indicator calculation.');
    }
    
    // Replace AI-generated dates with consistently generated ones
    const dates = generateDates(output.data.length);
    const correctedData = output.data.map((point, index) => ({
      ...point,
      date: dates[index],
    }));

    return { data: correctedData };
  }
);
