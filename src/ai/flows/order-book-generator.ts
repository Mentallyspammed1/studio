'use server';
/**
 * @fileOverview An AI agent that generates a realistic order book for a given asset.
 *
 * - generateOrderBook - A function that generates order book data.
 * - OrderBookInput - The input type for the generateOrderBook function.
 * - OrderBookData - The return type for the generateOrderBook function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const OrderSchema = z.object({
  price: z.number().describe('The price level.'),
  size: z.number().describe('The total size of orders at this price level.'),
});

const OrderBookInputSchema = z.object({
  currentPrice: z.number().describe('The current price of the asset.'),
  depth: z.number().int().min(5).max(20).describe('The number of price levels to generate for bids and asks.'),
});
export type OrderBookInput = z.infer<typeof OrderBookInputSchema>;

const OrderBookDataSchema = z.object({
  bids: z.array(OrderSchema).describe('An array of buy orders, sorted from highest to lowest price.'),
  asks: z.array(OrderSchema).describe('An array of sell orders, sorted from lowest to highest price.'),
  spread: z.number().describe('The difference between the highest bid and lowest ask.'),
});
export type OrderBookData = z.infer<typeof OrderBookDataSchema>;

export async function generateOrderBook(
  input: OrderBookInput
): Promise<OrderBookData> {
  return generateOrderBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOrderBookPrompt',
  input: { schema: OrderBookInputSchema },
  output: { schema: OrderBookDataSchema },
  prompt: `You are a financial market data simulator. Generate a realistic order book for a cryptocurrency like BTC/USD.

  Instructions:
  1. The order book should be centered around the current price of {{currentPrice}}.
  2. Generate {{depth}} levels for both bids (buy orders) and asks (sell orders).
  3. Bids should have prices *below* the current price, and asks should have prices *above* the current price.
  4. The spread (difference between the highest bid and lowest ask) should be small but realistic (e.g., between $0.50 and $5.00).
  5. Order sizes should be varied and plausible. Include some larger "wall" orders at certain levels to simulate market depth.
  6. The bids array should be sorted in descending order by price.
  7. The asks array should be sorted in ascending order by price.
  
  Generate the data and provide the output as a JSON object.`,
});

const generateOrderBookFlow = ai.defineFlow(
  {
    name: 'generateOrderBookFlow',
    inputSchema: OrderBookInputSchema,
    outputSchema: OrderBookDataSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
