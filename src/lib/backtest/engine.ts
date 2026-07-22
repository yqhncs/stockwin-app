/**
 * 回测引擎 - 模拟历史交易并计算绩效指标
 * 参考：夏普比率、最大回撤、胜率、盈亏比等专业指标
 */

import type { KLine } from '../strategies/indicators';
import { SMA, MACD, RSI, BOLL } from '../strategies/indicators';

export interface Trade {
  date: number;
  type: 'buy' | 'sell';
  price: number;
  shares: number;
  amount: number;
  commission: number;
}

export interface BacktestResult {
  totalReturn: number;
  annualReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRate: number;
  profitFactor: number;
  trades: Trade[];
  totalTrades: number;
  avgHoldDays: number;
  finalCapital: number;
  benchmarkReturn: number;
  alpha: number;
  equityCurve: { date: number; value: number }[];
}

interface BacktestConfig {
  initialCapital: number;
  commissionRate: number;
  slippage: number;
  positionSize: number;
  stopLoss?: number;
  takeProfit?: number;
}

/** 默认回测配置 */
const defaultConfig: BacktestConfig = {
  initialCapital: 100000,
  commissionRate: 0.001,
  slippage: 0.001,
  positionSize: 0.9,
  stopLoss: 0.08,
  takeProfit: 0.2,
};

/** 均线交叉策略回测 */
export function backtestMACross(
  klines: KLine[],
  shortPeriod = 5,
  longPeriod = 20,
  config: Partial<BacktestConfig> = {}
): BacktestResult {
  const cfg = { ...defaultConfig, ...config };
  const closes = klines.map(k => k.close);
  const maShort = SMA(closes, shortPeriod);
  const maLong = SMA(closes, longPeriod);

  let capital = cfg.initialCapital;
  let shares = 0;
  let position = false;
  let entryPrice = 0;
  let entryDate = 0;
  const trades: Trade[] = [];
  const equityCurve: { date: number; value: number }[] = [];

  for (let i = longPeriod; i < klines.length; i++) {
    const price = closes[i];
    const prevIdx = i - 1;

    // 止损止盈检查
    if (position && cfg.stopLoss && cfg.takeProfit) {
      const returnRate = (price - entryPrice) / entryPrice;
      if (returnRate <= -cfg.stopLoss || returnRate >= cfg.takeProfit) {
        const sellAmount = shares * price;
        const commission = sellAmount * cfg.commissionRate;
        capital += sellAmount - commission;
        trades.push({
          date: klines[i].timestamp,
          type: 'sell',
          price,
          shares,
          amount: sellAmount,
          commission,
        });
        position = false;
        shares = 0;
      }
    }

    // 买入信号: MA短线上穿长线
    if (!position && maShort[prevIdx] <= maLong[prevIdx] && maShort[i] > maLong[i]) {
      const buyAmount = capital * cfg.positionSize;
      const priceWithSlippage = price * (1 + cfg.slippage);
      const commission = buyAmount * cfg.commissionRate;
      shares = Math.floor((buyAmount - commission) / priceWithSlippage / 100) * 100;
      if (shares > 0) {
        const actualAmount = shares * priceWithSlippage;
        capital -= actualAmount + commission;
        entryPrice = priceWithSlippage;
        entryDate = klines[i].timestamp;
        trades.push({
          date: klines[i].timestamp,
          type: 'buy',
          price: priceWithSlippage,
          shares,
          amount: actualAmount,
          commission,
        });
        position = true;
      }
    }

    // 卖出信号: MA短线下穿长线
    if (position && maShort[prevIdx] >= maLong[prevIdx] && maShort[i] < maLong[i]) {
      const sellAmount = shares * price * (1 - cfg.slippage);
      const commission = sellAmount * cfg.commissionRate;
      capital += sellAmount - commission;
      trades.push({
        date: klines[i].timestamp,
        type: 'sell',
        price: price * (1 - cfg.slippage),
        shares,
        amount: sellAmount,
        commission,
      });
      position = false;
      shares = 0;
    }

    // 记录每日净值
    const totalValue = capital + (position ? shares * price : 0);
    equityCurve.push({ date: klines[i].timestamp, value: totalValue });
  }

  // 如果最后还持仓，按最后价格平仓
  if (position && shares > 0) {
    const lastPrice = closes[closes.length - 1];
    const sellAmount = shares * lastPrice;
    const commission = sellAmount * cfg.commissionRate;
    capital += sellAmount - commission;
    trades.push({
      date: klines[klines.length - 1].timestamp,
      type: 'sell',
      price: lastPrice,
      shares,
      amount: sellAmount,
      commission,
    });
  }

  return calculateMetrics(trades, equityCurve, cfg.initialCapital, closes, klines.map(k => k.timestamp));
}

/** MACD策略回测 */
export function backtestMACD(
  klines: KLine[],
  config: Partial<BacktestConfig> = {}
): BacktestResult {
  const cfg = { ...defaultConfig, ...config };
  const closes = klines.map(k => k.close);
  const { dif, dea } = MACD(closes);

  let capital = cfg.initialCapital;
  let shares = 0;
  let position = false;
  const trades: Trade[] = [];
  const equityCurve: { date: number; value: number }[] = [];

  for (let i = 26; i < klines.length; i++) {
    const price = closes[i];
    const prevIdx = i - 1;

    // 金叉买入
    if (!position && dif[prevIdx] <= dea[prevIdx] && dif[i] > dea[i] && dif[i] < 0) {
      const buyAmount = capital * cfg.positionSize;
      const priceWithSlippage = price * (1 + cfg.slippage);
      const commission = buyAmount * cfg.commissionRate;
      shares = Math.floor((buyAmount - commission) / priceWithSlippage / 100) * 100;
      if (shares > 0) {
        const actualAmount = shares * priceWithSlippage;
        capital -= actualAmount + commission;
        trades.push({
          date: klines[i].timestamp,
          type: 'buy',
          price: priceWithSlippage,
          shares,
          amount: actualAmount,
          commission,
        });
        position = true;
      }
    }

    // 死叉卖出
    if (position && dif[prevIdx] >= dea[prevIdx] && dif[i] < dea[i]) {
      const sellAmount = shares * price * (1 - cfg.slippage);
      const commission = sellAmount * cfg.commissionRate;
      capital += sellAmount - commission;
      trades.push({
        date: klines[i].timestamp,
        type: 'sell',
        price: price * (1 - cfg.slippage),
        shares,
        amount: sellAmount,
        commission,
      });
      position = false;
      shares = 0;
    }

    const totalValue = capital + (position ? shares * price : 0);
    equityCurve.push({ date: klines[i].timestamp, value: totalValue });
  }

  if (position && shares > 0) {
    const lastPrice = closes[closes.length - 1];
    const sellAmount = shares * lastPrice;
    const commission = sellAmount * cfg.commissionRate;
    capital += sellAmount - commission;
    trades.push({
      date: klines[klines.length - 1].timestamp,
      type: 'sell',
      price: lastPrice,
      shares,
      amount: sellAmount,
      commission,
    });
  }

  return calculateMetrics(trades, equityCurve, cfg.initialCapital, closes, klines.map(k => k.timestamp));
}

/** RSI策略回测 */
export function backtestRSI(
  klines: KLine[],
  period = 14,
  oversold = 30,
  overbought = 70,
  config: Partial<BacktestConfig> = {}
): BacktestResult {
  const cfg = { ...defaultConfig, ...config };
  const closes = klines.map(k => k.close);
  const rsi = RSI(closes, period);

  let capital = cfg.initialCapital;
  let shares = 0;
  let position = false;
  const trades: Trade[] = [];
  const equityCurve: { date: number; value: number }[] = [];

  for (let i = period; i < klines.length; i++) {
    const price = closes[i];

    // RSI超卖买入
    if (!position && rsi[i] < oversold) {
      const buyAmount = capital * cfg.positionSize;
      const priceWithSlippage = price * (1 + cfg.slippage);
      const commission = buyAmount * cfg.commissionRate;
      shares = Math.floor((buyAmount - commission) / priceWithSlippage / 100) * 100;
      if (shares > 0) {
        const actualAmount = shares * priceWithSlippage;
        capital -= actualAmount + commission;
        trades.push({
          date: klines[i].timestamp,
          type: 'buy',
          price: priceWithSlippage,
          shares,
          amount: actualAmount,
          commission,
        });
        position = true;
      }
    }

    // RSI超买卖出
    if (position && rsi[i] > overbought) {
      const sellAmount = shares * price * (1 - cfg.slippage);
      const commission = sellAmount * cfg.commissionRate;
      capital += sellAmount - commission;
      trades.push({
        date: klines[i].timestamp,
        type: 'sell',
        price: price * (1 - cfg.slippage),
        shares,
        amount: sellAmount,
        commission,
      });
      position = false;
      shares = 0;
    }

    const totalValue = capital + (position ? shares * price : 0);
    equityCurve.push({ date: klines[i].timestamp, value: totalValue });
  }

  if (position && shares > 0) {
    const lastPrice = closes[closes.length - 1];
    const sellAmount = shares * lastPrice;
    capital += sellAmount - sellAmount * cfg.commissionRate;
    trades.push({
      date: klines[klines.length - 1].timestamp,
      type: 'sell',
      price: lastPrice,
      shares,
      amount: sellAmount,
      commission: sellAmount * cfg.commissionRate,
    });
  }

  return calculateMetrics(trades, equityCurve, cfg.initialCapital, closes, klines.map(k => k.timestamp));
}

/** 布林带均值回归策略回测 */
export function backtestBOLL(
  klines: KLine[],
  period = 20,
  config: Partial<BacktestConfig> = {}
): BacktestResult {
  const cfg = { ...defaultConfig, ...config };
  const closes = klines.map(k => k.close);
  const { lower, upper, middle } = BOLL(closes, period, 2);

  let capital = cfg.initialCapital;
  let shares = 0;
  let position = false;
  const trades: Trade[] = [];
  const equityCurve: { date: number; value: number }[] = [];

  for (let i = period; i < klines.length; i++) {
    const price = closes[i];

    // 跌破下轨买入
    if (!position && price < lower[i]) {
      const buyAmount = capital * cfg.positionSize;
      const priceWithSlippage = price * (1 + cfg.slippage);
      const commission = buyAmount * cfg.commissionRate;
      shares = Math.floor((buyAmount - commission) / priceWithSlippage / 100) * 100;
      if (shares > 0) {
        const actualAmount = shares * priceWithSlippage;
        capital -= actualAmount + commission;
        trades.push({
          date: klines[i].timestamp,
          type: 'buy',
          price: priceWithSlippage,
          shares,
          amount: actualAmount,
          commission,
        });
        position = true;
      }
    }

    // 回到中轨或突破上轨卖出
    if (position && (price > middle[i] || price > upper[i])) {
      const sellAmount = shares * price * (1 - cfg.slippage);
      const commission = sellAmount * cfg.commissionRate;
      capital += sellAmount - commission;
      trades.push({
        date: klines[i].timestamp,
        type: 'sell',
        price: price * (1 - cfg.slippage),
        shares,
        amount: sellAmount,
        commission,
      });
      position = false;
      shares = 0;
    }

    const totalValue = capital + (position ? shares * price : 0);
    equityCurve.push({ date: klines[i].timestamp, value: totalValue });
  }

  if (position && shares > 0) {
    const lastPrice = closes[closes.length - 1];
    const sellAmount = shares * lastPrice;
    capital += sellAmount - sellAmount * cfg.commissionRate;
    trades.push({
      date: klines[klines.length - 1].timestamp,
      type: 'sell',
      price: lastPrice,
      shares,
      amount: sellAmount,
      commission: sellAmount * cfg.commissionRate,
    });
  }

  return calculateMetrics(trades, equityCurve, cfg.initialCapital, closes, klines.map(k => k.timestamp));
}

/** 计算回测绩效指标 */
function calculateMetrics(
  trades: Trade[],
  equityCurve: { date: number; value: number }[],
  initialCapital: number,
  closes: number[],
  dates: number[]
): BacktestResult {
  const finalCapital = equityCurve.length > 0
    ? equityCurve[equityCurve.length - 1].value
    : initialCapital;

  const totalReturn = (finalCapital / initialCapital - 1) * 100;

  // 基准收益 (买入持有)
  const benchmarkReturn = closes.length > 0
    ? ((closes[closes.length - 1] / closes[0]) - 1) * 100
    : 0;

  // Alpha
  const alpha = totalReturn - benchmarkReturn;

  // 年化收益率
  const tradingDays = equityCurve.length;
  const years = tradingDays / 252;
  const annualReturn = years > 0
    ? (Math.pow(finalCapital / initialCapital, 1 / years) - 1) * 100
    : 0;

  // 日收益率序列
  const dailyReturns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    const ret = equityCurve[i].value / equityCurve[i - 1].value - 1;
    dailyReturns.push(ret);
  }

  // 夏普比率 (年化, 无风险利率2%)
  const avgReturn = dailyReturns.length > 0
    ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
    : 0;
  const stdReturn = dailyReturns.length > 1
    ? Math.sqrt(dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (dailyReturns.length - 1))
    : 0;
  const sharpeRatio = stdReturn > 0
    ? (avgReturn - 0.02 / 252) / stdReturn * Math.sqrt(252)
    : 0;

  // Sortino比率 (只惩罚下行波动)
  const downsideReturns = dailyReturns.filter(r => r < 0);
  const downsideStd = downsideReturns.length > 1
    ? Math.sqrt(downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length)
    : 0;
  const sortinoRatio = downsideStd > 0
    ? (avgReturn - 0.02 / 252) / downsideStd * Math.sqrt(252)
    : 0;

  // 最大回撤
  let maxDrawdown = 0;
  let peak = equityCurve[0]?.value || initialCapital;
  for (const point of equityCurve) {
    if (point.value > peak) peak = point.value;
    const drawdown = (point.value / peak - 1) * 100;
    if (drawdown < maxDrawdown) maxDrawdown = drawdown;
  }

  // Calmar比率
  const calmarRatio = maxDrawdown < 0 ? annualReturn / Math.abs(maxDrawdown) : 0;

  // 胜率和盈亏比
  const sellTrades = trades.filter(t => t.type === 'sell');
  const buyTrades = trades.filter(t => t.type === 'buy');
  const pairs: { profit: number }[] = [];

  for (let i = 0; i < Math.min(buyTrades.length, sellTrades.length); i++) {
    const buy = buyTrades[i];
    const sell = sellTrades[i];
    const profit = (sell.price - buy.price) * sell.shares;
    pairs.push({ profit });
  }

  const winningTrades = pairs.filter(p => p.profit > 0);
  const losingTrades = pairs.filter(p => p.profit < 0);
  const winRate = pairs.length > 0
    ? (winningTrades.length / pairs.length) * 100
    : 0;

  const totalProfit = winningTrades.reduce((sum, p) => sum + p.profit, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, p) => sum + p.profit, 0));
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;

  // 平均持仓天数
  let avgHoldDays = 0;
  for (let i = 0; i < Math.min(buyTrades.length, sellTrades.length); i++) {
    const holdDays = (sellTrades[i].date - buyTrades[i].date) / (24 * 60 * 60 * 1000);
    avgHoldDays += holdDays;
  }
  avgHoldDays = pairs.length > 0 ? avgHoldDays / pairs.length : 0;

  return {
    totalReturn,
    annualReturn,
    maxDrawdown,
    sharpeRatio,
    sortinoRatio,
    calmarRatio,
    winRate,
    profitFactor,
    trades,
    totalTrades: trades.length,
    avgHoldDays,
    finalCapital,
    benchmarkReturn,
    alpha,
    equityCurve,
  };
}

/** 运行多个策略回测对比 */
export function runMultipleBacktests(klines: KLine[]) {
  return [
    {
      name: 'MA均线交叉(5,20)',
      result: backtestMACross(klines, 5, 20),
    },
    {
      name: 'MA均线交叉(10,30)',
      result: backtestMACross(klines, 10, 30),
    },
    {
      name: 'MACD策略',
      result: backtestMACD(klines),
    },
    {
      name: 'RSI超买超卖(14,30,70)',
      result: backtestRSI(klines, 14, 30, 70),
    },
    {
      name: '布林带均值回归(20,2)',
      result: backtestBOLL(klines, 20),
    },
  ];
}
