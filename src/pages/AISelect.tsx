import { useState } from 'react';
import { Bot, Sparkles, TrendingUp, Star, Search, Clock, Zap } from 'lucide-react';
import { useStockStore } from '@/stores/stockStore';

export function AISelect() {
  const [query, setQuery] = useState('');
  const { aiResults, hotspots, aiSelect, fetchHotspots, addToWatchlist, isLoading } = useStockStore();

  const handleSearch = () => {
    if (query.trim()) {
      aiSelect(query);
    }
  };

  const quickQueries = [
    '最近一周涨幅超过20%的股票',
    '市盈率低于20倍的绩优股',
    '新能源板块中技术面强势的股票',
    '北向资金持续流入的股票',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-stock-primary to-stock-secondary rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-bold">AI智能选股</h3>
            <p className="text-white/70 text-sm">用自然语言描述你的选股条件，AI帮你快速筛选</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：帮我筛选最近一周涨幅超过20%，且市盈率低于30倍的科技股..."
            className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/50 resize-none"
            rows={3}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-white text-stock-primary font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
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

      {aiResults.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              选股结果
            </h3>
            <span className="text-gray-400 text-sm">共 {aiResults.length} 只股票</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {aiResults.map((result, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-bold text-lg">{result.name}</h4>
                      <p className="text-gray-500 text-sm">{result.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      result.score >= 80 ? 'bg-green-500/20 text-green-400' :
                      result.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {result.score}分
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">{result.reason}</p>
                  <div className="flex gap-2 mt-4">
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

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-stock-secondary" />
          <h3 className="text-white font-semibold">热点追踪</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
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

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-white font-semibold mb-4">AI选股原理</h3>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-stock-secondary/20 flex items-center justify-center text-stock-secondary text-xs font-bold">1</div>
              <p>解析自然语言，提取选股条件（如涨幅、市盈率、行业等）</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-stock-secondary/20 flex items-center justify-center text-stock-secondary text-xs font-bold">2</div>
              <p>调用股票数据库，筛选符合条件的股票</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-stock-secondary/20 flex items-center justify-center text-stock-secondary text-xs font-bold">3</div>
              <p>综合评估技术面、基本面、资金面，给出评分和建议</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-white font-semibold mb-4">使用建议</h3>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <p>AI选股结果仅供参考，不构成投资建议</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <p>建议结合个人判断和风险承受能力做出决策</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <p>可将筛选结果加入自选，持续跟踪观察</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
