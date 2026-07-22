import { useEffect, useRef, useState } from 'react';
import { init } from 'klinecharts';
import type { Chart, DataLoaderGetBarsParams } from 'klinecharts';
import { useStockStore } from '@/stores/stockStore';
import { Plus, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { StockDetail } from '@/components/StockDetail/StockDetail';

export function Market() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [isChartReady, setIsChartReady] = useState(false);
  const { selectedStock, klineData, quotes, fetchKLine, fetchQuotes, isLoading } = useStockStore();

  useEffect(() => {
    fetchKLine(selectedStock);
    fetchQuotes([selectedStock]);
  }, [selectedStock, fetchKLine, fetchQuotes]);

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const dataLoader = {
        getBars: (params: DataLoaderGetBarsParams) => {
          if (klineData.length > 0) {
            params.callback(klineData as unknown as Parameters<DataLoaderGetBarsParams['callback']>[0], { forward: false, backward: false });
          }
        },
      };

      chartInstance.current = init(chartRef.current, {
        styles: {
          grid: {
            show: true,
            horizontal: { color: '#1e293b', size: 1, style: 'solid' as const },
            vertical: { color: '#1e293b', size: 1, style: 'solid' as const },
          },
          crosshair: {
            show: true,
            horizontal: { line: { color: '#64748b', size: 1, style: 'dashed' as const } },
            vertical: { line: { color: '#64748b', size: 1, style: 'dashed' as const } },
          },
          candle: {
            type: 'candle_solid',
            bar: {
              upColor: '#ef4444',
              downColor: '#22c55e',
              upBorderColor: '#ef4444',
              downBorderColor: '#22c55e',
            },
          },
        },
      });

      chartInstance.current.setDataLoader(dataLoader);
      chartInstance.current.createIndicator('VOL');
      chartInstance.current.createIndicator('MA', false);
      chartInstance.current.createIndicator('MACD');

      setIsChartReady(true);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isChartReady && chartInstance.current && klineData.length > 0) {
      const dataLoader = {
        getBars: (params: DataLoaderGetBarsParams) => {
          params.callback(klineData as unknown as Parameters<DataLoaderGetBarsParams['callback']>[0], { forward: false, backward: false });
        },
      };
      chartInstance.current.setDataLoader(dataLoader);
      chartInstance.current.resetData();
    }
  }, [klineData, isChartReady]);

  const currentQuote = quotes.find(q => q.code === selectedStock);

  const stockList = [
    { code: '600519', name: '贵州茅台' },
    { code: '000001', name: '平安银行' },
    { code: '000858', name: '五粮液' },
    { code: '601318', name: '中国平安' },
    { code: '002594', name: '比亚迪' },
    { code: '300750', name: '宁德时代' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select
            value={selectedStock}
            onChange={(e) => fetchKLine(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-stock-secondary"
          >
            {stockList.map((stock) => (
              <option key={stock.code} value={stock.code}>
                {stock.name} ({stock.code})
              </option>
            ))}
          </select>
          
          <div className="flex flex-wrap gap-2">
            {['1m', '5m', '15m', '30m', '60m', 'daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => fetchKLine(selectedStock, period)}
                className="px-3 py-1 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-colors text-sm"
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-stock-secondary text-white rounded-lg hover:bg-stock-secondary/80 transition-colors">
          <Plus className="w-4 h-4" />
          添加自选
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentQuote ? (
          <>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <span className="text-gray-400 text-sm">最新价</span>
              <div className={`text-2xl font-bold mt-2 ${currentQuote.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                {currentQuote.price.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <span className="text-gray-400 text-sm">涨跌幅</span>
              <div className={`text-2xl font-bold mt-2 flex items-center gap-1 ${currentQuote.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                {currentQuote.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {currentQuote.change >= 0 ? '+' : ''}{currentQuote.changePercent.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <span className="text-gray-400 text-sm">成交量</span>
              <div className="text-2xl font-bold mt-2 text-white">
                {(currentQuote.volume / 10000).toFixed(0)}万
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <span className="text-gray-400 text-sm">成交额</span>
              <div className="text-2xl font-bold mt-2 text-white">
                {(currentQuote.amount / 100000000).toFixed(2)}亿
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-4 flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-semibold">K线图</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-stock-secondary text-white text-xs rounded-full">MA</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full hover:bg-gray-600">MACD</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full hover:bg-gray-600">RSI</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full hover:bg-gray-600">KDJ</button>
          </div>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div ref={chartRef} className="w-full" style={{ height: '500px' }}></div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-stock-secondary" />
          <h3 className="text-white font-semibold">股票详情</h3>
        </div>
        <div className="p-4">
          <StockDetail code={selectedStock} />
        </div>
      </div>
    </div>
  );
}
