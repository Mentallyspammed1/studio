import { GanttChartSquare, LayoutDashboard, Newspaper, ShieldCheck, TrendingUp } from "lucide-react";

export const timeframes = ['1H', '4H', '1D', '1W'];

export const dataConfig: { [key: string]: { days: number; volatility: number; initialPrice: number } } = {
  '1H': { days: 24, volatility: 200, initialPrice: 67500 },
  '4H': { days: 60, volatility: 800, initialPrice: 67500 },
  '1D': { days: 30, volatility: 1000, initialPrice: 67500 },
  '1W': { days: 52, volatility: 3000, initialPrice: 67500 },
};

export const performanceStats = {
  pnl: { label: 'Total P&L', value: 7845.89, change: 2.1 },
  winRate: { label: 'Win Rate', value: 68.4, change: -0.5 },
  totalTrades: { label: 'Total Trades', value: 152, change: 5 },
  avgTrade: { label: 'Avg. Trade P&L', value: 51.62, change: 1.2 },
};

export const tradeHistory = [
  { id: 1, pair: 'BTC/USD', type: 'Buy', amount: 0.05, pl: 250.75, date: '2024-05-20' },
  { id: 2, pair: 'ETH/USD', type: 'Sell', amount: 0.5, pl: -120.45, date: '2024-05-19' },
  { id: 3, pair: 'SOL/USD', type: 'Buy', amount: 10, pl: 310.00, date: '2024-05-19' },
  { id: 4, pair: 'BTC/USD', type: 'Sell', amount: 0.02, pl: 95.20, date: '2024-05-18' },
  { id: 5, pair: 'ADA/USD', type: 'Buy', amount: 5000, pl: -55.80, date: '2024-05-17' },
  { id: 6, pair: 'ETH/BTC', type: 'Buy', amount: 1.2, pl: 180.15, date: '2024-05-16' },
];

export const newsItems = [
  { id: 1, headline: 'Federal Reserve hints at potential rate cuts by end of year, market reacts positively.', source: 'Reuters', ticker: 'SPY' },
  { id: 2, headline: 'NVIDIA (NVDA) stock surges after announcing breakthrough in AI chip technology.', source: 'Bloomberg', ticker: 'NVDA' },
  { id: 3, headline: 'SEC delays decision on Bitcoin ETF, causing uncertainty in crypto markets.', source: 'CoinDesk', ticker: 'BTC' },
  { id: 4, headline: 'Apple (AAPL) reports lower than expected iPhone sales, stock dips in after-hours trading.', source: 'Wall Street Journal', ticker: 'AAPL' },
];

export const availableStrategies = [
  'Scalping',
  'Day Trading',
  'Swing Trading',
  'Position Trading',
  'Trend Following',
  'Mean Reversion',
];

export const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'trends', label: 'Trend Analysis', icon: TrendingUp, href: '#' },
    { id: 'positions', label: 'Positions', icon: GanttChartSquare, href: '#' },
    { id: 'risk', label: 'Risk', icon: ShieldCheck, href: '#' },
    { id: 'news', label: 'News Feed', icon: Newspaper, href: '#' },
  ];
