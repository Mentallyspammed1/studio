'use server';

/**
 * @fileOverview An AI tool that monitors market conditions and suggests the optimal trading strategy.
 *
 * - adaptiveStrategyAdvisor - A function that suggests the optimal trading strategy based on market conditions.
 * - AdaptiveStrategyAdvisorInput - The input type for the adaptiveStrategyAdvisor function.
 * - AdaptiveStrategyAdvisorOutput - The return type for the adaptiveStrategyAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveStrategyAdvisorInputSchema = z.object({
  marketConditions: z.string().describe('The current market conditions.'),
  availableStrategies: z.array(z.string()).describe('The available trading strategies.'),
  currentStrategy: z.string().optional().describe('The currently active trading strategy.'),
});
export type AdaptiveStrategyAdvisorInput = z.infer<typeof AdaptiveStrategyAdvisorInputSchema>;

const AdaptiveStrategyAdvisorOutputSchema = z.object({
  suggestedStrategy: z.string().describe('The suggested trading strategy based on market conditions.'),
  reasoning: z.string().describe('The reasoning behind the suggested strategy.'),
});
export type AdaptiveStrategyAdvisorOutput = z.infer<typeof AdaptiveStrategyAdvisorOutputSchema>;

export async function adaptiveStrategyAdvisor(input: AdaptiveStrategyAdvisorInput): Promise<AdaptiveStrategyAdvisorOutput> {
  return adaptiveStrategyAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveStrategyAdvisorPrompt',
  input: {schema: AdaptiveStrategyAdvisorInputSchema},
  output: {schema: AdaptiveStrategyAdvisorOutputSchema},
  prompt: `You are an expert trading strategy advisor. Given the current market conditions and available trading strategies, you will suggest the optimal trading strategy and provide reasoning for your suggestion.\n\nCurrent Market Conditions: {{{marketConditions}}}\nAvailable Trading Strategies: {{#each availableStrategies}}{{{this}}}\n{{/each}}\n{{~#if currentStrategy}}Current Strategy: {{{currentStrategy}}}{{/if}}\n\nConsider the current market conditions and determine if a change of strategy is warranted. Explain your reasoning.\n\nSuggested Strategy: `,
});

const adaptiveStrategyAdvisorFlow = ai.defineFlow(
  {
    name: 'adaptiveStrategyAdvisorFlow',
    inputSchema: AdaptiveStrategyAdvisorInputSchema,
    outputSchema: AdaptiveStrategyAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
