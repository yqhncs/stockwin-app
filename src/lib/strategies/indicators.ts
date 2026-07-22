/**
 * 技术指标计算库
 * 参考：MACD、RSI、KDJ、布林带、均线等经典技术指标
 */

export interface KLine {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** 简单移动平均线 (SMA) */
export function SMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return result;
}

/** 指数移动平均线 (EMA) */
export function EMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  let ema = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema = data[i];
    } else if (i < period) {
      ema = (ema * i + data[i]) / (i + 1);
    } else {
      ema = data[i] * multiplier + ema * (1 - multiplier);
    }
    result.push(ema);
  }
  return result;
}

/** MACD 指标 */
export function MACD(data: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const emaFast = EMA(data, fastPeriod);
  const emaSlow = EMA(data, slowPeriod);
  const dif: number[] = [];
  const dea: number[] = [];
  const histogram: number[] = [];

  for (let i = 0; i < data.length; i++) {
    dif.push(emaFast[i] - emaSlow[i]);
  }

  const deaRaw = EMA(dif.slice(slowPeriod - 1), signalPeriod);
  for (let i = 0; i < data.length; i++) {
    if (i < slowPeriod - 1) {
      dea.push(NaN);
      histogram.push(NaN);
    } else {
      const deaVal = deaRaw[i - (slowPeriod - 1)];
      dea.push(deaVal);
      histogram.push(2 * (dif[i] - deaVal));
    }
  }

  return { dif, dea, histogram };
}

/** RSI 相对强弱指数 */
export function RSI(data: number[], period = 14): number[] {
  const result: number[] = [];
  const changes: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      changes.push(0);
      gains.push(0);
      losses.push(0);
    } else {
      const change = data[i] - data[i - 1];
      changes.push(change);
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(NaN);
    } else {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    }
  }
  return result;
}

/** KDJ 随机指标 */
export function KDJ(klines: KLine[], period = 9): { k: number[]; d: number[]; j: number[] } {
  const k: number[] = [];
  const d: number[] = [];
  const j: number[] = [];
  let prevK = 50;
  let prevD = 50;

  for (let i = 0; i < klines.length; i++) {
    if (i < period - 1) {
      k.push(NaN);
      d.push(NaN);
      j.push(NaN);
    } else {
      const slice = klines.slice(i - period + 1, i + 1);
      const highest = Math.max(...slice.map(k => k.high));
      const lowest = Math.min(...slice.map(k => k.low));
      const close = klines[i].close;
      const rsv = lowest === highest ? 50 : ((close - lowest) / (highest - lowest)) * 100;

      const currentK = (2 / 3) * prevK + (1 / 3) * rsv;
      const currentD = (2 / 3) * prevD + (1 / 3) * currentK;
      const currentJ = 3 * currentK - 2 * currentD;

      k.push(currentK);
      d.push(currentD);
      j.push(currentJ);

      prevK = currentK;
      prevD = currentD;
    }
  }
  return { k, d, j };
}

/** 布林带 (BOLL) */
export function BOLL(data: number[], period = 20, multiplier = 2): { upper: number[]; middle: number[]; lower: number[] } {
  const middle = SMA(data, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = middle[i];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      upper.push(mean + multiplier * std);
      lower.push(mean - multiplier * std);
    }
  }
  return { upper, middle, lower };
}

/** ATR 平均真实波幅 */
export function ATR(klines: KLine[], period = 14): number[] {
  const result: number[] = [];
  const trs: number[] = [];

  for (let i = 0; i < klines.length; i++) {
    if (i === 0) {
      trs.push(klines[i].high - klines[i].low);
    } else {
      const tr = Math.max(
        klines[i].high - klines[i].low,
        Math.abs(klines[i].high - klines[i - 1].close),
        Math.abs(klines[i].low - klines[i - 1].close)
      );
      trs.push(tr);
    }
  }

  for (let i = 0; i < trs.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      result.push(trs.slice(0, period).reduce((a, b) => a + b, 0) / period);
    } else {
      result.push((result[i - 1] * (period - 1) + trs[i]) / period);
    }
  }
  return result;
}

/** 动量指标 (MOM) - N日涨幅 */
export function MOM(data: number[], period = 10): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(NaN);
    } else {
      result.push(((data[i] - data[i - period]) / data[i - period]) * 100);
    }
  }
  return result;
}

/** 成交量均线 */
export function VOL_MA(volumes: number[], period: number): number[] {
  return SMA(volumes, period);
}

/** 换手率计算（需要流通股本） */
export function turnoverRate(volume: number, floatShares: number): number {
  return (volume / floatShares) * 100;
}
