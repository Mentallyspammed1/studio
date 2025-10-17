import { fetchTickers, fetchPublicTradeHistory } from './bybit-api';

// Mocking fetch
global.fetch = jest.fn();

describe('Bybit API', () => {
  afterEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchTickers', () => {
    it('should fetch tickers successfully', async () => {
      const mockTickers = [
        {
          symbol: 'BTCUSDT',
          lastPrice: '30000.5',
          highPrice24h: '31000',
          lowPrice24h: '29000',
          prevPrice24h: '29500',
          price24hPcnt: '0.0169',
          turnover24h: '1000000000',
          volume24h: '33333',
        },
      ];
      const mockResponse = {
        retCode: 0,
        retMsg: 'OK',
        result: { list: mockTickers },
        retExtInfo: {},
        time: Date.now(),
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const tickers = await fetchTickers();
      expect(tickers).toEqual(mockTickers);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.bybit.com/v5/market/tickers?category=linear'
      );
    });
  });

  describe('fetchPublicTradeHistory', () => {
    it('should fetch public trade history successfully', async () => {
      const mockTrades = [
        {
          execId: '12345',
          symbol: 'BTCUSDT',
          price: '30000.5',
          size: '0.1',
          side: 'Buy',
          time: '1672531200000',
          isBlockTrade: false,
        },
      ];
      const mockResponse = {
        retCode: 0,
        retMsg: 'OK',
        result: { list: mockTrades },
        retExtInfo: {},
        time: Date.now(),
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const trades = await fetchPublicTradeHistory({ symbol: 'BTCUSDT' });
      expect(trades).toEqual(mockTrades);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.bybit.com/v5/market/recent-trade?category=linear&symbol=BTCUSDT&limit=50'
      );
    });
  });
});
