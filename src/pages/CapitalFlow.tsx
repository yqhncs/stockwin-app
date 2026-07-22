import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Building2,
  Coins,
  Globe2,
  Layers,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

/* ============================ Types ============================ */

type TabKey = 'overview' | 'sector' | 'stock' | 'northbound';

interface MarketFlowSummary {
  mainNet: number; // 主力净流入(亿)
  superLargeNet: number; // 超大单净流入
  largeNet: number; // 大单净流入
  mediumNet: number; // 中单净流入
  smallNet: number; // 小单净流入
  mainNetPercent: number; // 主力净流入占比(%)
  totalTurnover: number; // 总成交额(亿)
}

interface SectorFlow {
  name: string;
  netInflow: number; // 净流入(亿)
  inflowAmount: number; // 流入金额(亿)
  outflowAmount: number; // 流出金额(亿)
  topStock: string;
  topStockCode: string;
  topStockChange: number; // 领涨股涨跌幅(%)
  changePercent: number; // 板块涨跌幅(%)
}

interface StockFlow {
  code: string;
  name: string;
  price: number;
  changePercent: number; // 涨跌幅(%)
  mainNetInflow: number; // 主力净流入(亿)
  mainNetPercent: number; // 主力净流入占比(%)
  largeOrderPercent: number; // 大单占比(%)
  turnoverRate: number; // 换手率(%)
}

interface NorthboundSummary {
  todayNet: number; // 今日净流入(亿)
  shNet: number; // 沪股通(亿)
  szNet: number; // 深股通(亿)
  day5: number; // 5日累计
  day10: number; // 10日累计
  day20: number; // 20日累计
  buyCount: number; // 买入只数
  sellCount: number; // 卖出只数
}

interface NorthboundStock {
  code: string;
  name: string;
  holdMarketValue: number; // 持股市值(亿)
  holdPercent: number; // 持股比例(%)
  todayChange: number; // 今日增仓(亿)
  changePercent: number; // 涨跌幅(%)
}

interface TrendDay {
  date: string;
  mainNet: number; // 主力净流入(亿)
  northbound: number; // 北向资金(亿)
}

type SortDir = 'asc' | 'desc';

/* ============================ Helpers ============================ */

const formatYi = (v: number): string => `${v >= 0 ? '+' : ''}${v.toFixed(2)}亿`;

const formatPercent = (v: number): string => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

const flowColor = (v: number): string =>
  v > 0 ? 'text-stock-up' : v < 0 ? 'text-stock-down' : 'text-gray-400';

const flowBg = (v: number): string =>
  v > 0 ? 'bg-stock-up' : v < 0 ? 'bg-stock-down' : 'bg-gray-500';

/* ============================ Mock Data ============================ */

const marketFlow: MarketFlowSummary = {
  mainNet: 128.56,
  superLargeNet: 156.32,
  largeNet: -27.76,
  mediumNet: -68.45,
  smallNet: -60.11,
  mainNetPercent: 5.82,
  totalTurnover: 8652.34,
};

const sectorFlows: SectorFlow[] = [
  { name: '银行', netInflow: 32.45, inflowAmount: 156.78, outflowAmount: 124.33, topStock: '工商银行', topStockCode: '601398', topStockChange: 2.36, changePercent: 1.28 },
  { name: '白酒', netInflow: 28.12, inflowAmount: 142.56, outflowAmount: 114.44, topStock: '贵州茅台', topStockCode: '600519', topStockChange: 3.12, changePercent: 2.05 },
  { name: '新能源', netInflow: -18.66, inflowAmount: 98.32, outflowAmount: 116.98, topStock: '宁德时代', topStockCode: '300750', topStockChange: -1.45, changePercent: -0.86 },
  { name: '医药', netInflow: -12.34, inflowAmount: 87.65, outflowAmount: 99.99, topStock: '恒瑞医药', topStockCode: '600276', topStockChange: -0.78, changePercent: -0.54 },
  { name: '科技', netInflow: 45.78, inflowAmount: 178.23, outflowAmount: 132.45, topStock: '中兴通讯', topStockCode: '000063', topStockChange: 4.21, changePercent: 2.88 },
  { name: '消费', netInflow: 8.92, inflowAmount: 76.54, outflowAmount: 67.62, topStock: '海天味业', topStockCode: '603288', topStockChange: 1.56, changePercent: 0.62 },
  { name: '金融', netInflow: 22.31, inflowAmount: 134.56, outflowAmount: 112.25, topStock: '中国平安', topStockCode: '601318', topStockChange: 1.98, changePercent: 1.12 },
  { name: '半导体', netInflow: -36.78, inflowAmount: 102.34, outflowAmount: 139.12, topStock: '中芯国际', topStockCode: '688981', topStockChange: -2.67, changePercent: -1.78 },
  { name: '光伏', netInflow: -24.51, inflowAmount: 65.43, outflowAmount: 89.94, topStock: '隆基绿能', topStockCode: '601012', topStockChange: -2.13, changePercent: -1.34 },
  { name: '军工', netInflow: 15.67, inflowAmount: 88.76, outflowAmount: 73.09, topStock: '中航沈飞', topStockCode: '600760', topStockChange: 2.84, changePercent: 1.45 },
  { name: '房地产', netInflow: -41.23, inflowAmount: 56.78, outflowAmount: 98.01, topStock: '万科A', topStockCode: '000002', topStockChange: -3.21, changePercent: -2.15 },
  { name: '汽车', netInflow: 19.84, inflowAmount: 95.12, outflowAmount: 75.28, topStock: '比亚迪', topStockCode: '002594', topStockChange: 2.45, changePercent: 1.36 },
];

const stockFlows: StockFlow[] = [
  { code: '600519', name: '贵州茅台', price: 1689.50, changePercent: 3.12, mainNetInflow: 9.86, mainNetPercent: 18.45, largeOrderPercent: 32.56, turnoverRate: 0.68 },
  { code: '601398', name: '工商银行', price: 5.42, changePercent: 2.36, mainNetInflow: 8.52, mainNetPercent: 15.23, largeOrderPercent: 28.14, turnoverRate: 1.12 },
  { code: '000063', name: '中兴通讯', price: 32.18, changePercent: 4.21, mainNetInflow: 7.34, mainNetPercent: 22.18, largeOrderPercent: 35.67, turnoverRate: 3.45 },
  { code: '601318', name: '中国平安', price: 48.76, changePercent: 1.98, mainNetInflow: 6.78, mainNetPercent: 12.56, largeOrderPercent: 26.34, turnoverRate: 0.89 },
  { code: '002594', name: '比亚迪', price: 245.32, changePercent: 2.45, mainNetInflow: 6.12, mainNetPercent: 16.78, largeOrderPercent: 30.12, turnoverRate: 1.56 },
  { code: '600276', name: '恒瑞医药', price: 42.15, changePercent: -0.78, mainNetInflow: 5.43, mainNetPercent: 11.23, largeOrderPercent: 24.56, turnoverRate: 1.23 },
  { code: '603288', name: '海天味业', price: 38.92, changePercent: 1.56, mainNetInflow: 4.87, mainNetPercent: 13.45, largeOrderPercent: 27.89, turnoverRate: 0.76 },
  { code: '600760', name: '中航沈飞', price: 42.78, changePercent: 2.84, mainNetInflow: 4.56, mainNetPercent: 19.67, largeOrderPercent: 33.21, turnoverRate: 2.14 },
  { code: '000858', name: '五粮液', price: 152.34, changePercent: 1.78, mainNetInflow: 3.98, mainNetPercent: 10.34, largeOrderPercent: 23.45, turnoverRate: 0.92 },
  { code: '600036', name: '招商银行', price: 35.67, changePercent: 1.45, mainNetInflow: 3.45, mainNetPercent: 9.87, largeOrderPercent: 22.13, turnoverRate: 0.84 },
  { code: '000725', name: '京东方A', price: 4.23, changePercent: -1.34, mainNetInflow: -3.12, mainNetPercent: -8.56, largeOrderPercent: 18.45, turnoverRate: 2.67 },
  { code: '601012', name: '隆基绿能', price: 21.45, changePercent: -2.13, mainNetInflow: -4.23, mainNetPercent: -12.34, largeOrderPercent: 15.67, turnoverRate: 3.12 },
  { code: '688981', name: '中芯国际', price: 52.34, changePercent: -2.67, mainNetInflow: -5.34, mainNetPercent: -14.78, largeOrderPercent: 19.23, turnoverRate: 2.89 },
  { code: '300750', name: '宁德时代', price: 178.56, changePercent: -1.45, mainNetInflow: -5.67, mainNetPercent: -11.45, largeOrderPercent: 21.34, turnoverRate: 1.78 },
  { code: '000002', name: '万科A', price: 8.92, changePercent: -3.21, mainNetInflow: -6.78, mainNetPercent: -17.89, largeOrderPercent: 16.45, turnoverRate: 3.56 },
  { code: '600837', name: '海通证券', price: 9.45, changePercent: -2.45, mainNetInflow: -7.12, mainNetPercent: -13.67, largeOrderPercent: 17.89, turnoverRate: 2.34 },
  { code: '601628', name: '中国人寿', price: 32.18, changePercent: -1.89, mainNetInflow: -7.89, mainNetPercent: -15.34, largeOrderPercent: 20.12, turnoverRate: 1.45 },
  { code: '600048', name: '保利发展', price: 9.78, changePercent: -2.98, mainNetInflow: -8.34, mainNetPercent: -19.56, largeOrderPercent: 14.78, turnoverRate: 3.78 },
  { code: '600030', name: '中信证券', price: 22.45, changePercent: -2.12, mainNetInflow: -8.67, mainNetPercent: -16.23, largeOrderPercent: 18.56, turnoverRate: 2.45 },
  { code: '601336', name: '新华保险', price: 38.92, changePercent: -3.45, mainNetInflow: -9.45, mainNetPercent: -20.12, largeOrderPercent: 13.45, turnoverRate: 2.98 },
];

const northboundSummary: NorthboundSummary = {
  todayNet: 85.62,
  shNet: 52.34,
  szNet: 33.28,
  day5: 215.78,
  day10: -68.45,
  day20: 412.56,
  buyCount: 1056,
  sellCount: 678,
};

const northboundStocks: NorthboundStock[] = [
  { code: '600519', name: '贵州茅台', holdMarketValue: 1685.42, holdPercent: 8.12, todayChange: 12.34, changePercent: 3.12 },
  { code: '601318', name: '中国平安', holdMarketValue: 856.78, holdPercent: 6.45, todayChange: 8.56, changePercent: 1.98 },
  { code: '600036', name: '招商银行', holdMarketValue: 712.34, holdPercent: 7.23, todayChange: 5.67, changePercent: 1.45 },
  { code: '600276', name: '恒瑞医药', holdMarketValue: 568.92, holdPercent: 5.67, todayChange: 3.45, changePercent: -0.78 },
  { code: '000858', name: '五粮液', holdMarketValue: 542.18, holdPercent: 6.78, todayChange: 4.23, changePercent: 1.78 },
  { code: '600030', name: '中信证券', holdMarketValue: 478.56, holdPercent: 4.89, todayChange: -2.34, changePercent: -2.12 },
  { code: '601398', name: '工商银行', holdMarketValue: 456.23, holdPercent: 3.45, todayChange: 6.78, changePercent: 2.36 },
  { code: '000333', name: '美的集团', holdMarketValue: 432.87, holdPercent: 5.34, todayChange: 3.12, changePercent: 1.23 },
  { code: '600028', name: '中国石化', holdMarketValue: 398.45, holdPercent: 4.23, todayChange: -1.45, changePercent: -0.56 },
  { code: '601628', name: '中国人寿', holdMarketValue: 345.67, holdPercent: 3.78, todayChange: -3.67, changePercent: -1.89 },
];

const trendData: TrendDay[] = [
  { date: '07-19', mainNet: -156.78, northbound: -42.34 },
  { date: '07-20', mainNet: 86.45, northbound: 28.56 },
  { date: '07-21', mainNet: -52.34, northbound: 15.78 },
  { date: '07-22', mainNet: 204.12, northbound: 67.89 },
  { date: '07-23', mainNet: 128.56, northbound: 85.62 },
];

/* ============================ Sub-components ============================ */

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-stock-secondary text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface FlowBarProps {
  value: number;
  maxAbs: number;
  label: string;
  showPulse?: boolean;
}

function FlowBar({ value, maxAbs, label, showPulse }: FlowBarProps) {
  const widthPercent = maxAbs > 0 ? Math.min((Math.abs(value) / maxAbs) * 100, 100) : 0;
  const isPositive = value >= 0;
  const isLarge = showPulse && Math.abs(value) > maxAbs * 0.5;

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-gray-400 text-sm flex-shrink-0">{label}</div>
      <div className="flex-1 relative h-7 bg-gray-800/50 rounded">
        {/* center axis */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600" />
        <div
          className={`absolute top-1 bottom-1 ${flowBg(value)} rounded transition-all ${
            isPositive ? 'left-1/2' : 'right-1/2'
          } ${isLarge ? 'animate-pulse' : ''}`}
          style={{ width: `${widthPercent / 2}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 text-xs font-medium whitespace-nowrap ${
            isPositive ? 'left-1/2 ml-2' : 'right-1/2 mr-2'
          } ${flowColor(value)}`}
        >
          {formatYi(value)}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  unit?: string;
}

function StatCard({ label, value, icon, unit = '亿' }: StatCardProps) {
  const isPositive = value >= 0;
  const isLarge = Math.abs(value) > 50;
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={isPositive ? 'text-stock-up' : 'text-stock-down'}>{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className={`text-2xl font-bold ${flowColor(value)} ${isLarge ? 'animate-pulse' : ''}`}
        >
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}
        </span>
        <span className="text-gray-500 text-xs">{unit}</span>
      </div>
    </div>
  );
}

interface SortHeaderProps<T> {
  label: string;
  field: keyof T;
  sortField: keyof T;
  sortDir: SortDir;
  onSort: (field: keyof T) => void;
  align?: 'left' | 'right';
}

function SortHeader<T>({ label, field, sortField, sortDir, onSort, align = 'right' }: SortHeaderProps<T>) {
  const active = sortField === field;
  return (
    <th
      className={`py-3 px-3 cursor-pointer select-none hover:text-white transition-colors ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${active ? 'text-stock-secondary' : 'text-gray-400'}`}
      onClick={() => onSort(field)}
    >
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        {active && (sortDir === 'desc' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />)}
      </span>
    </th>
  );
}

/* ============================ Tab Views ============================ */

function OverviewView() {
  const flows = [
    { label: '主力净流入', value: marketFlow.mainNet },
    { label: '超大单', value: marketFlow.superLargeNet },
    { label: '大单', value: marketFlow.largeNet },
    { label: '中单', value: marketFlow.mediumNet },
    { label: '小单', value: marketFlow.smallNet },
  ];
  const maxAbs = Math.max(...flows.map((f) => Math.abs(f.value)));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="主力净流入" value={marketFlow.mainNet} icon={<Wallet className="w-5 h-5" />} />
        <StatCard label="超大单净流入" value={marketFlow.superLargeNet} icon={<Banknote className="w-5 h-5" />} />
        <StatCard label="大单净流入" value={marketFlow.largeNet} icon={<Coins className="w-5 h-5" />} />
        <StatCard label="总成交额" value={marketFlow.totalTurnover} icon={<Activity className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order-level bar chart */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-stock-secondary" />
              资金流向分布
            </h3>
            <span className="text-gray-500 text-xs">单位：亿元</span>
          </div>
          <div className="p-5 space-y-4">
            {flows.map((f) => (
              <FlowBar key={f.label} label={f.label} value={f.value} maxAbs={maxAbs} showPulse />
            ))}
          </div>
        </div>

        {/* 5-day trend */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-stock-secondary" />
              5日资金趋势
            </h3>
          </div>
          <TrendChart />
        </div>
      </div>
    </div>
  );
}

function TrendChart() {
  const maxAbs = Math.max(...trendData.map((d) => Math.abs(d.mainNet)));
  const chartHeight = 180;

  return (
    <div className="p-5">
      <div className="relative" style={{ height: chartHeight }}>
        {/* center line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700" />
        <div className="flex justify-between items-stretch h-full">
          {trendData.map((d) => {
            const barHeight = maxAbs > 0 ? (Math.abs(d.mainNet) / maxAbs) * (chartHeight / 2 - 10) : 0;
            const isPositive = d.mainNet >= 0;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center w-full" style={{ height: '100%' }}>
                  <div className="flex-1 flex flex-col justify-end items-center w-full">
                    {isPositive && (
                      <div
                        className={`w-6 ${flowBg(d.mainNet)} rounded-t ${Math.abs(d.mainNet) > maxAbs * 0.6 ? 'animate-pulse' : ''}`}
                        style={{ height: barHeight }}
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-center w-full">
                    {!isPositive && (
                      <div
                        className={`w-6 ${flowBg(d.mainNet)} rounded-b`}
                        style={{ height: barHeight }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-3">
        {trendData.map((d) => (
          <div key={d.date} className="flex-1 text-center">
            <div className="text-gray-500 text-xs">{d.date}</div>
            <div className={`text-xs font-medium ${flowColor(d.mainNet)}`}>
              {d.mainNet >= 0 ? '+' : ''}
              {d.mainNet.toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectorView() {
  const [sortField, setSortField] = useState<keyof SectorFlow>('netInflow');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = useMemo(() => {
    const arr = [...sectorFlows];
    arr.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return arr;
  }, [sortField, sortDir]);

  const handleSort = (field: keyof SectorFlow) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const maxAbs = Math.max(...sectorFlows.map((s) => Math.abs(s.netInflow)));

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5 text-stock-secondary" />
          板块资金流向
        </h3>
        <span className="text-gray-500 text-xs">共 {sectorFlows.length} 个板块 · 单位：亿元</span>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border-b border-gray-800 text-sm">
              <th className="text-left py-3 px-3 text-gray-400">板块</th>
              <SortHeader label="净流入" field="netInflow" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortHeader label="流入金额" field="inflowAmount" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <th className="text-right py-3 px-3 text-gray-400">流出金额</th>
              <th className="text-right py-3 px-3 text-gray-400">净流入占比</th>
              <th className="text-left py-3 px-3 text-gray-400">领涨股</th>
              <SortHeader label="板块涨幅" field="changePercent" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const widthPercent = maxAbs > 0 ? (Math.abs(s.netInflow) / maxAbs) * 100 : 0;
              return (
                <tr key={s.name} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="text-white font-medium">{s.name}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${flowBg(s.netInflow)} ${Math.abs(s.netInflow) > maxAbs * 0.6 ? 'animate-pulse' : ''}`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                      <span className={`text-right font-medium w-20 ${flowColor(s.netInflow)}`}>
                        {formatYi(s.netInflow)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-stock-up">{s.inflowAmount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-stock-down">{s.outflowAmount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-gray-400">
                    {((s.netInflow / (s.inflowAmount + s.outflowAmount)) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="text-gray-300 text-sm">{s.topStock}</span>
                      <span className="text-gray-500 text-xs">{s.topStockCode}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${flowColor(s.changePercent)}`}>
                    {formatPercent(s.changePercent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StockView() {
  const [tab, setStockTab] = useState<'inflow' | 'outflow'>('inflow');

  const { inflowTop, outflowTop } = useMemo(() => {
    const sorted = [...stockFlows].sort((a, b) => b.mainNetInflow - a.mainNetInflow);
    return {
      inflowTop: sorted.slice(0, 10),
      outflowTop: sorted.slice(-10).reverse(),
    };
  }, []);

  const list = tab === 'inflow' ? inflowTop : outflowTop;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-stock-secondary" />
          个股资金流向
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setStockTab('inflow')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'inflow' ? 'bg-stock-up text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            主力净流入TOP10
          </button>
          <button
            onClick={() => setStockTab('outflow')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'outflow' ? 'bg-stock-down text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-1" />
            主力净流出TOP10
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border-b border-gray-800 text-sm">
              <th className="text-left py-3 px-3 text-gray-400">代码/名称</th>
              <th className="text-right py-3 px-3 text-gray-400">最新价</th>
              <th className="text-right py-3 px-3 text-gray-400">涨跌幅</th>
              <th className="text-right py-3 px-3 text-gray-400">主力净流入</th>
              <th className="text-right py-3 px-3 text-gray-400">主力净占比</th>
              <th className="text-right py-3 px-3 text-gray-400">大单占比</th>
              <th className="text-right py-3 px-3 text-gray-400">换手率</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, idx) => (
              <tr key={s.code} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        idx < 3 ? 'bg-stock-secondary text-white' : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">{s.name}</span>
                      <span className="text-gray-500 text-xs">{s.code}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-white font-medium">{s.price.toFixed(2)}</td>
                <td className={`py-3 px-3 text-right font-medium ${flowColor(s.changePercent)}`}>
                  {formatPercent(s.changePercent)}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${flowColor(s.mainNetInflow)}`}>
                  {formatYi(s.mainNetInflow)}
                </td>
                <td className={`py-3 px-3 text-right ${flowColor(s.mainNetPercent)}`}>
                  {s.mainNetPercent >= 0 ? '+' : ''}
                  {s.mainNetPercent.toFixed(2)}%
                </td>
                <td className="py-3 px-3 text-right text-gray-300">{s.largeOrderPercent.toFixed(2)}%</td>
                <td className="py-3 px-3 text-right text-gray-300">{s.turnoverRate.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NorthboundView() {
  const cumulatives = [
    { label: '5日累计', value: northboundSummary.day5 },
    { label: '10日累计', value: northboundSummary.day10 },
    { label: '20日累计', value: northboundSummary.day20 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="今日北向净流入" value={northboundSummary.todayNet} icon={<Globe2 className="w-5 h-5" />} />
        <StatCard label="沪股通净流入" value={northboundSummary.shNet} icon={<Banknote className="w-5 h-5" />} />
        <StatCard label="深股通净流入" value={northboundSummary.szNet} icon={<Coins className="w-5 h-5" />} />
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">买卖只数</span>
            <RefreshCw className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-stock-up font-bold">买入 {northboundSummary.buyCount}</span>
            <span className="text-stock-down font-bold">卖出 {northboundSummary.sellCount}</span>
          </div>
        </div>
      </div>

      {/* Cumulative + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-stock-secondary" />
              累计净流入
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {cumulatives.map((c) => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{c.label}</span>
                <span className={`text-lg font-bold ${flowColor(c.value)}`}>{formatYi(c.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-stock-secondary" />
              5日北向资金趋势
            </h3>
          </div>
          <NorthboundTrendChart />
        </div>
      </div>

      {/* Top held stocks */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-stock-secondary" />
            北向持股TOP10
          </h3>
          <span className="text-gray-500 text-xs">单位：亿元</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-900 z-10">
              <tr className="border-b border-gray-800 text-sm">
                <th className="text-left py-3 px-3 text-gray-400">代码/名称</th>
                <th className="text-right py-3 px-3 text-gray-400">持股市值</th>
                <th className="text-right py-3 px-3 text-gray-400">持股比例</th>
                <th className="text-right py-3 px-3 text-gray-400">今日增仓</th>
                <th className="text-right py-3 px-3 text-gray-400">涨跌幅</th>
              </tr>
            </thead>
            <tbody>
              {northboundStocks.map((s, idx) => (
                <tr key={s.code} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                          idx < 3 ? 'bg-stock-secondary text-white' : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">{s.name}</span>
                        <span className="text-gray-500 text-xs">{s.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-white font-medium">{s.holdMarketValue.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-gray-300">{s.holdPercent.toFixed(2)}%</td>
                  <td className={`py-3 px-3 text-right font-medium ${flowColor(s.todayChange)}`}>
                    {formatYi(s.todayChange)}
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${flowColor(s.changePercent)}`}>
                    {formatPercent(s.changePercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NorthboundTrendChart() {
  const maxAbs = Math.max(...trendData.map((d) => Math.abs(d.northbound)));
  const chartHeight = 160;

  return (
    <div className="p-5">
      <div className="relative" style={{ height: chartHeight }}>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700" />
        <div className="flex justify-between items-stretch h-full">
          {trendData.map((d) => {
            const barHeight = maxAbs > 0 ? (Math.abs(d.northbound) / maxAbs) * (chartHeight / 2 - 8) : 0;
            const isPositive = d.northbound >= 0;
            return (
              <div key={d.date} className="flex-1 relative">
                <div className="absolute left-1/2 -translate-x-1/2 w-full h-full flex flex-col">
                  <div className="flex-1 flex flex-col justify-end items-center">
                    {isPositive && (
                      <div
                        className={`w-8 ${flowBg(d.northbound)} rounded-t ${Math.abs(d.northbound) > maxAbs * 0.6 ? 'animate-pulse' : ''}`}
                        style={{ height: barHeight }}
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-center">
                    {!isPositive && (
                      <div className={`w-8 ${flowBg(d.northbound)} rounded-b`} style={{ height: barHeight }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-3">
        {trendData.map((d) => (
          <div key={d.date} className="flex-1 text-center">
            <div className="text-gray-500 text-xs">{d.date}</div>
            <div className={`text-xs font-medium ${flowColor(d.northbound)}`}>
              {d.northbound >= 0 ? '+' : ''}
              {d.northbound.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ Main Component ============================ */

export function CapitalFlow() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '市场概览', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'sector', label: '板块资金', icon: <Layers className="w-4 h-4" /> },
    { key: 'stock', label: '个股资金', icon: <Building2 className="w-4 h-4" /> },
    { key: 'northbound', label: '北向资金', icon: <Globe2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-stock-primary/20 to-stock-secondary/20 rounded-xl p-5 border border-gray-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stock-secondary/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-stock-secondary" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">资金流向分析</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                主力资金 · 板块资金 · 个股资金 · 北向资金实时监控
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            <span>数据更新于 {new Date().toLocaleString('zh-CN')}</span>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <TabButton
            key={t.key}
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            icon={t.icon}
            label={t.label}
          />
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewView />}
      {activeTab === 'sector' && <SectorView />}
      {activeTab === 'stock' && <StockView />}
      {activeTab === 'northbound' && <NorthboundView />}
    </div>
  );
}
