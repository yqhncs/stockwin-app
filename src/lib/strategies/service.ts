/**
 * 策略服务层 - 连接策略引擎与股票数据
 * 提供选股和回测的统一接口
 */

import type { AISelectResult, StockFactorData, KLineData } from '@/types';
import {
  multiFactorValueGrowth,
  momentumBreakout,
  garpStrategy,
  smallCapValue,
  technicalSignal,
  strategyList,
} from '@/lib/strategies/strategies';
import type { StockFactor, StrategyResult } from '@/lib/strategies/strategies';
import {
  backtestMACross,
  backtestMACD,
  backtestRSI,
  backtestBOLL,
  runMultipleBacktests,
} from '@/lib/backtest/engine';
import type { BacktestResult as EngineBacktestResult } from '@/lib/backtest/engine';
import { mockStockApi } from '@/api/stock';

/**
 * 生成股票因子数据（基于基本面+行情数据）
 */
async function generateStockFactors(codes: string[]): Promise<StockFactor[]> {
  const quotes = await mockStockApi.getQuotes(codes);
  const factors: StockFactor[] = [];

  for (const quote of quotes) {
    const fundamental = await mockStockApi.getFundamental(quote.code);
    if (!fundamental) continue;

    // 生成模拟的因子数据（真实环境应从数据源获取）
    const baseROE = fundamental.eps > 0 ? (fundamental.eps / fundamental.pb) * 10 : 15;
    const roe = Math.max(5, Math.min(35, baseROE + (Math.random() - 0.5) * 10));

    // 基于价格生成动量
    const momentum20d = (Math.random() - 0.4) * 20;
    const momentum60d = (Math.random() - 0.35) * 40;

    // 波动率 (2%-6%)
    const volatility20d = 0.02 + Math.random() * 0.04;

    // 换手率 (1%-15%)
    const turnoverRate = 1 + Math.random() * 14;

    // 营收增长率 (基于行业)
    const revenueGrowth = Math.random() * 40 - 5;
    const profitGrowth = revenueGrowth + (Math.random() - 0.4) * 20;

    // 市值 (基于价格和股本的模拟)
    const shares = 100000000 + Math.random() * 9000000000;
    const marketCap = quote.price * shares;

    factors.push({
      code: quote.code,
      name: quote.name,
      price: quote.price,
      pe: fundamental.pe,
      pb: fundamental.pb,
      roe,
      revenueGrowth,
      profitGrowth,
      momentum20d,
      momentum60d,
      volatility20d,
      turnoverRate,
      volume: quote.volume,
      marketCap,
    });
  }

  return factors;
}

/**
 * 运行选股策略
 */
export async function runSelectStrategy(
  strategyId: string,
  stockCodes?: string[]
): Promise<AISelectResult[]> {
  const codes = stockCodes || [
    '600519', '000001', '000858', '601318', '002594',
    '300750', '600036', '000333', '601012', '002475',
    '600276', '000725', '603259', '300059', '002241',
  ];

  const factors = await generateStockFactors(codes);
  let results: StrategyResult[] = [];

  switch (strategyId) {
    case 'multi_factor':
      results = multiFactorValueGrowth(factors);
      break;
    case 'momentum':
      results = momentumBreakout(factors);
      break;
    case 'garp':
      results = garpStrategy(factors);
      break;
    case 'small_cap_value':
      results = smallCapValue(factors);
      break;
    case 'technical':
      // 技术指标策略需要K线数据
      const klinePromises = factors.slice(0, 5).map(async f => {
        const klines = await mockStockApi.getKLine(f.code, 'daily');
        return technicalSignal(klines as any, f.code, f.name);
      });
      const techResults = await Promise.all(klinePromises);
      results = techResults;
      break;
    default:
      results = multiFactorValueGrowth(factors);
  }

  // 转换为AISelectResult格式
  return results.slice(0, 10).map(r => ({
    code: r.code,
    name: r.name,
    reason: r.reason,
    score: r.score,
    signal: r.signal,
    factors: r.factors,
    strategy: strategyId,
  }));
}

/**
 * 运行回测
 */
export async function runBacktest(
  strategy: string,
  stockCode: string,
  params?: Record<string, number>
): Promise<EngineBacktestResult> {
  const klines = await mockStockApi.getKLine(stockCode, 'daily');

  switch (strategy) {
    case 'ma_cross':
      return backtestMACross(
        klines as any,
        params?.shortPeriod || 5,
        params?.longPeriod || 20
      );
    case 'macd':
      return backtestMACD(klines as any);
    case 'rsi':
      return backtestRSI(
        klines as any,
        params?.period || 14,
        params?.oversold || 30,
        params?.overbought || 70
      );
    case 'boll':
      return backtestBOLL(klines as any, params?.period || 20);
    default:
      return backtestMACross(klines as any, 5, 20);
  }
}

/**
 * 运行多策略对比回测
 */
export async function runStrategyComparison(stockCode: string) {
  const klines = await mockStockApi.getKLine(stockCode, 'daily');
  return runMultipleBacktests(klines as any);
}

export { strategyList };
