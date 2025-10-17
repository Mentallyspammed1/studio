'use server';
/**
 * @fileOverview An AI agent that analyzes historical price data to identify support and resistance levels.
 *
 * - analyzeSupportResistance - A function that identifies support and resistance.
 * - SupportResistanceInput - The input type for the analyzeSupportResistance function.
 * - SupportResistanceOutput - The return type for the analyzeSupportResistance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DataPointSchema = z.object({
  date: z.string(),
  price: z.number(),
});

const SupportResistanceInputSchema = z.object({
  marketData: z.array(DataPointSchema).describe('An array of recent market data points (price and date).'),
  count: z.number().int().min(2).max(5).describe('The number of support and resistance levels to identify.'),
});
export type SupportResistanceInput = z.infer<typeof SupportResistanceInputSchema>;

const SupportResistanceOutputSchema = z.object({
  support: z.array(z.number()).describe('An array of identified support price levels, sorted from highest to lowest.'),
  resistance: z.array(z.number()).describe('An array of identified resistance price levels, sorted from lowest to highest.'),
});
export type SupportResistanceOutput = z.infer<typeof SupportResistanceOutputSchema>;

export async function analyzeSupportResistance(
  input: SupportResistanceInput
): Promise<SupportResistanceOutput> {
  return analyzeSupportResistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSupportResistancePrompt',
  input: { schema: SupportResistanceInputSchema },
  output: { schema: SupportResistanceOutputSchema },
  prompt: `You are a technical analysis expert. Analyze the provided historical market data to identify the most significant support and resistance levels.

  Instructions:
  1.  Identify {{count}} key support levels where the price has historically found a floor, preventing it from falling further.
  2.  Identify {{count}} key resistance levels where the price has historically met a ceiling, preventing it from rising higher.
  3.  Support levels are prices where a downtrend can be expected to pause due to a concentration of demand.
  4.  Resistance levels are prices where an uptrend can be expected to pause temporarily, due to a concentration of supply.
  5.  Analyze the provided data points to find these price zones. Look for multiple price touches at similar levels.

  Market Data:
  {{#each marketData}}
  - Date: {{date}}, Price: {{price}}
  {{/each}}

  Provide the output as a JSON object with 'support' and 'resistance' arrays. Sort support levels from high to low, and resistance levels from low to high.`,
});

const analyzeSupportResistanceFlow = ai.defineFlow(
  {
    name: 'analyzeSupportResistanceFlow',
    inputSchema: SupportResistanceInputSchema,
    outputSchema: SupportResistanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
