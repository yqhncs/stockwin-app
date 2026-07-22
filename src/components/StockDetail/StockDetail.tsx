import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Clock, Activity } from 'lucide-react';
import { mockStockApi } from '@/api/stock';
import type { StockQuote, StockFundamental } from '@/types';

interface StockDetailProps {
  code: string;
}

export function StockDetail({ code }: StockDetailProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [fundamental, setFundamental] = useState<StockFundamental | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [quoteData, fundamentalData] = await Promise.all([
        mockStockApi.getQuotes([code]),
        mockStockApi.getFundamental(code),
      ]);
      setQuote(quoteData[0] || null);
      setFundamental(fundamentalData);
      setIsLoading(false);
    };

    fetchData();
  }, [code]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) {
    return <div className="text-gray-500 text-center py-8">暂无数据</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-stock-primary to-stock-secondary rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">{quote.name}</h2>
            <p className="text-white/70 text-sm">{quote.code}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${quote.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
              {quote.price.toFixed(2)}
            </div>
            <div className={`flex items-center justify-end gap-1 mt-1 ${quote.change >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
              {quote.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}</span>
              <span>({quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Clock className="w-4 h-4" />
            开盘价
          </div>
          <div className="text-xl font-bold text-white">{quote.open.toFixed(2)}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            最高价
          </div>
          <div className="text-xl font-bold text-stock-up">{quote.high.toFixed(2)}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <TrendingDown className="w-4 h-4" />
            最低价
          </div>
          <div className="text-xl font-bold text-stock-down">{quote.low.toFixed(2)}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <BarChart3 className="w-4 h-4" />
            成交量
          </div>
          <div className="text-xl font-bold text-white">{(quote.volume / 10000).toFixed(0)}万</div>
        </div>
      </div>

      {fundamental && (
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-stock-secondary" />
              基本面数据
            </h3>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">市盈率(PE)</span>
              <span className="text-xl font-bold text-white mt-2">{fundamental.pe.toFixed(1)}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">市净率(PB)</span>
              <span className="text-xl font-bold text-white mt-2">{fundamental.pb.toFixed(1)}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">每股收益(EPS)</span>
              <span className="text-xl font-bold text-white mt-2">{fundamental.eps.toFixed(2)}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">行业</span>
              <span className="text-xl font-bold text-white mt-2">{fundamental.industry}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">板块</span>
              <span className="text-xl font-bold text-white mt-2">{fundamental.sector}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">营业收入</span>
              <span className="text-xl font-bold text-white mt-2">{(fundamental.revenue / 100000000).toFixed(1)}亿</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm block">净利润</span>
              <span className="text-xl font-bold text-white mt-2">{(fundamental.profit / 100000000).toFixed(1)}亿</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
