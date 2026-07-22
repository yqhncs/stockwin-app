import { useState } from 'react';
import { Bot, Sparkles, TrendingUp, Star, Search as SearchIcon, Clock, Zap, Target, BarChart3, Activity, Award } from 'lucide-react';
import { useStockStore } from '@/stores/stockStore';
import { runSelectStrategy, strategyList } from '@/lib/strategies/service';

export function AISelect() {
  const [query, setQuery] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('multi_factor');
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { hotspots, fetchHotspots, addToWatchlist } = useStockStore();

  const handleRunStrategy = async () => {
    setIsRunning(true);
    try {
      const data = await runSelectStrategy(selectedStrategy);
      setResults(data);
    } catch (error) {
      console.error('Strategy failed:', error);
    }
    setIsRunning(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      // 根据自然语言匹配策略
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('动量') || lowerQuery.includes('涨幅') || lowerQuery.includes('强势')) {
        setSelectedStrategy('momentum');
      } else if (lowerQuery.includes('成长') || lowerQuery.includes('增长') || lowerQuery.includes('peg')) {
        setSelectedStrategy('garp');
      } else if (lowerQuery.includes('小盘') || lowerQuery.includes('小市值')) {
        setSelectedStrategy('small_cap_value');
      } else if (lowerQuery.includes('技术') || lowerQuery.includes('指标') || lowerQuery.includes('macd') || lowerQuery.includes('rsi')) {
        setSelectedStrategy('technical');
      } else {
        setSelectedStrategy('multi_factor');
      }
      handleRunStrategy();
    }
  };

  const quickQueries = [
    '最近一周涨幅超过20%的股票',
    '市盈率低于20倍的绩优股',
    '新能源板块中技术面强势的股票',
    'PEG小于1的成长股',
    '小市值低估值股票',
  ];

  const currentStrategy = strategyList.find(s => s.id === selectedStrategy);

  return (
    <div className="space-y-6">
      {/* AI选股输入区 */}
      <div className="bg-gradient-to-r from-stock-primary to-stock-secondary rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-bold">AI智能选股</h3>
            <p className="text-white/70 text-sm">基于多因子模型、动量策略、技术指标的量化选股系统</p>
          </div>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：帮我筛选PEG小于1、ROE大于15%的成长股..."
            className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/50 resize-none"
            rows={3}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isRunning}
              className="flex items-center gap-2 px-6 py-2 bg-white text-stock-primary font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-stock-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
              智能选股
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-white/70 text-sm">快捷查询：</span>
          {quickQueries.map((q, index) => (
            <button
              key={index}
              onClick={() => setQuery(q)}
              className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full hover:bg-white/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 策略选择区 */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-stock-secondary" />
          <h3 className="text-white font-semibold">选择选股策略</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {strategyList.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedStrategy === strategy.id
                    ? 'bg-stock-secondary/20 border-2 border-stock-secondary'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <h4 className="text-white font-medium text-sm">{strategy.name}</h4>
                <p className="text-gray-400 text-xs mt-1">{strategy.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleRunStrategy}
            disabled={isRunning}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-stock-secondary text-white font-medium rounded-lg hover:bg-stock-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                正在运行策略选股...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                运行「{currentStrategy?.name}」策略
              </>
            )}
          </button>
        </div>
      </div>

      {/* 选股结果 */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              选股结果 - {currentStrategy?.name}
            </h3>
            <span className="text-gray-400 text-sm">共 {results.length} 只股票</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-5 hover:bg-gray-800 transition-colors border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">#{index + 1}</span>
                        <h4 className="text-white font-bold text-lg">{result.name}</h4>
                      </div>
                      <p className="text-gray-500 text-sm">{result.code}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        result.score >= 70 ? 'bg-green-500/20 text-green-400' :
                        result.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {result.score}分
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        result.signal === 'buy' ? 'bg-stock-up/20 text-stock-up' :
                        result.signal === 'sell' ? 'bg-stock-down/20 text-stock-down' :
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {result.signal === 'buy' ? '买入' : result.signal === 'sell' ? '卖出' : '持有'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">{result.reason}</p>

                  {/* 因子雷达 */}
                  {result.factors && (
                    <div className="space-y-2 mb-3">
                      {[
                        { label: '价值', value: result.factors.value, color: 'bg-blue-500' },
                        { label: '成长', value: result.factors.growth, color: 'bg-green-500' },
                        { label: '动量', value: result.factors.momentum, color: 'bg-yellow-500' },
                        { label: '质量', value: result.factors.quality, color: 'bg-purple-500' },
                        { label: '波动率', value: result.factors.volatility, color: 'bg-cyan-500' },
                      ].map((factor) => (
                        <div key={factor.label} className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-12">{factor.label}</span>
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${factor.color} rounded-full transition-all`}
                              style={{ width: `${Math.min(100, factor.value * 2)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-xs w-8 text-right">{factor.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-stock-secondary text-white text-sm rounded-lg hover:bg-stock-secondary/80 transition-colors">
                      <TrendingUp className="w-4 h-4" />
                      查看行情
                    </button>
                    <button
                      onClick={() => addToWatchlist(result.code, result.name)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      加入自选
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 热点追踪 */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-stock-secondary" />
          <h3 className="text-white font-semibold">热点追踪</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotspots.map((hotspot, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${index < 2 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                  <h4 className="text-white font-semibold">{hotspot.name}</h4>
                </div>
                <p className="text-gray-400 text-sm">{hotspot.reason}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotspot.stocks.map((stock, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer transition-colors">
                      {stock}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 策略说明 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-stock-secondary" />
            <h3 className="text-white font-semibold">策略原理与因子说明</h3>
          </div>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">价</div>
              <div>
                <span className="text-white font-medium">价值因子</span>
                <p className="mt-1">PE(市盈率)、PB(市净率)，寻找估值偏低的股票，安全边际高</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">成</div>
              <div>
                <span className="text-white font-medium">成长因子</span>
                <p className="mt-1">营收增长率、净利润增长率、PEG指标，挖掘高增长潜力股</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">动</div>
              <div>
                <span className="text-white font-medium">动量因子</span>
                <p className="mt-1">20日/60日涨幅，趋势跟踪，买入强势股卖出弱势股</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">质</div>
              <div>
                <span className="text-white font-medium">质量因子</span>
                <p className="mt-1">ROE(净资产收益率)，选择盈利能力强、经营稳健的公司</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">波</div>
              <div>
                <span className="text-white font-medium">波动率因子</span>
                <p className="mt-1">20日收益率标准差，低波动股票夏普比率更高，回撤更小</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="text-white font-semibold">回测绩效标准</h3>
          </div>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span>夏普比率 (Sharpe)</span>
              <span className="text-green-400">{'>'} 1.5 优秀, {'>'} 2.0 卓越</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span>最大回撤 (Max DD)</span>
              <span className="text-green-400">{'<'} 15% 合格</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span>胜率 (Win Rate)</span>
              <span className="text-green-400">{'>'} 50% 良好</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span>盈亏比 (Profit Factor)</span>
              <span className="text-green-400">{'>'} 1.5 合格</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span>Calmar比率</span>
              <span className="text-green-400">{'>'} 1.2 优秀</span>
            </div>
            <div className="flex items-center justify-between">
              <span>年化收益率</span>
              <span className="text-green-400">{'>'} 8% 跑赢市场</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-xs">
              ⚠️ 以上策略基于历史数据回测，历史表现不代表未来收益。市场风格可能切换，因子可能失效。请结合个人判断和风险承受能力做出决策。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
