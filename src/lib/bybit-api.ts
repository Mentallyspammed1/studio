'use server';

import { fetchKlineData, KlineData, fetchOrderBook, OrderBookData } from '@/services/bybitService';
import { getWalletBalance, getAccountInformation, getAssetInformation } from '@/services/bybitAccountService';

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

export { fetchKlineData, KlineData, fetchOrderBook, OrderBookData, getWalletBalance, getAccountInformation, getAssetInformation };

// Tickers
interface TickersResult {
    list: TickerData[];
}

export interface TickerData {
    symbol: string;
    lastPrice: string;
    highPrice24h: string;
    lowPrice24h: string;
    prevPrice24h: string;
    price24hPcnt: string;
    turnover24h: string;
    volume24h: string;
}

interface FetchTickersParams {
    symbol?: string;
}

export async function fetchTickers({ symbol }: FetchTickersParams = {}): Promise<TickerData[]> {
    const params = new URLSearchParams({
        category: 'linear',
    });
    if (symbol) {
        params.append('symbol', symbol);
    }

    const response = await fetch(`${API_BASE}/v5/market/tickers?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch Bybit tickers: ${response.statusText}`);
    }

    const data: BybitResponse<TickersResult> = await response.json();
    if (data.retCode !== 0) {
        throw new Error(`Bybit API error fetching tickers: ${data.retMsg}`);
    }

    return data.result.list;
}

// Public Trade History
interface PublicTradeHistoryResult {
    list: PublicTrade[];
}

export interface PublicTrade {
    execId: string;
    symbol: string;
    price: string;
    size: string;
    side: 'Buy' | 'Sell';
    time: string;
    isBlockTrade: boolean;
}

interface FetchPublicTradeHistoryParams {
    symbol: string;
    limit?: number;
}

export async function fetchPublicTradeHistory({ symbol, limit = 50 }: FetchPublicTradeHistoryParams): Promise<PublicTrade[]> {
    const params = new URLSearchParams({
        category: 'linear',
        symbol,
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE}/v5/market/recent-trade?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch Bybit public trade history: ${response.statusText}`);
    }

    const data: BybitResponse<PublicTradeHistoryResult> = await response.json();
    if (data.retCode !== 0) {
        throw new Error(`Bybit API error fetching public trade history: ${data.retMsg}`);
    }

    return data.result.list;
}
