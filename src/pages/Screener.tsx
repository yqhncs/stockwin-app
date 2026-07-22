import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Filter, Save, Download, Plus, X, SlidersHorizontal, Zap,
  FolderOpen, Trash2, Activity, BarChart3, TrendingUp, Wallet,
  Play, Search, ChevronRight,
} from 'lucide-react';
import { mockStockApi } from '@/api/stock';
import type { StockQuote, StockFundamental } from '@/types';

// ============ Types ============
type ConditionCategory = 'technical' | 'fundamental' | 'price_volume' | 'capital';
type Operator = '>' | '<' | '>=' | '<=' | 'between' | 'equals';

interface ScreeningCondition {
  id: string;
  category: ConditionCategory;
  name: string;
  field: string;
  operator: Operator;
  value: number | string;
  value2?: number;
  label: string;
}

interface ConditionDef {
  field: string;
  label: string;
  category: ConditionCategory;
  defaultOperator: Operator;
  defaultValue: number;
  defaultValue2?: number;
  type: 'boolean' | 'number';
  unit?: string;
  description?: string;
}

interface StockFactor {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  pe: number;
  pb: number;
  roe: number;
  revenueGrowth: number;
  profitGrowth: number;
  marketCap: number;
  turnoverRate: number;
  volumeRatio: number;
  amplitude: number;
  volume: number;
  amount: number;
  rsiValue: number;
  mainCapitalInflow: number;
  northCapitalInflow: number;
  ma_golden_cross: boolean;
  macd_golden_cross: boolean;
  rsi_oversold: boolean;
  kdj_golden_cross: boolean;
  boll_lower_breakout: boolean;
  above_ma60: boolean;
  volume_surge: boolean;
  main_capital_inflow: boolean;
  north_capital_inflow: boolean;
}

interface ScreenResult {
  factor: StockFactor;
  matchCount: number;
  matchDetails: string[];
}

interface SavedTemplate {
  id: string;
  name: string;
  conditions: ScreeningCondition[];
  createdAt: string;
}

// ============ Condition Definitions ============
const CONDITION_DEFS: ConditionDef[] = [
  // Technical
  { field: 'ma_golden_cross', label: 'MA金叉', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: '短期均线上穿长期均线' },
  { field: 'macd_golden_cross', label: 'MACD金叉', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: 'MACD金叉信号' },
  { field: 'rsi_oversold', label: 'RSI超卖(<30)', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: 'RSI低于30超卖区' },
  { field: 'kdj_golden_cross', label: 'KDJ金叉', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: 'KDJ金叉信号' },
  { field: 'boll_lower_breakout', label: '跌破布林下轨', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: '价格跌破布林带下轨' },
  { field: 'above_ma60', label: '站上60日线', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: '股价在60日均线之上' },
  { field: 'volume_surge', label: '放量上涨', category: 'technical', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: '成交量显著放大且上涨' },
  // Fundamental
  { field: 'pe', label: '市盈率', category: 'fundamental', defaultOperator: 'between', defaultValue: 0, defaultValue2: 30, type: 'number', unit: '倍' },
  { field: 'pb', label: '市净率', category: 'fundamental', defaultOperator: 'between', defaultValue: 0, defaultValue2: 5, type: 'number', unit: '倍' },
  { field: 'roe', label: 'ROE', category: 'fundamental', defaultOperator: '>', defaultValue: 15, type: 'number', unit: '%' },
  { field: 'revenueGrowth', label: '营收增长', category: 'fundamental', defaultOperator: '>', defaultValue: 20, type: 'number', unit: '%' },
  { field: 'profitGrowth', label: '利润增长', category: 'fundamental', defaultOperator: '>', defaultValue: 25, type: 'number', unit: '%' },
  { field: 'marketCap', label: '市值', category: 'fundamental', defaultOperator: 'between', defaultValue: 100, defaultValue2: 5000, type: 'number', unit: '亿' },
  // Price/Volume
  { field: 'changePercent', label: '涨跌幅', category: 'price_volume', defaultOperator: 'between', defaultValue: -5, defaultValue2: 10, type: 'number', unit: '%' },
  { field: 'turnoverRate', label: '换手率', category: 'price_volume', defaultOperator: 'between', defaultValue: 1, defaultValue2: 10, type: 'number', unit: '%' },
  { field: 'volumeRatio', label: '量比', category: 'price_volume', defaultOperator: 'between', defaultValue: 0.5, defaultValue2: 3, type: 'number' },
  { field: 'amplitude', label: '振幅', category: 'price_volume', defaultOperator: 'between', defaultValue: 1, defaultValue2: 8, type: 'number', unit: '%' },
  // Capital
  { field: 'main_capital_inflow', label: '主力资金净流入', category: 'capital', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: '主力资金净流入为正' },
  { field: 'north_capital_inflow', label: '北向资金流入', category: 'capital', defaultOperator: 'equals', defaultValue: 1, type: 'boolean', description: '北向资金净买入' },
];

const CATEGORY_CONFIG: { key: ConditionCategory; label: string; icon: typeof Activity; color: string; bgColor: string }[] = [
  { key: 'technical', label: '技术面', icon: Activity, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { key: 'fundamental', label: '基本面', icon: BarChart3, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { key: 'price_volume', label: '行情面', icon: TrendingUp, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  { key: 'capital', label: '资金面', icon: Wallet, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
];

// ============ Preset Strategies ============
const PRESET_STRATEGIES: { name: string; desc: string; conditions: Omit<ScreeningCondition, 'id'>[] }[] = [
  {
    name: '均线多头排列',
    desc: '站上60日线 + MA金叉',
    conditions: [
      { category: 'technical', name: 'above_ma60', field: 'above_ma60', operator: 'equals', value: 1, label: '站上60日线' },
      { category: 'technical', name: 'ma_golden_cross', field: 'ma_golden_cross', operator: 'equals', value: 1, label: 'MA金叉' },
    ],
  },
  {
    name: 'MACD底背离',
    desc: 'MACD金叉 + RSI超卖',
    conditions: [
      { category: 'technical', name: 'macd_golden_cross', field: 'macd_golden_cross', operator: 'equals', value: 1, label: 'MACD金叉' },
      { category: 'technical', name: 'rsi_oversold', field: 'rsi_oversold', operator: 'equals', value: 1, label: 'RSI超卖' },
    ],
  },
  {
    name: '放量突破',
    desc: '放量上涨 + 涨幅>3%',
    conditions: [
      { category: 'technical', name: 'volume_surge', field: 'volume_surge', operator: 'equals', value: 1, label: '放量上涨' },
      { category: 'price_volume', name: 'change_pct', field: 'changePercent', operator: '>', value: 3, label: '涨跌幅' },
    ],
  },
  {
    name: '低估值蓝筹',
    desc: 'PE<15 + PB<2 + ROE>15%',
    conditions: [
      { category: 'fundamental', name: 'pe_range', field: 'pe', operator: 'between', value: 0, value2: 15, label: '市盈率' },
      { category: 'fundamental', name: 'pb_range', field: 'pb', operator: 'between', value: 0, value2: 2, label: '市净率' },
      { category: 'fundamental', name: 'roe_min', field: 'roe', operator: '>', value: 15, label: 'ROE' },
    ],
  },
  {
    name: '高成长小盘',
    desc: '营收增>20% + 利润增>30% + 市值<500亿',
    conditions: [
      { category: 'fundamental', name: 'revenue_growth_min', field: 'revenueGrowth', operator: '>', value: 20, label: '营收增长' },
      { category: 'fundamental', name: 'profit_growth_min', field: 'profitGrowth', operator: '>', value: 30, label: '利润增长' },
      { category: 'fundamental', name: 'market_cap_range', field: 'marketCap', operator: 'between', value: 50, value2: 500, label: '市值' },
    ],
  },
];

const ALL_STOCK_CODES = [
  '600519', '000001', '000858', '601318', '002594',
  '300750', '600036', '000333', '601012', '002475',
  '600276', '000725', '603259', '300059',
];

const TEMPLATE_STORAGE_KEY = 'screener_templates';

// ============ Helper Functions ============

// Deterministic pseudo-random based on string seed
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 100000) / 100000;
}

function generateFactorData(quote: StockQuote, fundamental: StockFundamental | null): StockFactor {
  const seed = quote.code;
  const r = (salt: string) => seededRandom(seed + salt);

  const pe = fundamental?.pe ?? (8 + r('pe') * 45);
  const pb = fundamental?.pb ?? (0.5 + r('pb') * 7);

  return {
    code: quote.code,
    name: quote.name,
    price: quote.price,
    changePercent: quote.changePercent,
    pe,
    pb,
    roe: 5 + r('roe') * 25,
    revenueGrowth: -10 + r('rev') * 55,
    profitGrowth: -20 + r('prof') * 65,
    marketCap: (quote.price * (100000 + r('cap') * 5000000)) / 100000000,
    turnoverRate: 0.3 + r('turn') * 9,
    volumeRatio: 0.2 + r('vr') * 4.5,
    amplitude: 0.5 + r('amp') * 9,
    volume: quote.volume,
    amount: quote.amount,
    rsiValue: 15 + r('rsi') * 70,
    mainCapitalInflow: (r('main') - 0.4) * 50000,
    northCapitalInflow: (r('north') - 0.45) * 30000,
    ma_golden_cross: r('ma') > 0.4,
    macd_golden_cross: r('macd') > 0.45,
    rsi_oversold: r('rsi') < 0.2,
    kdj_golden_cross: r('kdj') > 0.5,
    boll_lower_breakout: r('boll') < 0.15,
    above_ma60: r('ma60') > 0.35,
    volume_surge: r('vs') > 0.5,
    main_capital_inflow: r('main') > 0.45,
    north_capital_inflow: r('north') > 0.5,
  };
}

function getConditionDef(field: string): ConditionDef | undefined {
  return CONDITION_DEFS.find((c) => c.field === field);
}

function evaluateCondition(factor: StockFactor, condition: ScreeningCondition): boolean {
  const def = getConditionDef(condition.field);
  const factorValue = factor[condition.field as keyof StockFactor];

  if (def?.type === 'boolean' || typeof factorValue === 'boolean') {
    return factorValue === true;
  }

  const numValue = Number(factorValue);
  const condValue = Number(condition.value);

  switch (condition.operator) {
    case '>': return numValue > condValue;
    case '<': return numValue < condValue;
    case '>=': return numValue >= condValue;
    case '<=': return numValue <= condValue;
    case 'equals': return numValue === condValue;
    case 'between':
      return numValue >= condValue && numValue <= Number(condition.value2);
    default: return true;
  }
}

function formatVolume(vol: number): string {
  if (vol >= 100000000) return (vol / 100000000).toFixed(2) + '亿';
  if (vol >= 10000) return (vol / 10000).toFixed(2) + '万';
  return vol.toString();
}

function formatAmount(amount: number): string {
  if (amount >= 100000000) return (amount / 100000000).toFixed(2) + '亿';
  if (amount >= 10000) return (amount / 10000).toFixed(0) + '万';
  return amount.toString();
}

function exportToCSV(results: ScreenResult[]): void {
  const headers = [
    '代码', '名称', '现价', '涨跌幅(%)', 'PE', 'PB', 'ROE(%)',
    '换手率(%)', '量比', '振幅(%)', '市值(亿)', '成交额',
    '匹配信号数', '匹配条件',
  ];
  const rows = results.map((r) => {
    const f = r.factor;
    return [
      f.code, f.name, f.price.toFixed(2), f.changePercent.toFixed(2),
      f.pe.toFixed(2), f.pb.toFixed(2), f.roe.toFixed(2),
      f.turnoverRate.toFixed(2), f.volumeRatio.toFixed(2),
      f.amplitude.toFixed(2), f.marketCap.toFixed(2),
      formatAmount(f.amount), r.matchCount.toString(),
      r.matchDetails.join('; '),
    ];
  });
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `选股结果_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ============ Main Component ============
export function Screener() {
  const [conditions, setConditions] = useState<ScreeningCondition[]>([]);
  const [results, setResults] = useState<ScreenResult[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [hasScreened, setHasScreened] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ConditionCategory>('technical');
  const [factorCache, setFactorCache] = useState<Map<string, StockFactor>>(new Map());
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [sortBy, setSortBy] = useState<{ field: string; desc: boolean }>({ field: 'matchCount', desc: true });

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load templates:', e);
    }
  }, []);

  // Generate factor cache on mount (deterministic)
  useEffect(() => {
    const cache = new Map<string, StockFactor>();
    mockStockApi.getQuotes(ALL_STOCK_CODES).then(async (quotes) => {
      for (const quote of quotes) {
        const fundamental = await mockStockApi.getFundamental(quote.code);
        cache.set(quote.code, generateFactorData(quote, fundamental));
      }
      setFactorCache(cache);
    });
  }, []);

  const addCondition = useCallback((def: ConditionDef) => {
    const id = `${def.field}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newCondition: ScreeningCondition = {
      id,
      category: def.category,
      name: def.field,
      field: def.field,
      operator: def.defaultOperator,
      value: def.defaultValue,
      value2: def.defaultValue2,
      label: def.label,
    };
    setConditions((prev) => [...prev, newCondition]);
  }, []);

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCondition = useCallback((id: string, updates: Partial<ScreeningCondition>) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const loadPreset = useCallback((preset: typeof PRESET_STRATEGIES[0]) => {
    const newConditions: ScreeningCondition[] = preset.conditions.map((c, idx) => ({
      ...c,
      id: `preset_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 8)}`,
    }));
    setConditions(newConditions);
  }, []);

  const runScreening = useCallback(async () => {
    setIsScreening(true);
    setHasScreened(true);
    // Simulate async screening
    await new Promise((resolve) => setTimeout(resolve, 400));

    const allResults: ScreenResult[] = [];
    factorCache.forEach((factor) => {
      if (conditions.length === 0) {
        allResults.push({ factor, matchCount: 0, matchDetails: [] });
        return;
      }
      const matchDetails: string[] = [];
      let matchCount = 0;
      for (const cond of conditions) {
        const def = getConditionDef(cond.field);
        if (evaluateCondition(factor, cond)) {
          matchCount++;
          const opStr = cond.operator === 'between'
            ? `${cond.value}-${cond.value2}${def?.unit || ''}`
            : `${cond.operator}${cond.value}${def?.unit || ''}`;
          matchDetails.push(`${cond.label}(${opStr})`);
        }
      }
      // Only include stocks that match ALL conditions
      if (matchCount === conditions.length) {
        allResults.push({ factor, matchCount, matchDetails });
      }
    });

    // Sort results
    allResults.sort((a, b) => {
      let cmp = 0;
      if (sortBy.field === 'matchCount') {
        cmp = a.matchCount - b.matchCount;
      } else if (sortBy.field === 'changePercent') {
        cmp = a.factor.changePercent - b.factor.changePercent;
      } else {
        const va = Number(a.factor[sortBy.field as keyof StockFactor] ?? 0);
        const vb = Number(b.factor[sortBy.field as keyof StockFactor] ?? 0);
        cmp = va - vb;
      }
      return sortBy.desc ? -cmp : cmp;
    });

    setResults(allResults);
    setIsScreening(false);
  }, [conditions, factorCache, sortBy]);

  const saveTemplate = useCallback(() => {
    if (!templateName.trim() || conditions.length === 0) return;
    const template: SavedTemplate = {
      id: `tpl_${Date.now()}`,
      name: templateName.trim(),
      conditions,
      createdAt: new Date().toISOString(),
    };
    const updated = [...templates, template];
    setTemplates(updated);
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated));
    setTemplateName('');
  }, [templateName, conditions, templates]);

  const loadTemplate = useCallback((template: SavedTemplate) => {
    setConditions(template.conditions.map((c, idx) => ({
      ...c,
      id: `loaded_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 8)}`,
    })));
    setShowTemplatePanel(false);
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated));
  }, [templates]);

  const clearAllConditions = useCallback(() => {
    setConditions([]);
  }, []);

  const handleSort = useCallback((field: string) => {
    setSortBy((prev) => {
      if (prev.field === field) {
        return { field, desc: !prev.desc };
      }
      return { field, desc: true };
    });
  }, []);

  const conditionsByCategory = useMemo(() => {
    return CONDITION_DEFS.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  const categoryStats = useMemo(() => {
    const stats: Record<ConditionCategory, number> = {
      technical: 0,
      fundamental: 0,
      price_volume: 0,
      capital: 0,
    };
    conditions.forEach((c) => {
      stats[c.category]++;
    });
    return stats;
  }, [conditions]);

  return (
    <div className="space-y-4">
      {/* Preset Strategies Bar */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-500" />
          <h3 className="text-white text-sm font-semibold">预设策略</h3>
          <span className="text-gray-500 text-xs">点击快速加载条件组合</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_STRATEGIES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="group flex items-center gap-2 px-3 py-2 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 hover:border-stock-secondary/50 rounded-lg transition-all"
            >
              <div className="text-left">
                <div className="text-white text-sm font-medium group-hover:text-stock-secondary transition-colors">
                  {preset.name}
                </div>
                <div className="text-gray-500 text-xs">{preset.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-stock-secondary transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Condition Builder + Actions */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel: Condition Categories */}
        <div className="col-span-3 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-3 border-b border-gray-800 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stock-secondary" />
            <h3 className="text-white text-sm font-semibold">条件分类</h3>
          </div>
          <div className="p-2">
            {CATEGORY_CONFIG.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              const count = categoryStats[cat.key];
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-all ${
                    isActive
                      ? `${cat.bgColor} border border-gray-700`
                      : 'hover:bg-gray-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {cat.label}
                    </span>
                  </div>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 bg-stock-secondary/20 text-stock-secondary text-xs rounded-full font-medium">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Condition list for active category */}
          <div className="border-t border-gray-800 p-2 max-h-[400px] overflow-y-auto">
            <div className="text-gray-500 text-xs px-2 py-1.5 uppercase tracking-wide">
              {CATEGORY_CONFIG.find((c) => c.key === activeCategory)?.label}条件
            </div>
            {conditionsByCategory.map((def) => (
              <button
                key={def.field}
                onClick={() => addCondition(def)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800/70 transition-colors group"
              >
                <div className="flex-1 text-left">
                  <div className="text-white text-sm group-hover:text-stock-secondary transition-colors">
                    {def.label}
                  </div>
                  {def.description && (
                    <div className="text-gray-500 text-xs">{def.description}</div>
                  )}
                </div>
                <Plus className="w-4 h-4 text-gray-600 group-hover:text-stock-secondary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel: Selected Conditions */}
        <div className="col-span-9 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stock-secondary" />
              <h3 className="text-white text-sm font-semibold">已选条件</h3>
              {conditions.length > 0 && (
                <span className="px-2 py-0.5 bg-stock-secondary/20 text-stock-secondary text-xs rounded-full font-medium">
                  {conditions.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {conditions.length > 0 && (
                <button
                  onClick={clearAllConditions}
                  className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-red-400 text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  清空
                </button>
              )}
              <button
                onClick={() => setShowTemplatePanel(!showTemplatePanel)}
                className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                模板
              </button>
              <button
                onClick={runScreening}
                disabled={isScreening || factorCache.size === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-stock-secondary text-white text-sm font-medium rounded-lg hover:bg-stock-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isScreening ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                开始选股
              </button>
            </div>
          </div>

          {/* Template Panel */}
          {showTemplatePanel && (
            <div className="p-3 border-b border-gray-800 bg-gray-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Save className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="输入模板名称..."
                  className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-stock-secondary"
                />
                <button
                  onClick={saveTemplate}
                  disabled={!templateName.trim() || conditions.length === 0}
                  className="px-3 py-1 bg-stock-secondary text-white text-xs rounded hover:bg-stock-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  保存当前
                </button>
              </div>
              {templates.length > 0 ? (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{tpl.name}</div>
                        <div className="text-gray-500 text-xs">
                          {tpl.conditions.length} 个条件 · {new Date(tpl.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => loadTemplate(tpl)}
                          className="px-2 py-1 text-stock-secondary text-xs hover:bg-stock-secondary/10 rounded transition-colors"
                        >
                          加载
                        </button>
                        <button
                          onClick={() => deleteTemplate(tpl.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs text-center py-2">暂无保存的模板</p>
              )}
            </div>
          )}

          {/* Selected Conditions List */}
          <div className="p-3 min-h-[200px]">
            {conditions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <SlidersHorizontal className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">从左侧添加筛选条件，或点击上方预设策略</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conditions.map((cond, idx) => {
                  const def = getConditionDef(cond.field);
                  const isBoolean = def?.type === 'boolean';
                  const catConfig = CATEGORY_CONFIG.find((c) => c.key === cond.category);
                  return (
                    <div
                      key={cond.id}
                      className="flex items-center gap-3 p-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-700 text-gray-400 text-xs rounded font-medium shrink-0">
                        {idx + 1}
                      </span>
                      <div className={`px-2 py-0.5 ${catConfig?.bgColor} ${catConfig?.color} text-xs rounded shrink-0`}>
                        {catConfig?.label}
                      </div>
                      <span className="text-white text-sm font-medium shrink-0 min-w-[80px]">
                        {cond.label}
                      </span>

                      {isBoolean ? (
                        <span className="text-green-400 text-xs px-2 py-1 bg-green-500/10 rounded">
                          满足条件
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            value={cond.operator}
                            onChange={(e) => updateCondition(cond.id, { operator: e.target.value as Operator })}
                            className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-stock-secondary"
                          >
                            <option value=">">大于</option>
                            <option value="<">小于</option>
                            <option value=">=">≥</option>
                            <option value="<=">≤</option>
                            <option value="between">区间</option>
                            <option value="equals">等于</option>
                          </select>
                          <input
                            type="number"
                            value={cond.value}
                            onChange={(e) => updateCondition(cond.id, { value: Number(e.target.value) })}
                            className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-stock-secondary"
                          />
                          {cond.operator === 'between' && (
                            <>
                              <span className="text-gray-500 text-xs">至</span>
                              <input
                                type="number"
                                value={cond.value2 ?? 0}
                                onChange={(e) => updateCondition(cond.id, { value2: Number(e.target.value) })}
                                className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-stock-secondary"
                              />
                            </>
                          )}
                          {def?.unit && (
                            <span className="text-gray-500 text-xs">{def.unit}</span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => removeCondition(cond.id)}
                        className="ml-auto p-1 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-stock-secondary" />
            <h3 className="text-white text-sm font-semibold">选股结果</h3>
            {hasScreened && (
              <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">
                共 {results.length} 只
              </span>
            )}
            {conditions.length > 0 && (
              <span className="text-gray-500 text-xs">
                (匹配全部 {conditions.length} 个条件)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(results)}
              disabled={results.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              导出CSV
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[520px]">
          {isScreening ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-stock-secondary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400 text-sm">正在筛选...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-800 border-b border-gray-700 text-gray-400">
                  <th className="text-left py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('code')}>
                    代码 / 名称
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                    现价
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('changePercent')}>
                    涨跌幅%
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('pe')}>
                    PE
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('pb')}>
                    PB
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('roe')}>
                    ROE%
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('turnoverRate')}>
                    换手率%
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('volumeRatio')}>
                    量比
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('amplitude')}>
                    振幅%
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('marketCap')}>
                    市值(亿)
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('volume')}>
                    成交额
                  </th>
                  <th className="text-right py-2 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('matchCount')}>
                    信号数
                  </th>
                  <th className="text-left py-2 px-3 font-medium whitespace-nowrap">
                    匹配详情
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const f = r.factor;
                  const isUp = f.changePercent >= 0;
                  return (
                    <tr
                      key={f.code}
                      className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{f.name}</span>
                          <span className="text-gray-500">{f.code}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right text-white whitespace-nowrap">{f.price.toFixed(2)}</td>
                      <td className={`py-2 px-3 text-right font-medium whitespace-nowrap ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {isUp ? '+' : ''}{f.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{f.pe.toFixed(1)}</td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{f.pb.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{f.roe.toFixed(1)}</td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{f.turnoverRate.toFixed(2)}</td>
                      <td className={`py-2 px-3 text-right whitespace-nowrap ${f.volumeRatio >= 1.5 ? 'text-yellow-400' : 'text-gray-300'}`}>
                        {f.volumeRatio.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{f.amplitude.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{f.marketCap.toFixed(0)}</td>
                      <td className="py-2 px-3 text-right text-gray-300 whitespace-nowrap">{formatAmount(f.amount)}</td>
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 bg-stock-secondary/20 text-stock-secondary text-xs rounded-full font-medium">
                          {r.matchCount}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-400 text-xs max-w-[280px] truncate" title={r.matchDetails.join('; ')}>
                        {r.matchDetails.join('; ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Filter className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">
                {hasScreened ? '没有匹配的股票，请调整筛选条件' : '添加条件后点击"开始选股"查看结果'}
              </p>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="p-2 border-t border-gray-800 bg-gray-800/30 flex items-center justify-between text-xs text-gray-500">
            <span>提示：点击表头可排序，数据基于模拟生成</span>
            <span>数据更新时间：{new Date().toLocaleString('zh-CN')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Screener;
