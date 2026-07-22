import { create } from 'zustand';
import type { StockQuote, KLineData, SectorData, WatchlistItem, AISelectResult, InvestmentReport, StrategySignal, BacktestResult } from '@/types';
import { mockStockApi } from '@/api/stock';

interface StockStore {
  quotes: StockQuote[];
  klineData: KLineData[];
  sectors: SectorData[];
  watchlist: WatchlistItem[];
  aiResults: AISelectResult[];
  investmentReport: InvestmentReport | null;
  hotspots: { name: string; reason: string; stocks: string[] }[];
  signals: StrategySignal[];
  backtestResult: BacktestResult | null;
  selectedStock: string;
  isLoading: boolean;

  setSelectedStock: (code: string) => void;
  fetchQuotes: (codes: string[]) => Promise<void>;
  fetchKLine: (code: string, period?: string) => Promise<void>;
  fetchSectors: () => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  addToWatchlist: (code: string, name: string) => void;
  removeFromWatchlist: (code: string) => void;
  aiSelect: (query: string) => Promise<void>;
  fetchInvestmentReport: (type: 'morning' | 'evening') => Promise<void>;
  fetchHotspots: () => Promise<void>;
  fetchSignals: (code: string, indicators: string[]) => Promise<void>;
  runBacktest: (strategy: string, params: Record<string, number>, code: string, period: string) => Promise<void>;
}

export const useStockStore = create<StockStore>((set) => ({
  quotes: [],
  klineData: [],
  sectors: [],
  watchlist: [],
  aiResults: [],
  investmentReport: null,
  hotspots: [],
  signals: [],
  backtestResult: null,
  selectedStock: '600519',
  isLoading: false,

  setSelectedStock: (code) => set({ selectedStock: code }),

  fetchQuotes: async (codes) => {
    set({ isLoading: true });
    const data = await mockStockApi.getQuotes(codes);
    set({ quotes: data, isLoading: false });
  },

  fetchKLine: async (code, period = 'daily') => {
    set({ isLoading: true });
    const data = await mockStockApi.getKLine(code, period);
    set({ klineData: data, isLoading: false });
  },

  fetchSectors: async () => {
    const data = await mockStockApi.getSectors();
    set({ sectors: data });
  },

  fetchWatchlist: async () => {
    const data = await mockStockApi.getWatchlist();
    const watchlist: WatchlistItem[] = data.map((item, index) => ({
      id: String(index),
      code: item.code,
      name: item.name,
      addedAt: new Date().toISOString(),
    }));
    set({ watchlist });
  },

  addToWatchlist: (code, name) => {
    set((state) => ({
      watchlist: [...state.watchlist, {
        id: String(Date.now()),
        code,
        name,
        addedAt: new Date().toISOString(),
      }],
    }));
  },

  removeFromWatchlist: (code) => {
    set((state) => ({
      watchlist: state.watchlist.filter(item => item.code !== code),
    }));
  },

  aiSelect: async (query) => {
    set({ isLoading: true });
    const data = await mockStockApi.aiSelect(query);
    set({ aiResults: data, isLoading: false });
  },

  fetchInvestmentReport: async (type) => {
    set({ isLoading: true });
    const data = await mockStockApi.getInvestmentReport(type);
    set({ investmentReport: data, isLoading: false });
  },

  fetchHotspots: async () => {
    const data = await mockStockApi.getHotspots();
    set({ hotspots: data });
  },

  fetchSignals: async (code, indicators) => {
    set({ isLoading: true });
    const data = await mockStockApi.getSignals(code, indicators);
    set({ signals: data, isLoading: false });
  },

  runBacktest: async (strategy, params, code, period) => {
    set({ isLoading: true });
    const data = await mockStockApi.backtest(strategy, params, code, period);
    set({ backtestResult: data, isLoading: false });
  },
}));
