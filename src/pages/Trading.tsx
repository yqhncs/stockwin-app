import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Shield, Clock, AlertCircle, Calculator, List } from 'lucide-react';

export function Trading() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [stockCode, setStockCode] = useState('600519');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [positionSize, setPositionSize] = useState(50);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const accountInfo = {
    totalAssets: 1000000,
    availableCash: 500000,
    positionValue: 500000,
    profit: 25000,
    profitPercent: 2.5,
  };

  const positions = [
    { code: '600519', name: '贵州茅台', quantity: 280, avgCost: 1750, currentPrice: 1680, value: 470400, profit: -19600, profitPercent: -11.2 },
    { code: '002594', name: '比亚迪', quantity: 1000, avgCost: 240, currentPrice: 268.5, value: 268500, profit: 28500, profitPercent: 11.88 },
    { code: '300750', name: '宁德时代', quantity: 500, avgCost: 180, currentPrice: 215, value: 107500, profit: 17500, profitPercent: 19.44 },
  ];

  const recentTrades = [
    { id: 1, time: '2026-07-22 10:30', code: '002594', name: '比亚迪', type: 'buy', price: 265, quantity: 500, amount: 132500 },
    { id: 2, time: '2026-07-22 09:45', code: '600519', name: '贵州茅台', type: 'sell', price: 1690, quantity: 100, amount: 169000 },
    { id: 3, time: '2026-07-21 14:30', code: '300750', name: '宁德时代', type: 'buy', price: 210, quantity: 300, amount: 63000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">总资产</span>
            <Wallet className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{(accountInfo.totalAssets / 10000).toFixed(2)}万</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">可用资金</span>
            <Clock className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{(accountInfo.availableCash / 10000).toFixed(2)}万</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">持仓市值</span>
            <List className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{(accountInfo.positionValue / 10000).toFixed(2)}万</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">总盈亏</span>
            {accountInfo.profit >= 0 ? <TrendingUp className="w-5 h-5 text-stock-up" /> : <TrendingDown className="w-5 h-5 text-stock-down" />}
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${accountInfo.profit >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
              {accountInfo.profit >= 0 ? '+' : ''}{(accountInfo.profit / 10000).toFixed(2)}万
            </span>
            <span className={`text-sm ${accountInfo.profit >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
              ({accountInfo.profitPercent >= 0 ? '+' : ''}{accountInfo.profitPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">交易下单</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => setTradeType('buy')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                  tradeType === 'buy'
                    ? 'bg-stock-up text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                买入
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                  tradeType === 'sell'
                    ? 'bg-stock-down text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <TrendingDown className="w-5 h-5" />
                卖出
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">股票代码</label>
                <select
                  value={stockCode}
                  onChange={(e) => setStockCode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-stock-secondary"
                >
                  <option value="600519">600519 贵州茅台</option>
                  <option value="002594">002594 比亚迪</option>
                  <option value="300750">300750 宁德时代</option>
                  <option value="601318">601318 中国平安</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">价格</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="输入价格"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-stock-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">数量（股）</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="输入数量"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-stock-secondary"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">仓位比例</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={positionSize}
                    onChange={(e) => setPositionSize(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-stock-secondary"
                  />
                  <span className="text-white text-sm w-12 text-right">{positionSize}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">止损价</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="可选"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-stock-secondary"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">止盈价</label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="可选"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-stock-secondary"
                />
              </div>
            </div>

            <button className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
              tradeType === 'buy' ? 'bg-stock-up hover:bg-stock-up/80' : 'bg-stock-down hover:bg-stock-down/80'
            }`}>
              {tradeType === 'buy' ? '确认买入' : '确认卖出'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-stock-secondary" />
            <h3 className="text-white font-semibold">风险控制</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">当前仓位</h4>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-stock-secondary w-1/2"></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">已用 50% 仓位</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">单笔风险</h4>
              <p className="text-gray-400 text-sm">建议单笔交易风险不超过账户净值的 2%</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-stock-secondary font-bold">2%</span>
                <span className="text-gray-500">= 约 20,000 元</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">止损建议</h4>
              <p className="text-gray-400 text-sm">根据当前策略，建议设置 {stopLoss || '5%'} 的止损</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">盈利目标</h4>
              <p className="text-gray-400 text-sm">建议盈利目标为风险的 1.5-2 倍</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">持仓列表</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-800">
                    <th className="text-left py-3 px-2">股票</th>
                    <th className="text-right py-3 px-2">持仓数量</th>
                    <th className="text-right py-3 px-2">成本价</th>
                    <th className="text-right py-3 px-2">现价</th>
                    <th className="text-right py-3 px-2">盈亏</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos) => (
                    <tr key={pos.code} className="border-b border-gray-800/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{pos.name}</span>
                          <span className="text-gray-500 text-xs">{pos.code}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 text-white">{pos.quantity}</td>
                      <td className="text-right py-3 px-2 text-gray-400">{pos.avgCost.toFixed(2)}</td>
                      <td className={`text-right py-3 px-2 font-medium ${pos.profit >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                        {pos.currentPrice.toFixed(2)}
                      </td>
                      <td className={`text-right py-3 px-2 ${pos.profit >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                        {pos.profit >= 0 ? '+' : ''}{pos.profitPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">成交记录</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{trade.name}</span>
                      <span className="text-gray-500 text-xs ml-2">{trade.code}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.type === 'buy' ? 'bg-stock-up/20 text-stock-up' : 'bg-stock-down/20 text-stock-down'
                    }`}>
                      {trade.type === 'buy' ? '买入' : '卖出'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-gray-400 text-sm">
                    <span>{trade.time}</span>
                    <span>成交价: {trade.price} x {trade.quantity}股</span>
                  </div>
                  <div className="text-right text-gray-500 text-xs mt-1">
                    成交金额: {(trade.amount / 10000).toFixed(2)}万
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
