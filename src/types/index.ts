export interface StockQuote {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
}

export interface KLineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockFundamental {
  code: string;
  name: string;
  pe: number;
  pb: number;
  eps: number;
  revenue: number;
  profit: number;
  industry: string;
  sector: string;
}

export interface SectorData {
  name: string;
  change: number;
  changePercent: number;
  leader: string;
}

export interface WatchlistItem {
  id: string;
  code: string;
  name: string;
  addedAt: string;
}

export interface AISelectResult {
  code: string;
  name: string;
  reason: string;
  score: number;
  signal?: 'buy' | 'sell' | 'hold';
  factors?: {
    value: number;
    growth: number;
    momentum: number;
    quality: number;
    volatility: number;
  };
  strategy?: string;
}

export interface StockFactorData {
  code: string;
  name: string;
  price: number;
  pe: number;
  pb: number;
  roe: number;
  revenueGrowth: number;
  profitGrowth: number;
  momentum20d: number;
  momentum60d: number;
  volatility20d: number;
  turnoverRate: number;
  volume: number;
  marketCap: number;
}

export interface BacktestMetrics {
  totalReturn: number;
  annualReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  avgHoldDays: number;
  benchmarkReturn: number;
  alpha: number;
}

export interface InvestmentReport {
  type: 'morning' | 'evening';
  date: string;
  content: string;
  summary: string;
}

export interface StrategySignal {
  code: string;
  indicator: string;
  signal: 'buy' | 'sell' | 'hold';
  value: number;
}

export interface BacktestResult {
  totalReturn: number;
  annualReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  trades: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
