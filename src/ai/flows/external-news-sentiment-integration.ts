// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that analyzes real-time news sentiment for enriched trade confidence.
 *
 * - analyzeNewsSentiment - A function that handles the news sentiment analysis process.
 * - AnalyzeNewsSentimentInput - The input type for the analyzeNewsSentiment function.
 * - AnalyzeNewsSentimentOutput - The return type for the analyzeNewsSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsSentimentInputSchema = z.object({
  newsHeadline: z.string().describe('A news headline related to a specific stock or market.'),
  ticker: z.string().describe('The ticker symbol of the stock related to the news headline.'),
});

export type AnalyzeNewsSentimentInput = z.infer<typeof AnalyzeNewsSentimentInputSchema>;

const AnalyzeNewsSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the news headline.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A score between 0 and 1 indicating the confidence in the sentiment analysis.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the sentiment analysis and confidence score.'),
});

export type AnalyzeNewsSentimentOutput = z.infer<typeof AnalyzeNewsSentimentOutputSchema>;

export async function analyzeNewsSentiment(input: AnalyzeNewsSentimentInput): Promise<AnalyzeNewsSentimentOutput> {
  return analyzeNewsSentimentFlow(input);
}

const analyzeNewsSentimentPrompt = ai.definePrompt({
  name: 'analyzeNewsSentimentPrompt',
  input: {schema: AnalyzeNewsSentimentInputSchema},
  output: {schema: AnalyzeNewsSentimentOutputSchema},
  prompt: `You are an AI assistant that analyzes the sentiment of financial news headlines for traders.\n\n  Analyze the following news headline and determine its sentiment (positive, negative, or neutral) towards the given stock. Provide a confidence score (0-1) for your analysis and explain your reasoning.\n\n  News Headline: {{{newsHeadline}}}\n  Ticker Symbol: {{{ticker}}}\n\n  Format your response as a JSON object with "sentiment", "confidenceScore", and "reasoning" keys. Sentiment should be positive, negative, or neutral.\n  `,
});

const analyzeNewsSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeNewsSentimentFlow',
    inputSchema: AnalyzeNewsSentimentInputSchema,
    outputSchema: AnalyzeNewsSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeNewsSentimentPrompt(input);
    return output!;
  }
);
