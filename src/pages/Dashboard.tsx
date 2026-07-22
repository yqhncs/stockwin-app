import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { useStockStore } from '@/stores/stockStore';

export function Dashboard() {
  const { quotes, sectors, hotspots, investmentReport, fetchQuotes, fetchSectors, fetchHotspots, fetchInvestmentReport, isLoading } = useStockStore();

  useEffect(() => {
    fetchQuotes(['600519', '000001', '000858', '601318', '002594']);
    fetchSectors();
    fetchHotspots();
    fetchInvestmentReport('morning');
  }, [fetchQuotes, fetchSectors, fetchHotspots, fetchInvestmentReport]);

  const marketOverview = {
    index: 3256.88,
    change: 27.68,
    changePercent: 0.85,
    upCount: 3125,
    downCount: 1568,
    flatCount: 287,
    turnover: 8560,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">上证指数</span>
            <Activity className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{marketOverview.index.toFixed(2)}</span>
            <span className={`text-sm font-medium ${marketOverview.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
              {marketOverview.change >= 0 ? '+' : ''}{marketOverview.change.toFixed(2)} ({marketOverview.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">上涨家数</span>
            <TrendingUp className="w-5 h-5 text-stock-up" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-stock-up">{marketOverview.upCount}</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">下跌家数</span>
            <TrendingDown className="w-5 h-5 text-stock-down" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-stock-down">{marketOverview.downCount}</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">成交额(亿)</span>
            <Clock className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{marketOverview.turnover}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold">自选股</h3>
            <button className="text-stock-secondary text-sm hover:text-white transition-colors">
              查看全部 <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-800">
                      <th className="text-left py-3 px-2">股票</th>
                      <th className="text-right py-3 px-2">价格</th>
                      <th className="text-right py-3 px-2">涨跌幅</th>
                      <th className="text-right py-3 px-2">成交量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr key={quote.code} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{quote.name}</span>
                            <span className="text-gray-500 text-xs">{quote.code}</span>
                          </div>
                        </td>
                        <td className={`text-right py-3 px-2 font-medium ${quote.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                          {quote.price.toFixed(2)}
                        </td>
                        <td className={`text-right py-3 px-2 ${quote.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                          {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                        </td>
                        <td className="text-right py-3 px-2 text-gray-400 text-sm">
                          {(quote.volume / 10000).toFixed(0)}万
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-white font-semibold">今日热点</h3>
          </div>
          <div className="p-4 space-y-4">
            {hotspots.map((hotspot, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium">{hotspot.name}</h4>
                <p className="text-gray-400 text-sm mt-1">{hotspot.reason}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotspot.stocks.map((stock, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {stock}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">板块涨幅榜</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {sectors.map((sector, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-stock-secondary text-white' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-white">{sector.name}</p>
                      <p className="text-gray-500 text-xs">领涨: {sector.leader}</p>
                    </div>
                  </div>
                  <span className={`font-medium ${sector.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                    {sector.change >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold">AI投资报告</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-stock-secondary text-white text-xs rounded-full">早评</button>
              <button className="px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full hover:bg-gray-600">晚评</button>
            </div>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : investmentReport ? (
              <div>
                <p className="text-stock-secondary text-sm mb-2">{investmentReport.summary}</p>
                <div className="text-gray-400 text-sm space-y-2 whitespace-pre-line">
                  {investmentReport.content.split('##').slice(1).map((section, i) => (
                    <div key={i}>
                      <h4 className="text-white font-medium mt-2">{section.split('\n')[0].trim()}</h4>
                      <p className="text-gray-400 text-sm mt-1">{section.split('\n').slice(1).join('\n').trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">暂无报告</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
