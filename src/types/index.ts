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
