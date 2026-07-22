import { useState } from 'react';
import { BarChart3, Play, Settings, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { useStockStore } from '@/stores/stockStore';

export function Strategy() {
  const [selectedStrategy, setSelectedStrategy] = useState('ma_crossover');
  const [params, setParams] = useState({ shortPeriod: 5, longPeriod: 20 });
  const { signals, backtestResult, fetchSignals, runBacktest, isLoading } = useStockStore();

  const strategies = [
    { id: 'ma_crossover', name: 'MA均线交叉策略', desc: '当短期均线上穿长期均线时买入，下穿时卖出' },
    { id: 'macd_strategy', name: 'MACD策略', desc: 'MACD金叉买入，死叉卖出' },
    { id: 'rsi_strategy', name: 'RSI超买超卖策略', desc: 'RSI低于30买入，高于70卖出' },
    { id: 'boll_strategy', name: '布林带策略', desc: '价格突破上轨卖出，突破下轨买入' },
  ];

  const indicators = ['MA', 'MACD', 'RSI', 'KDJ'];

  const handleBacktest = () => {
    runBacktest(selectedStrategy, params, '600519', 'daily');
    fetchSignals('600519', indicators);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-stock-secondary" />
            <h3 className="text-white font-semibold">策略选择</h3>
          </div>
          <div className="p-4 space-y-3">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedStrategy === strategy.id
                    ? 'bg-stock-secondary/20 border border-stock-secondary'
                    : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
                }`}
              >
                <h4 className="text-white font-medium">{strategy.name}</h4>
                <p className="text-gray-400 text-sm mt-1">{strategy.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-stock-secondary" />
            <h3 className="text-white font-semibold">参数设置</h3>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <label className="text-gray-400 text-sm block mb-2">短期均线周期</label>
              <input
                type="range"
                min="3"
                max="20"
                value={params.shortPeriod}
                onChange={(e) => setParams({ ...params, shortPeriod: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-stock-secondary"
              />
              <span className="text-white text-sm mt-1 block">{params.shortPeriod} 日</span>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">长期均线周期</label>
              <input
                type="range"
                min="10"
                max="60"
                value={params.longPeriod}
                onChange={(e) => setParams({ ...params, longPeriod: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-stock-secondary"
              />
              <span className="text-white text-sm mt-1 block">{params.longPeriod} 日</span>
            </div>

            <button
              onClick={handleBacktest}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stock-secondary text-white font-medium rounded-lg hover:bg-stock-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Play className="w-5 h-5" />
              )}
              运行回测
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-stock-secondary" />
            <h3 className="text-white font-semibold">技术指标信号</h3>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : signals.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {signals.map((signal) => (
                  <div
                    key={signal.indicator}
                    className={`p-4 rounded-lg ${
                      signal.signal === 'buy' ? 'bg-green-500/10 border border-green-500/30' :
                      signal.signal === 'sell' ? 'bg-red-500/10 border border-red-500/30' :
                      'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">{signal.indicator}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        signal.signal === 'buy' ? 'bg-green-500/20 text-green-400' :
                        signal.signal === 'sell' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {signal.signal === 'buy' ? '买入' : signal.signal === 'sell' ? '卖出' : '持有'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">{signal.value.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">点击"运行回测"查看信号</p>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-stock-secondary" />
            <h3 className="text-white font-semibold">回测结果</h3>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : backtestResult ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <span className="text-gray-400 text-sm block">总收益率</span>
                  <span className="text-2xl font-bold text-green-400 mt-2">{backtestResult.totalReturn.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <span className="text-gray-400 text-sm block">年化收益率</span>
                  <span className="text-2xl font-bold text-green-400 mt-2">{backtestResult.annualReturn.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <span className="text-gray-400 text-sm block">最大回撤</span>
                  <span className="text-2xl font-bold text-red-400 mt-2">{backtestResult.maxDrawdown.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <span className="text-gray-400 text-sm block">夏普比率</span>
                  <span className="text-2xl font-bold text-white mt-2">{backtestResult.sharpeRatio.toFixed(2)}</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <span className="text-gray-400 text-sm block">胜率</span>
                  <span className="text-2xl font-bold text-green-400 mt-2">{backtestResult.winRate.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <span className="text-gray-400 text-sm block">交易次数</span>
                  <span className="text-2xl font-bold text-white mt-2">{backtestResult.trades}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">点击"运行回测"查看结果</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="text-white font-semibold">风险提示</h3>
        </div>
        <div className="grid grid-cols-3 gap-6 text-gray-400 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">历史表现不代表未来</h4>
            <p>回测结果基于历史数据，实际市场表现可能与回测结果存在差异。</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">市场风险</h4>
            <p>股票市场存在系统性风险，任何策略都无法保证盈利。</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">建议</h4>
            <p>建议先用模拟账户验证策略有效性，再考虑实盘应用。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
