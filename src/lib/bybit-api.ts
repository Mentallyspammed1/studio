'use server';

import { format } from 'date-fns';

const API_BASE = 'https://api.bybit.com';

// Define interfaces for API responses
interface BybitResponse<T> {
  retCode: number;
  retMsg: string;
  result: T;
  retExtInfo: {};
  time: number;
}

// Symbols
interface InstrumentsInfoResult {
    list: { symbol: string }[];
    nextPageCursor: string;
}
export async function fetchSymbols(): Promise<string[]> {
    const params = new URLSearchParams({
        category: 'linear',
        limit: '1000' // Fetch a large number of symbols
    });
    const response = await fetch(`${API_BASE}/v5/market/instruments-info?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch Bybit symbols: ${response.statusText}`);
    }
    const data: BybitResponse<InstrumentsInfoResult> = await response.json();
    if (data.retCode !== 0) {
        throw new Error(`Bybit API error fetching symbols: ${data.retMsg}`);
    }
    return data.result.list.map(item => item.symbol).sort();
}


interface KlineResult {
  symbol: string;
  category: string;
  list: string[][];
}

export interface KlineData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface FetchKlineParams {
  symbol: string;
  interval: string;
  limit?: number;
  start?: number;
  end?: number;
}

export async function fetchKlineData({ symbol, interval, limit = 200, start, end }: FetchKlineParams): Promise<KlineData[]> {
  const params = new URLSearchParams({
    category: 'linear',
    symbol,
    interval,
    limit: limit.toString(),
  });
  if (start) params.append('start', start.toString());
  if (end) params.append('end', end.toString());

  const response = await fetch(`${API_BASE}/v5/market/kline?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Bybit kline data: ${response.statusText}`);
  }

  const data: BybitResponse<KlineResult> = await response.json();
  if (data.retCode !== 0) {
    throw new Error(`Bybit API error: ${data.retMsg}`);
  }

  // If list is empty, it means no data for this symbol/interval
  if (!data.result.list) {
    return [];
  }

  return data.result.list.map(item => ({
    date: format(new Date(parseInt(item[0])), 'MMM dd'),
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
    volume: parseFloat(item[5]),
  })).reverse(); // Bybit returns data in descending order
}

// Order book
interface OrderBookResult {
    s: string; // Symbol
    b: string[][]; // Bids
    a: string[][]; // Asks
    ts: number; // Timestamp
    u: number; // Update ID
}

export interface OrderBookData {
    bids: [string, string][];
    asks: [string, string][];
    spread: number;
}

interface FetchOrderBookParams {
    symbol: string;
    limit?: number;
}

export async function fetchOrderBook({ symbol, limit = 10 }: FetchOrderBookParams): Promise<OrderBookData> {
    const params = new URLSearchParams({
        category: 'linear',
        symbol,
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE}/v5/market/orderbook?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch Bybit order book data: ${response.statusText}`);
    }

    const data: BybitResponse<OrderBookResult> = await response.json();
    if (data.retCode !== 0) {
        throw new Error(`Bybit API error: ${data.retMsg}`);
    }

    const bids = data.result.b.map(d => [d[0], d[1]] as [string, string]);
    const asks = data.result.a.map(d => [d[0], d[1]] as [string, string]);
    
    const highestBid = bids.length > 0 ? parseFloat(bids[0][0]) : 0;
    const lowestAsk = asks.length > 0 ? parseFloat(asks[0][0]) : 0;

    return {
        bids,
        asks,
        spread: lowestAsk > 0 && highestBid > 0 ? lowestAsk - highestBid : 0
    };
}
