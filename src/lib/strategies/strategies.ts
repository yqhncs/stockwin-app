/**
 * 选股策略库
 * 基于网上学习的真实策略实现
 * 参考：多因子模型、动量策略、均值回归、技术指标组合
 */

import { KLine, SMA, EMA, MACD, RSI, KDJ, BOLL, ATR, MOM } from './indicators';

export interface StockFactor {
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

export interface StrategyResult {
  code: string;
  name: string;
  score: number;
  signal: 'buy' | 'sell' | 'hold';
  reason: string;
  factors: {
    value: number;
    growth: number;
    momentum: number;
    quality: number;
    volatility: number;
  };
}

/** 策略1: 多因子价值成长模型 */
export function multiFactorValueGrowth(stocks: StockFactor[]): StrategyResult[] {
  return stocks.map(stock => {
    let score = 0;
    const factors = {
      value: 0,
      growth: 0,
      momentum: 0,
      quality: 0,
      volatility: 0,
    };

    // 价值因子 (PE 0-30 加分, PB 越低越好)
    if (stock.pe > 0 && stock.pe < 15) {
      factors.value = 30;
      score += 30;
    } else if (stock.pe >= 15 && stock.pe < 30) {
      factors.value = 20;
      score += 20;
    } else if (stock.pe >= 30 && stock.pe < 50) {
      factors.value = 10;
      score += 10;
    }
    if (stock.pb > 0 && stock.pb < 2) {
      factors.value += 10;
      score += 10;
    }

    // 成长因子 (营收和利润增长率)
    if (stock.revenueGrowth > 20) {
      factors.growth = 25;
      score += 25;
    } else if (stock.revenueGrowth > 10) {
      factors.growth = 15;
      score += 15;
    }
    if (stock.profitGrowth > 30) {
      factors.growth += 15;
      score += 15;
    } else if (stock.profitGrowth > 15) {
      factors.growth += 10;
      score += 10;
    }

    // 动量因子 (60日涨幅前20%加分)
    if (stock.momentum60d > 20) {
      factors.momentum = 20;
      score += 20;
    } else if (stock.momentum60d > 10) {
      factors.momentum = 12;
      score += 12;
    } else if (stock.momentum60d > 0) {
      factors.momentum = 5;
      score += 5;
    }

    // 质量因子 (ROE > 15% 为优质)
    if (stock.roe > 20) {
      factors.quality = 20;
      score += 20;
    } else if (stock.roe > 15) {
      factors.quality = 15;
      score += 15;
    } else if (stock.roe > 10) {
      factors.quality = 8;
      score += 8;
    }

    // 波动率因子 (低波动加分, 提高夏普比率)
    if (stock.volatility20d < 0.02) {
      factors.volatility = 10;
      score += 10;
    } else if (stock.volatility20d < 0.03) {
      factors.volatility = 5;
      score += 5;
    }

    const signal: 'buy' | 'sell' | 'hold' = score >= 70 ? 'buy' : score >= 40 ? 'hold' : 'sell';

    const reasons: string[] = [];
    if (factors.value >= 30) reasons.push('估值偏低');
    if (factors.growth >= 25) reasons.push('高增长');
    if (factors.momentum >= 20) reasons.push('动量强劲');
    if (factors.quality >= 15) reasons.push('盈利能力强');
    if (factors.volatility >= 10) reasons.push('波动率低');

    return {
      code: stock.code,
      name: stock.name,
      score,
      signal,
      reason: reasons.length > 0 ? reasons.join('，') : '综合因子一般',
      factors,
    };
  }).sort((a, b) => b.score - a.score);
}

/** 策略2: 动量突破策略 */
export function momentumBreakout(stocks: StockFactor[]): StrategyResult[] {
  return stocks.map(stock => {
    let score = 0;
    const factors = {
      value: 0,
      growth: 0,
      momentum: 0,
      quality: 0,
      volatility: 0,
    };

    // 60日动量为主因子
    if (stock.momentum60d > 30) {
      factors.momentum = 40;
      score += 40;
    } else if (stock.momentum60d > 15) {
      factors.momentum = 25;
      score += 25;
    } else if (stock.momentum60d > 5) {
      factors.momentum = 10;
      score += 10;
    }

    // 20日动量为辅
    if (stock.momentum20d > 10) {
      factors.momentum += 15;
      score += 15;
    } else if (stock.momentum20d > 5) {
      factors.momentum += 8;
      score += 8;
    }

    // 换手率验证 (3%-15%为活跃健康)
    if (stock.turnoverRate >= 3 && stock.turnoverRate <= 15) {
      score += 15;
    }

    // 成交量放大
    if (stock.volume > 5000000) {
      score += 10;
    }

    // 过滤高估值 (PE > 100 风险大)
    if (stock.pe > 0 && stock.pe < 50) {
      factors.value = 10;
      score += 10;
    }

    // 低波动加分
    if (stock.volatility20d < 0.04) {
      factors.volatility = 10;
      score += 10;
    }

    const signal: 'buy' | 'sell' | 'hold' = score >= 60 ? 'buy' : score >= 30 ? 'hold' : 'sell';

    return {
      code: stock.code,
      name: stock.name,
      score,
      signal,
      reason: stock.momentum60d > 15 ? '动量突破，趋势向上' : '动量不足',
      factors,
    };
  }).sort((a, b) => b.score - a.score);
}

/** 策略3: 技术指标信号策略 (基于K线数据) */
export function technicalSignal(
  klines: KLine[],
  stockCode: string,
  stockName: string
): StrategyResult {
  const closes = klines.map(k => k.close);
  const ma5 = SMA(closes, 5);
  const ma10 = SMA(closes, 10);
  const ma20 = SMA(closes, 20);
  const ma60 = SMA(closes, 60);
  const { dif, dea } = MACD(closes);
  const rsi = RSI(closes, 14);
  const { k, d, j } = KDJ(klines, 9);
  const { upper, middle, lower } = BOLL(closes, 20, 2);
  const mom = MOM(closes, 20);

  const lastIdx = klines.length - 1;
  const prevIdx = lastIdx - 1;
  let score = 0;
  const signals: string[] = [];
  const factors = {
    value: 0,
    growth: 0,
    momentum: 0,
    quality: 0,
    volatility: 0,
  };

  // 均线多头排列 (MA5 > MA10 > MA20 > MA60)
  if (ma5[lastIdx] > ma10[lastIdx] && ma10[lastIdx] > ma20[lastIdx]) {
    score += 20;
    factors.momentum += 20;
    signals.push('均线多头排列');
  }

  // 金叉信号 (MA5上穿MA10)
  if (ma5[prevIdx] <= ma10[prevIdx] && ma5[lastIdx] > ma10[lastIdx]) {
    score += 15;
    signals.push('MA5金叉');
  }

  // MACD金叉
  if (dif[prevIdx] <= dea[prevIdx] && dif[lastIdx] > dea[lastIdx]) {
    score += 15;
    signals.push('MACD金叉');
  }

  // MACD柱状图放大
  if (dif[lastIdx] > dea[lastIdx] && dif[lastIdx] > 0) {
    score += 10;
    signals.push('MACD多头');
  }

  // RSI超卖反弹
  if (rsi[lastIdx] < 30) {
    score += 15;
    signals.push('RSI超卖');
  } else if (rsi[lastIdx] > 70) {
    score -= 10;
    signals.push('RSI超买');
  }

  // KDJ金叉 (J线上穿K线)
  if (j[prevIdx] <= k[prevIdx] && j[lastIdx] > k[lastIdx] && j[lastIdx] < 50) {
    score += 15;
    signals.push('KDJ低位金叉');
  }

  // 布林带下轨反弹
  if (closes[lastIdx] < lower[lastIdx]) {
    score += 15;
    signals.push('跌破布林下轨(超跌)');
  } else if (closes[lastIdx] > upper[lastIdx]) {
    score -= 5;
    signals.push('突破布林上轨(超涨)');
  }

  // 动量为正
  if (mom[lastIdx] > 0) {
    factors.momentum += 10;
    score += 10;
  }

  const signal: 'buy' | 'sell' | 'hold' =
    score >= 50 ? 'buy' : score >= 20 ? 'hold' : 'sell';

  return {
    code: stockCode,
    name: stockName,
    score: Math.min(100, Math.max(0, score + 30)),
    signal,
    reason: signals.length > 0 ? signals.join('，') : '技术指标信号一般',
    factors,
  };
}

/** 策略4: GARP策略 (合理价格成长) */
export function garpStrategy(stocks: StockFactor[]): StrategyResult[] {
  return stocks
    .filter(s => s.pe > 0 && s.pe < 50)
    .map(stock => {
      let score = 0;
      const factors = {
        value: 0,
        growth: 0,
        momentum: 0,
        quality: 0,
        volatility: 0,
      };

      // PEG = PE / 利润增长率，PEG < 1 为低估
      const peg = stock.pe / Math.max(1, stock.profitGrowth);

      if (peg < 0.5) {
        factors.value = 30;
        factors.growth = 30;
        score += 60;
      } else if (peg < 1) {
        factors.value = 20;
        factors.growth = 20;
        score += 40;
      } else if (peg < 1.5) {
        factors.value = 10;
        factors.growth = 10;
        score += 20;
      }

      // ROE > 15% 质量加分
      if (stock.roe > 15) {
        factors.quality = 15;
        score += 15;
      }

      // 动量辅助
      if (stock.momentum60d > 0) {
        factors.momentum = 10;
        score += 10;
      }

      // 低波动
      if (stock.volatility20d < 0.03) {
        factors.volatility = 10;
        score += 10;
      }

      const signal: 'buy' | 'sell' | 'hold' = score >= 60 ? 'buy' : score >= 30 ? 'hold' : 'sell';

      return {
        code: stock.code,
        name: stock.name,
        score,
        signal,
        reason: peg < 1 ? `PEG=${peg.toFixed(2)}，成长性被低估` : `PEG=${peg.toFixed(2)}，估值合理`,
        factors,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/** 策略5: 小盘价值策略 */
export function smallCapValue(stocks: StockFactor[]): StrategyResult[] {
  return stocks
    .filter(s => s.marketCap < 50000000000)
    .map(stock => {
      let score = 0;
      const factors = {
        value: 0,
        growth: 0,
        momentum: 0,
        quality: 0,
        volatility: 0,
      };

      // 小市值加分 (A股小市值溢价效应)
      if (stock.marketCap < 10000000000) {
        score += 20;
      } else if (stock.marketCap < 20000000000) {
        score += 15;
      } else {
        score += 10;
      }

      // 低估值
      if (stock.pb > 0 && stock.pb < 1.5) {
        factors.value = 20;
        score += 20;
      } else if (stock.pb < 3) {
        factors.value = 10;
        score += 10;
      }

      // 盈利为正
      if (stock.roe > 10) {
        factors.quality = 15;
        score += 15;
      }

      // 反转因子 (近期下跌的股票可能反弹)
      if (stock.momentum20d < -5 && stock.momentum60d > 0) {
        factors.momentum = 15;
        score += 15;
        // 短期回调但中期趋势向上
      }

      // 低换手率 (避免过度投机)
      if (stock.turnoverRate < 10) {
        score += 10;
      }

      // 低波动
      if (stock.volatility20d < 0.04) {
        factors.volatility = 10;
        score += 10;
      }

      const signal: 'buy' | 'sell' | 'hold' = score >= 55 ? 'buy' : score >= 30 ? 'hold' : 'sell';

      return {
        code: stock.code,
        name: stock.name,
        score,
        signal,
        reason: '小盘价值：低估值+小市值+盈利稳定',
        factors,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export const strategyList = [
  { id: 'multi_factor', name: '多因子价值成长', desc: '价值+成长+动量+质量+波动率五因子综合打分' },
  { id: 'momentum', name: '动量突破策略', desc: '选择60日动量最强的股票，趋势跟踪' },
  { id: 'garp', name: 'GARP合理价格成长', desc: 'PEG指标选股，寻找成长性被低估的股票' },
  { id: 'small_cap_value', name: '小盘价值策略', desc: '小市值+低估值+盈利稳定，A股小市值溢价' },
  { id: 'technical', name: '技术指标信号', desc: 'MA/MACD/RSI/KDJ/BOLL多指标组合信号' },
];
