import axios from 'axios';
import type { StockQuote, KLineData, StockFundamental, SectorData, AISelectResult, InvestmentReport, StrategySignal, BacktestResult } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const stockApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const stockApiService = {
  getQuotes: async (codes: string[]): Promise<StockQuote[]> => {
    try {
      const response = await stockApi.get('/stock/quotes', {
        params: { codes: codes.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get stock quotes:', error);
      return [];
    }
  },

  getKLine: async (code: string, period: string = 'daily', startDate?: string, endDate?: string): Promise<KLineData[]> => {
    try {
      const response = await stockApi.get('/stock/kline', {
        params: { code, period, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get KLine data:', error);
      return [];
    }
  },

  getFundamental: async (code: string): Promise<StockFundamental | null> => {
    try {
      const response = await stockApi.get('/stock/fundamental', {
        params: { code },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get fundamental data:', error);
      return null;
    }
  },

  getSectors: async (): Promise<SectorData[]> => {
    try {
      const response = await stockApi.get('/stock/sectors');
      return response.data;
    } catch (error) {
      console.error('Failed to get sector data:', error);
      return [];
    }
  },

  searchStock: async (keyword: string): Promise<{ code: string; name: string }[]> => {
    try {
      const response = await stockApi.get('/stock/search', {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search stock:', error);
      return [];
    }
  },

  getWatchlist: async (): Promise<{ code: string; name: string }[]> => {
    try {
      const response = await stockApi.get('/user/watchlist');
      return response.data;
    } catch (error) {
      console.error('Failed to get watchlist:', error);
      return [];
    }
  },

  addToWatchlist: async (code: string, name: string): Promise<boolean> => {
    try {
      await stockApi.post('/user/watchlist', { code, name });
      return true;
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      return false;
    }
  },

  removeFromWatchlist: async (code: string): Promise<boolean> => {
    try {
      await stockApi.delete(`/user/watchlist/${code}`);
      return true;
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      return false;
    }
  },

  aiSelect: async (query: string): Promise<AISelectResult[]> => {
    try {
      const response = await stockApi.post('/ai/select', { query });
      return response.data;
    } catch (error) {
      console.error('AI select failed:', error);
      return [];
    }
  },

  getInvestmentReport: async (type: 'morning' | 'evening'): Promise<InvestmentReport | null> => {
    try {
      const response = await stockApi.get('/ai/report', {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get investment report:', error);
      return null;
    }
  },

  getHotspots: async (): Promise<{ name: string; reason: string; stocks: string[] }[]> => {
    try {
      const response = await stockApi.get('/ai/hotspots');
      return response.data;
    } catch (error) {
      console.error('Failed to get hotspots:', error);
      return [];
    }
  },

  getSignals: async (code: string, indicators: string[]): Promise<StrategySignal[]> => {
    try {
      const response = await stockApi.get('/strategy/signals', {
        params: { code, indicators: indicators.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get signals:', error);
      return [];
    }
  },

  backtest: async (strategy: string, params: Record<string, number>, code: string, period: string): Promise<BacktestResult | null> => {
    try {
      const response = await stockApi.post('/strategy/backtest', {
        strategy,
        params,
        code,
        period,
      });
      return response.data;
    } catch (error) {
      console.error('Backtest failed:', error);
      return null;
    }
  },
};

export const mockStockApi = {
  getQuotes: (codes: string[]): Promise<StockQuote[]> => {
    const mockData: Record<string, StockQuote> = {
      '600519': {
        code: '600519',
        name: '贵州茅台',
        price: 1680.00,
        change: 25.50,
        changePercent: 1.54,
        open: 1654.50,
        high: 1688.00,
        low: 1650.00,
        volume: 2856000,
        amount: 4800000000,
      },
      '000001': {
        code: '000001',
        name: '平安银行',
        price: 12.35,
        change: -0.18,
        changePercent: -1.44,
        open: 12.53,
        high: 12.58,
        low: 12.28,
        volume: 156800000,
        amount: 1930000000,
      },
      '000858': {
        code: '000858',
        name: '五粮液',
        price: 145.80,
        change: 3.20,
        changePercent: 2.24,
        open: 142.60,
        high: 146.50,
        low: 142.00,
        volume: 8950000,
        amount: 1300000000,
      },
      '601318': {
        code: '601318',
        name: '中国平安',
        price: 48.50,
        change: -0.50,
        changePercent: -1.02,
        open: 49.00,
        high: 49.20,
        low: 48.30,
        volume: 45600000,
        amount: 2210000000,
      },
      '002594': {
        code: '002594',
        name: '比亚迪',
        price: 268.50,
        change: 8.50,
        changePercent: 3.26,
        open: 260.00,
        high: 270.00,
        low: 259.50,
        volume: 12300000,
        amount: 3300000000,
      },
      '300750': {
        code: '300750',
        name: '宁德时代',
        price: 215.00,
        change: 5.20,
        changePercent: 2.48,
        open: 210.00,
        high: 218.00,
        low: 209.00,
        volume: 15600000,
        amount: 3350000000,
      },
      '600036': {
        code: '600036',
        name: '招商银行',
        price: 35.80,
        change: 0.30,
        changePercent: 0.85,
        open: 35.50,
        high: 36.00,
        low: 35.40,
        volume: 89000000,
        amount: 3180000000,
      },
      '000333': {
        code: '000333',
        name: '美的集团',
        price: 68.50,
        change: 1.20,
        changePercent: 1.78,
        open: 67.30,
        high: 69.00,
        low: 67.10,
        volume: 23400000,
        amount: 1600000000,
      },
      '601012': {
        code: '601012',
        name: '隆基绿能',
        price: 22.30,
        change: -0.40,
        changePercent: -1.76,
        open: 22.70,
        high: 22.80,
        low: 22.10,
        volume: 67000000,
        amount: 1490000000,
      },
      '002475': {
        code: '002475',
        name: '立讯精密',
        price: 38.60,
        change: 0.80,
        changePercent: 2.12,
        open: 37.80,
        high: 39.00,
        low: 37.50,
        volume: 34500000,
        amount: 1320000000,
      },
      '600276': {
        code: '600276',
        name: '恒瑞医药',
        price: 45.20,
        change: 0.50,
        changePercent: 1.12,
        open: 44.70,
        high: 45.50,
        low: 44.60,
        volume: 28000000,
        amount: 1260000000,
      },
      '000725': {
        code: '000725',
        name: '京东方A',
        price: 4.15,
        change: 0.05,
        changePercent: 1.22,
        open: 4.10,
        high: 4.18,
        low: 4.08,
        volume: 234000000,
        amount: 970000000,
      },
      '603259': {
        code: '603259',
        name: '药明康德',
        price: 58.30,
        change: -1.20,
        changePercent: -2.02,
        open: 59.50,
        high: 59.80,
        low: 58.00,
        volume: 18900000,
        amount: 1100000000,
      },
      '300059': {
        code: '300059',
        name: '东方财富',
        price: 14.80,
        change: 0.30,
        changePercent: 2.07,
        open: 14.50,
        high: 14.90,
        low: 14.40,
        volume: 178000000,
        amount: 2630000000,
      },
    };

    return Promise.resolve(codes.map(code => mockData[code] || {
      code,
      name: '未知股票',
      price: 0,
      change: 0,
      changePercent: 0,
      open: 0,
      high: 0,
      low: 0,
      volume: 0,
      amount: 0,
    }));
  },

  getKLine: (code: string, period: string = 'daily'): Promise<KLineData[]> => {
    const data: KLineData[] = [];
    const now = Date.now();
    let basePrice = 150;

    for (let i = 90; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60 * 1000;
      const change = (Math.random() - 0.48) * 8;
      const open = basePrice + (Math.random() - 0.5) * 4;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.floor(Math.random() * 5000000 + 1000000);

      data.push({ timestamp, open, high, low, close, volume });
      basePrice = close;
    }

    return Promise.resolve(data);
  },

  getFundamental: (code: string): Promise<StockFundamental | null> => {
    const fundamentals: Record<string, StockFundamental> = {
      '600519': {
        code: '600519',
        name: '贵州茅台',
        pe: 28.5,
        pb: 6.2,
        eps: 58.8,
        revenue: 158000000000,
        profit: 75000000000,
        industry: '白酒',
        sector: '消费',
      },
      '000001': {
        code: '000001',
        name: '平安银行',
        pe: 5.2,
        pb: 0.65,
        eps: 2.38,
        revenue: 165000000000,
        profit: 45500000000,
        industry: '银行',
        sector: '金融',
      },
      '000858': {
        code: '000858',
        name: '五粮液',
        pe: 22.8,
        pb: 4.5,
        eps: 6.4,
        revenue: 83000000000,
        profit: 30000000000,
        industry: '白酒',
        sector: '消费',
      },
      '601318': {
        code: '601318',
        name: '中国平安',
        pe: 8.5,
        pb: 0.85,
        eps: 5.7,
        revenue: 1210000000000,
        profit: 85600000000,
        industry: '保险',
        sector: '金融',
      },
      '002594': {
        code: '002594',
        name: '比亚迪',
        pe: 35.2,
        pb: 5.8,
        eps: 7.6,
        revenue: 680000000000,
        profit: 17000000000,
        industry: '新能源汽车',
        sector: '新能源',
      },
      '300750': {
        code: '300750',
        name: '宁德时代',
        pe: 30.5,
        pb: 8.2,
        eps: 7.1,
        revenue: 400000000000,
        profit: 44100000000,
        industry: '动力电池',
        sector: '新能源',
      },
      '600036': {
        code: '600036',
        name: '招商银行',
        pe: 6.8,
        pb: 1.05,
        eps: 5.3,
        revenue: 340000000000,
        profit: 148000000000,
        industry: '银行',
        sector: '金融',
      },
      '000333': {
        code: '000333',
        name: '美的集团',
        pe: 12.5,
        pb: 2.8,
        eps: 5.5,
        revenue: 345000000000,
        profit: 33000000000,
        industry: '家电',
        sector: '消费',
      },
      '601012': {
        code: '601012',
        name: '隆基绿能',
        pe: 18.5,
        pb: 2.2,
        eps: 1.2,
        revenue: 128000000000,
        profit: 12000000000,
        industry: '光伏',
        sector: '新能源',
      },
      '002475': {
        code: '002475',
        name: '立讯精密',
        pe: 25.8,
        pb: 6.5,
        eps: 1.5,
        revenue: 230000000000,
        profit: 11000000000,
        industry: '消费电子',
        sector: '科技',
      },
      '600276': {
        code: '600276',
        name: '恒瑞医药',
        pe: 45.2,
        pb: 7.5,
        eps: 1.0,
        revenue: 230000000000,
        profit: 45000000000,
        industry: '医药',
        sector: '医药',
      },
      '000725': {
        code: '000725',
        name: '京东方A',
        pe: 38.5,
        pb: 1.8,
        eps: 0.11,
        revenue: 170000000000,
        profit: 4500000000,
        industry: '半导体显示',
        sector: '科技',
      },
      '603259': {
        code: '603259',
        name: '药明康德',
        pe: 32.5,
        pb: 4.2,
        eps: 1.8,
        revenue: 410000000000,
        profit: 96000000000,
        industry: '医药研发',
        sector: '医药',
      },
      '300059': {
        code: '300059',
        name: '东方财富',
        pe: 22.8,
        pb: 3.5,
        eps: 0.65,
        revenue: 120000000000,
        profit: 81000000000,
        industry: '证券',
        sector: '金融',
      },
    };

    return Promise.resolve(fundamentals[code] || null);
  },

  getSectors: (): Promise<SectorData[]> => {
    return Promise.resolve([
      { name: '半导体', change: 5.23, changePercent: 2.34, leader: '北方华创' },
      { name: '新能源', change: 3.12, changePercent: 1.56, leader: '宁德时代' },
      { name: '白酒', change: -1.25, changePercent: -0.85, leader: '贵州茅台' },
      { name: '医药', change: 2.88, changePercent: 1.23, leader: '恒瑞医药' },
      { name: '金融', change: -0.56, changePercent: -0.35, leader: '招商银行' },
    ]);
  },

  searchStock: (keyword: string): Promise<{ code: string; name: string }[]> => {
    const stocks = [
      { code: '600519', name: '贵州茅台' },
      { code: '000001', name: '平安银行' },
      { code: '000858', name: '五粮液' },
      { code: '601318', name: '中国平安' },
      { code: '002594', name: '比亚迪' },
      { code: '300750', name: '宁德时代' },
      { code: '600036', name: '招商银行' },
      { code: '000333', name: '美的集团' },
      { code: '601012', name: '隆基绿能' },
      { code: '002475', name: '立讯精密' },
      { code: '600276', name: '恒瑞医药' },
      { code: '000725', name: '京东方A' },
      { code: '603259', name: '药明康德' },
      { code: '300059', name: '东方财富' },
    ];

    return Promise.resolve(stocks.filter(s =>
      s.name.includes(keyword) || s.code.includes(keyword)
    ));
  },

  getWatchlist: (): Promise<{ code: string; name: string }[]> => {
    return Promise.resolve([
      { code: '600519', name: '贵州茅台' },
      { code: '002594', name: '比亚迪' },
      { code: '300750', name: '宁德时代' },
    ]);
  },

  aiSelect: (query: string): Promise<AISelectResult[]> => {
    return Promise.resolve([
      { code: '600519', name: '贵州茅台', reason: '业绩稳健增长，估值合理', score: 92 },
      { code: '002594', name: '比亚迪', reason: '新能源龙头，技术领先', score: 88 },
      { code: '300750', name: '宁德时代', reason: '动力电池领导者，增长强劲', score: 85 },
    ]);
  },

  getInvestmentReport: (type: 'morning' | 'evening'): Promise<InvestmentReport | null> => {
    const reports: Record<string, InvestmentReport> = {
      morning: {
        type: 'morning',
        date: new Date().toISOString().split('T')[0],
        content: `## 今日早评\n\n### 大盘展望\n今日A股市场有望延续震荡上行态势。隔夜美股小幅收涨，纳指创历史新高，提振市场风险偏好。\n\n### 热点板块\n1. **半导体板块**：受AI需求持续增长带动，半导体设备和芯片设计公司有望继续走强\n2. **新能源板块**：政策持续支持，新能源汽车销量数据亮眼\n3. **消费板块**：中秋国庆双节临近，消费复苏预期增强\n\n### 操作建议\n- 短期关注业绩预增个股\n- 控制仓位，做好风险对冲\n- 关注北向资金动向`,
        summary: '今日市场整体偏暖，建议关注半导体、新能源板块机会。',
      },
      evening: {
        type: 'evening',
        date: new Date().toISOString().split('T')[0],
        content: `## 今日收评\n\n### 大盘回顾\n今日上证指数收涨0.85%，报3256.88点；深证成指收涨1.23%，报10589.67点；创业板指收涨1.56%，报2186.45点。\n\n### 资金流向\n- 北向资金净流入85.6亿\n- 主力资金净流入125.3亿\n\n### 领涨板块\n1. 半导体：+5.23%\n2. 新能源：+3.12%\n3. 医药：+2.88%\n\n### 明日展望\n市场情绪转暖，有望继续上攻。建议关注科技股和消费股的轮动机会。`,
        summary: '今日市场放量上涨，北向资金大幅流入，明日有望继续冲高。',
      },
    };

    return Promise.resolve(reports[type]);
  },

  getHotspots: (): Promise<{ name: string; reason: string; stocks: string[] }[]> => {
    return Promise.resolve([
      { name: 'AI芯片', reason: '英伟达发布新款芯片，行业需求持续增长', stocks: ['中芯国际', '北方华创', '兆易创新'] },
      { name: '新能源汽车', reason: '8月销量同比增长50%，市场份额持续提升', stocks: ['比亚迪', '宁德时代', '长安汽车'] },
      { name: '消费复苏', reason: '中秋国庆消费旺季来临，零售数据好转', stocks: ['贵州茅台', '五粮液', '格力电器'] },
    ]);
  },

  getSignals: (code: string, indicators: string[]): Promise<StrategySignal[]> => {
    return Promise.resolve([
      { code, indicator: 'MA', signal: 'buy', value: 52.3 },
      { code, indicator: 'MACD', signal: 'buy', value: 12.5 },
      { code, indicator: 'RSI', signal: 'hold', value: 65.2 },
      { code, indicator: 'KDJ', signal: 'buy', value: 45.8 },
    ]);
  },

  backtest: (strategy: string, params: Record<string, number>, code: string, period: string): Promise<BacktestResult | null> => {
    return Promise.resolve({
      totalReturn: 28.5,
      annualReturn: 15.2,
      maxDrawdown: 12.8,
      sharpeRatio: 1.85,
      winRate: 62.5,
      trades: 45,
    });
  },
};
