export interface DayLesson {
  day: number;
  title: string;
  week: number;
  phase: number;
  part: number;
  type: 'lesson' | 'review' | 'test' | 'project' | 'summary';
}

export interface PhaseInfo {
  phase: number;
  name: string;
  startDay: number;
  endDay: number;
  weeks: number;
  focus: string;
  color: string;
  gradient: string;
}

export interface PartInfo {
  part: number;
  name: string;
  description: string;
  dayRange: string;
  startDay: number;
  endDay: number;
  phases: number[];
}

export const parts: PartInfo[] = [
  {
    part: 1,
    name: '第一部分：传统技术分析',
    description: '阶段01-04 | 从K线基础到完整交易系统',
    dayRange: '第1-98天',
    startDay: 1,
    endDay: 98,
    phases: [1, 2, 3, 4],
  },
  {
    part: 2,
    name: '第二部分：AI与Python入门',
    description: '阶段05-07 | 传统分析毕业、AI辅助分析、Python与量化交易实战',
    dayRange: '第99-175天',
    startDay: 99,
    endDay: 175,
    phases: [5, 6, 7],
  },
  {
    part: 3,
    name: '第三部分：量化系统搭建',
    description: '阶段08-09 | 从零搭建完整量化系统，覆盖数据、指标、选股、策略、回测、风控',
    dayRange: '第176-235天',
    startDay: 176,
    endDay: 235,
    phases: [8, 9],
  },
  {
    part: 4,
    name: '第四部分：进阶策略',
    description: '阶段10-11 | 机器学习选股、组合优化、多市场策略、系统完善与部署',
    dayRange: '第236-260天',
    startDay: 236,
    endDay: 260,
    phases: [10, 11],
  },
  {
    part: 5,
    name: '第五部分：总复习与毕业',
    description: '阶段12-13 | 全面回顾、模拟大考、毕业项目、毕业典礼',
    dayRange: '第261-270天',
    startDay: 261,
    endDay: 270,
    phases: [12, 13],
  },
];

export const phases: PhaseInfo[] = [
  { phase: 1, name: '基础入门篇', startDay: 1, endDay: 28, weeks: 4, focus: 'K线、成交量、均线、趋势分析', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  { phase: 2, name: '技术指标篇', startDay: 29, endDay: 56, weeks: 4, focus: 'MACD、RSI、KDJ、布林带、K线形态', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
  { phase: 3, name: '进阶分析篇', startDay: 57, endDay: 84, weeks: 4, focus: '筹码分布、主力行为、选股方法、综合研判', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
  { phase: 4, name: '交易系统篇', startDay: 85, endDay: 98, weeks: 2, focus: '交易系统构建、买卖策略、仓位管理、实战演练', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },
  { phase: 5, name: 'AI炒股入门篇', startDay: 99, endDay: 120, weeks: 4, focus: '传统分析毕业、AI辅助分析、大模型选股、AI资讯解读', color: '#ef4444', gradient: 'from-red-500 to-red-600' },
  { phase: 6, name: '量化交易实战篇', startDay: 121, endDay: 150, weeks: 5, focus: 'Python基础、回测框架、策略开发、风控、AI量化综合', color: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
  { phase: 7, name: 'Python与金融数据篇', startDay: 151, endDay: 175, weeks: 4, focus: 'Pandas进阶、akshare数据获取、可视化、技术指标计算、数据存储', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  { phase: 8, name: '量化策略与系统搭建', startDay: 176, endDay: 200, weeks: 4, focus: '量化概论、Backtrader深入、从零搭建系统、策略优化、风控', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
  { phase: 9, name: '实战项目开发', startDay: 201, endDay: 235, weeks: 5, focus: '数据层/指标层/选股层/策略层/回测层/风控层/调度层/通知层', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
  { phase: 10, name: 'ML选股与组合优化', startDay: 236, endDay: 248, weeks: 2, focus: '机器学习选股、深度学习、NLP舆情、组合优化、动态调仓', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },
  { phase: 11, name: '多市场与系统完善', startDay: 249, endDay: 260, weeks: 2, focus: '可转债/ETF/港股通、测试部署、监控、实盘接口、职业发展', color: '#ef4444', gradient: 'from-red-500 to-red-600' },
  { phase: 12, name: '总复习', startDay: 261, endDay: 265, weeks: 1, focus: '分四段全面回顾 + 模拟大考', color: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
  { phase: 13, name: '毕业项目', startDay: 266, endDay: 270, weeks: 1, focus: '选题/编码/测试/答辩/毕业典礼', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
];

const rawLessons: { week: number; phase: number; part: number; days: { day: number; title: string; type?: DayLesson['type'] }[] }[] = [
  // Phase 1: 基础入门篇
  { week: 1, phase: 1, part: 1, days: [
    { day: 1, title: '股票到底是什么？——认识股票与股票市场' },
    { day: 2, title: '股票市场的基本结构——交易所、板块、指数' },
    { day: 3, title: '开户与交易规则——T+1、涨跌停、竞价机制' },
    { day: 4, title: '看懂K线图——蜡烛图的起源与构成' },
    { day: 5, title: 'K线组合形态入门——单根K线的十二种形态' },
    { day: 6, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 7, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 2, phase: 1, part: 1, days: [
    { day: 8, title: '成交量的基本概念——"市场温度计"' },
    { day: 9, title: '量价关系（上）——量增价涨、量缩价跌' },
    { day: 10, title: '量价关系（下）——量价背离与异常放量' },
    { day: 11, title: '换手率与量比——衡量活跃度的两个利器' },
    { day: 12, title: '成交量形态实战——放量突破与缩量洗盘' },
    { day: 13, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 14, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 3, phase: 1, part: 1, days: [
    { day: 15, title: '移动平均线基础——MA5/MA10/MA20/MA60/MA120/MA250' },
    { day: 16, title: '均线的多头排列与空头排列' },
    { day: 17, title: '均线金叉与死叉——趋势转折的信号' },
    { day: 18, title: '均线的支撑与压力作用' },
    { day: 19, title: '均线系统的实战组合应用' },
    { day: 20, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 21, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 4, phase: 1, part: 1, days: [
    { day: 22, title: '趋势的三种形态——上升、下降、横盘' },
    { day: 23, title: '趋势线与通道线的画法与应用' },
    { day: 24, title: '支撑位与阻力位——价格的"地板"与"天花板"' },
    { day: 25, title: '趋势的确认与反转信号' },
    { day: 26, title: '多时间框架分析——周线看方向、日线找买卖点' },
    { day: 27, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 28, title: '第一阶段综合测试（80道题）', type: 'test' },
  ]},
  // Phase 2: 技术指标篇
  { week: 5, phase: 2, part: 1, days: [
    { day: 29, title: 'MACD的原理与计算方法' },
    { day: 30, title: 'MACD金叉与死叉的识别与分类' },
    { day: 31, title: 'MACD顶背离与底背离' },
    { day: 32, title: 'MACD零轴的意义与水上水下操作' },
    { day: 33, title: 'MACD柱状图的缩放与实战' },
    { day: 34, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 35, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 6, phase: 2, part: 1, days: [
    { day: 36, title: 'RSI相对强弱指标——原理与计算' },
    { day: 37, title: 'RSI的超买超卖与背离信号' },
    { day: 38, title: 'KDJ随机指标——原理与参数设置' },
    { day: 39, title: 'KDJ金叉死叉与钝化现象' },
    { day: 40, title: 'RSI与KDJ的配合使用技巧' },
    { day: 41, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 42, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 7, phase: 2, part: 1, days: [
    { day: 43, title: '布林带BOLL原理与三轨含义' },
    { day: 44, title: '布林带开口、收口与走平' },
    { day: 45, title: 'OBV能量潮指标' },
    { day: 46, title: 'ATR真实波幅与动态止损' },
    { day: 47, title: 'MACD+RSI+BOLL多指标共振' },
    { day: 48, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 49, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 8, phase: 2, part: 1, days: [
    { day: 50, title: '反转形态——头肩顶与头肩底' },
    { day: 51, title: '反转形态——双顶(M头)与双底(W底)' },
    { day: 52, title: '反转形态——圆弧顶与圆弧底' },
    { day: 53, title: '持续形态——三角形、旗形、楔形' },
    { day: 54, title: '缺口理论——四种缺口类型与实战' },
    { day: 55, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 56, title: '第二阶段综合测试（80道题）', type: 'test' },
  ]},
  // Phase 3: 进阶分析篇
  { week: 9, phase: 3, part: 1, days: [
    { day: 57, title: '筹码分布原理——市场持仓成本模型' },
    { day: 58, title: '筹码的集中与分散' },
    { day: 59, title: '筹码转移与主力资金动向' },
    { day: 60, title: '筹码峰与价格支撑压力' },
    { day: 61, title: '筹码分布实战案例精讲' },
    { day: 62, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 63, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 10, phase: 3, part: 1, days: [
    { day: 64, title: '主力资金的特征与分类' },
    { day: 65, title: '主力建仓的信号与手法' },
    { day: 66, title: '主力洗盘的识别方法' },
    { day: 67, title: '主力拉升与出货的判断' },
    { day: 68, title: '龙虎榜数据的解读' },
    { day: 69, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 70, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 11, phase: 3, part: 1, days: [
    { day: 71, title: '基本面选股初识——PE/PB/ROE' },
    { day: 72, title: '技术面选股——形态选股法' },
    { day: 73, title: '资金面选股——北向资金与融资融券' },
    { day: 74, title: '板块轮动与热点追踪' },
    { day: 75, title: '龙头股的识别与跟踪' },
    { day: 76, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 77, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 12, phase: 3, part: 1, days: [
    { day: 78, title: '多维度分析方法——基本+技术+资金' },
    { day: 79, title: '量价形态综合研判案例' },
    { day: 80, title: '技术指标共振交易法' },
    { day: 81, title: '经典走势图谱精读（上）' },
    { day: 82, title: '经典走势图谱精读（下）' },
    { day: 83, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 84, title: '第三阶段综合测试（80道题）', type: 'test' },
  ]},
  // Phase 4: 交易系统篇
  { week: 13, phase: 4, part: 1, days: [
    { day: 85, title: '什么是交易系统——纪律与概率' },
    { day: 86, title: '买入策略体系——五种经典买入法' },
    { day: 87, title: '卖出策略体系——止盈止损方法论' },
    { day: 88, title: '仓位管理基础——等额与金字塔' },
    { day: 89, title: '仓位管理进阶——凯利公式与风险预算' },
    { day: 90, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 91, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 14, phase: 4, part: 1, days: [
    { day: 92, title: '完整交易案例分析（一）——趋势跟踪' },
    { day: 93, title: '完整交易案例分析（二）——底部反转' },
    { day: 94, title: '完整交易案例分析（三）——突破交易' },
    { day: 95, title: '模拟交易计划制定' },
    { day: 96, title: '交易日志与复盘方法论' },
    { day: 97, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 98, title: '第四阶段综合测试（80道题）', type: 'test' },
  ]},
  // Phase 5: AI炒股入门篇
  { week: 15, phase: 5, part: 2, days: [
    { day: 99, title: '270天知识体系总复习（传统篇）', type: 'review' },
    { day: 100, title: '第一阶段至第四阶段毕业大考（100道题）', type: 'test' },
    { day: 101, title: 'AI在股市中的应用概述' },
    { day: 102, title: '第五阶段总结与AI时代展望', type: 'summary' },
  ]},
  { week: 16, phase: 5, part: 2, days: [
    { day: 103, title: 'AI在投资领域的现状与前景' },
    { day: 104, title: '用大语言模型分析公司基本面' },
    { day: 105, title: 'AI辅助财报解读与财务分析' },
    { day: 106, title: 'AI辅助行业研究与竞争分析' },
    { day: 107, title: 'AI舆情分析——从新闻与社交媒体提取信号' },
    { day: 108, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 109, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 17, phase: 5, part: 2, days: [
    { day: 110, title: 'AI多因子选股模型入门' },
    { day: 111, title: '用AI生成技术分析报告' },
    { day: 112, title: 'AI智能预警系统搭建思路' },
    { day: 113, title: 'AI辅助止盈止损决策' },
    { day: 114, title: 'AI工具实操——ChatGPT/DeepSeek在投资中的应用' },
    { day: 115, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 116, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 18, phase: 5, part: 2, days: [
    { day: 117, title: 'AI识别K线形态与图表模式' },
    { day: 118, title: 'AI情绪指标与市场情绪分析' },
    { day: 119, title: 'AI炒股的局限性与风险' },
    { day: 120, title: '第五阶段综合测试（60道题）', type: 'test' },
  ]},
  // Phase 6: 量化交易实战篇
  { week: 19, phase: 6, part: 2, days: [
    { day: 121, title: '什么是量化交易——从直觉到数据' },
    { day: 122, title: 'Python入门（一）——环境搭建与基本语法' },
    { day: 123, title: 'Python入门（二）——Pandas数据处理' },
    { day: 124, title: '获取A股数据——tushare/akshare入门' },
    { day: 125, title: '用Python计算技术指标——TA-Lib' },
    { day: 126, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 127, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 20, phase: 6, part: 2, days: [
    { day: 128, title: '量化策略回测框架——backtrader入门' },
    { day: 129, title: '均线交叉策略的量化实现' },
    { day: 130, title: 'MACD背离策略的量化实现' },
    { day: 131, title: '多因子选股策略的量化实现' },
    { day: 132, title: '用AI模型增强量化策略——机器学习入门' },
    { day: 133, title: '周末复习与测试（50道题）', type: 'test' },
    { day: 134, title: '本周总结与答疑', type: 'summary' },
  ]},
  { week: 21, phase: 6, part: 2, days: [
    { day: 135, title: '量化风险控制——最大回撤与夏普比率' },
    { day: 136, title: '仓位管理的量化实现' },
    { day: 137, title: '策略过拟合的识别与防范' },
    { day: 138, title: '从回测到模拟盘——完整流程' },
    { day: 139, title: '用AI优化量化策略——参数调优' },
    { day: 140, title: '第六阶段综合测试（60道题）', type: 'test' },
  ]},
  { week: 22, phase: 6, part: 2, days: [
    { day: 141, title: '综合项目启动——设计AI增强量化选股系统', type: 'project' },
    { day: 142, title: '项目实战（一）——数据获取与预处理', type: 'project' },
    { day: 143, title: '项目实战（二）——技术指标计算与信号生成', type: 'project' },
    { day: 144, title: '项目实战（三）——AI模型训练与预测', type: 'project' },
    { day: 145, title: '项目实战（四）——回测与绩效分析', type: 'project' },
    { day: 146, title: '项目实战（五）——风控模块与仓位管理', type: 'project' },
    { day: 147, title: '项目实战（六）——系统优化与报告撰写', type: 'project' },
    { day: 148, title: '项目答辩与互评', type: 'project' },
  ]},
  { week: 23, phase: 6, part: 2, days: [
    { day: 149, title: '270天知识体系总复习', type: 'review' },
    { day: 150, title: '第六阶段综合测试（120道题）+ 学习路线图与进阶方向', type: 'test' },
  ]},
  // Phase 7: Python与金融数据篇
  { week: 24, phase: 7, part: 2, days: [
    { day: 151, title: 'Pandas进阶一：数据清洗' },
    { day: 152, title: 'Pandas进阶二：数据分组与聚合' },
    { day: 153, title: 'Pandas进阶三：时间序列' },
    { day: 154, title: 'Pandas进阶四：数据合并' },
    { day: 155, title: '金融数据概述' },
    { day: 156, title: 'akshare安装与入门' },
    { day: 157, title: 'A股实时行情数据获取' },
  ]},
  { week: 25, phase: 7, part: 2, days: [
    { day: 158, title: 'A股历史K线数据' },
    { day: 159, title: 'A股财务数据获取' },
    { day: 160, title: 'A股指数数据' },
    { day: 161, title: 'A股资金流向数据' },
    { day: 162, title: '周末复习：金融数据获取', type: 'review' },
    { day: 163, title: 'Matplotlib可视化基础' },
    { day: 164, title: 'Matplotlib金融图表' },
  ]},
  { week: 26, phase: 7, part: 2, days: [
    { day: 165, title: '技术指标计算一' },
    { day: 166, title: '技术指标计算二' },
    { day: 167, title: '数据存储方案一：CSV与Excel' },
    { day: 168, title: '数据存储方案二：SQLite数据库' },
    { day: 169, title: '数据存储方案三：MySQL入门' },
    { day: 170, title: '数据清洗实战一：缺失值与异常值' },
  ]},
  { week: 27, phase: 7, part: 2, days: [
    { day: 171, title: '数据清洗实战二：复权与对齐' },
    { day: 172, title: '数据管道搭建' },
    { day: 173, title: 'A股交易日历与时间处理' },
    { day: 174, title: '阶段测验', type: 'test' },
    { day: 175, title: '量化投资概论' },
  ]},
  // Phase 8: 量化策略与系统搭建
  { week: 28, phase: 8, part: 3, days: [
    { day: 176, title: '量化策略分类' },
    { day: 177, title: '回测框架概述' },
    { day: 178, title: 'Backtrader入门一：安装与核心概念' },
    { day: 179, title: 'Backtrader入门二：策略类编写' },
    { day: 180, title: 'Backtrader进阶一：指标集成与止损止盈' },
    { day: 181, title: 'Backtrader进阶二：多股回测与分析器' },
    { day: 182, title: '回测绩效评估' },
  ]},
  { week: 29, phase: 8, part: 3, days: [
    { day: 183, title: '周末复习：量化策略与回测', type: 'review' },
    { day: 184, title: '从零搭建量化系统一：项目规划' },
    { day: 185, title: '从零搭建量化系统二：数据模块' },
    { day: 186, title: '从零搭建量化系统三：指标模块' },
    { day: 187, title: '从零搭建量化系统四：选股模块' },
    { day: 188, title: '从零搭建量化系统五：策略模块' },
    { day: 189, title: '从零搭建量化系统六：回测模块' },
  ]},
  { week: 30, phase: 8, part: 3, days: [
    { day: 190, title: '从零搭建量化系统七：风控模块' },
    { day: 191, title: '从零搭建量化系统八：通知模块' },
    { day: 192, title: '周末复习：量化系统搭建', type: 'review' },
    { day: 193, title: '从零搭建量化系统九：整合联调' },
    { day: 194, title: '从零搭建量化系统十：实盘模拟' },
    { day: 195, title: '量化策略优化' },
    { day: 196, title: '量化风险控制进阶' },
  ]},
  { week: 31, phase: 8, part: 3, days: [
    { day: 197, title: '量化交易心理学' },
    { day: 198, title: '阶段大测验：量化策略与系统搭建', type: 'test' },
    { day: 199, title: '200天里程碑：量化投资完整知识体系回顾', type: 'review' },
    { day: 200, title: '第八阶段综合测试（80道题）', type: 'test' },
  ]},
  // Phase 9: 实战项目开发
  { week: 32, phase: 9, part: 3, days: [
    { day: 201, title: '实战项目启动：系统架构设计' },
    { day: 202, title: '历史数据管理器' },
    { day: 203, title: '财务数据采集器' },
    { day: 204, title: 'finance_data_fetcher.py实现' },
    { day: 205, title: 'data_validator.py' },
    { day: 206, title: '周末复习：数据层全貌', type: 'review' },
  ]},
  { week: 33, phase: 9, part: 3, days: [
    { day: 207, title: '指标层设计哲学与8大技术指标' },
    { day: 208, title: '选股引擎框架' },
    { day: 209, title: '多因子评分系统一' },
    { day: 210, title: '多因子评分系统二' },
    { day: 211, title: '选股策略实战' },
    { day: 212, title: '技术面选股策略' },
    { day: 213, title: '基本面选股策略' },
    { day: 214, title: '资金面选股策略' },
    { day: 215, title: '多因子评分器' },
    { day: 216, title: '周末复习day207-215', type: 'review' },
  ]},
  { week: 34, phase: 9, part: 3, days: [
    { day: 217, title: '策略基类设计' },
    { day: 218, title: '均线交叉策略（MA_CrossStrategy）' },
    { day: 219, title: '多因子选股策略（MultiFactorStrategy）' },
    { day: 220, title: '突破与均值回归策略' },
    { day: 221, title: '回测引擎开发' },
    { day: 222, title: '交易成本模拟' },
    { day: 223, title: '绩效分析器' },
    { day: 224, title: '基准对比与归因分析' },
    { day: 225, title: '周末实战复习（Day201-224）', type: 'review' },
  ]},
  { week: 35, phase: 9, part: 3, days: [
    { day: 226, title: '仓位管理器' },
    { day: 227, title: '止损止盈系统' },
    { day: 228, title: '组合风险监控' },
    { day: 229, title: '报告生成器' },
    { day: 230, title: '交易信号推送' },
    { day: 231, title: '定时任务系统' },
    { day: 232, title: '配置管理完整config体系' },
    { day: 233, title: '日志系统' },
    { day: 234, title: '系统整合main.py' },
    { day: 235, title: '阶段测验（Day201-234）', type: 'test' },
  ]},
  // Phase 10: ML选股与组合优化
  { week: 36, phase: 10, part: 4, days: [
    { day: 236, title: '机器学习选股一：scikit-learn分类选股' },
    { day: 237, title: '机器学习选股二：随机森林与XGBoost' },
    { day: 238, title: '机器学习选股三：ml_stock_picker.py完整实现' },
    { day: 239, title: '深度学习选股：LSTM股价预测' },
    { day: 240, title: 'NLP舆情选股：财经新闻情感分析' },
    { day: 241, title: '周末复习：ML选股全部内容回顾', type: 'review' },
  ]},
  { week: 37, phase: 10, part: 4, days: [
    { day: 242, title: '组合优化理论：马科维茨均值方差模型' },
    { day: 243, title: '组合优化实现：portfolio_optimizer.py' },
    { day: 244, title: '动态调仓系统' },
    { day: 245, title: '多策略组合' },
    { day: 246, title: '市场状态识别' },
    { day: 247, title: '事件驱动策略' },
    { day: 248, title: '周末复习', type: 'review' },
  ]},
  // Phase 11: 多市场与系统完善
  { week: 38, phase: 11, part: 4, days: [
    { day: 249, title: '可转债量化' },
    { day: 250, title: 'ETF量化策略' },
    { day: 251, title: '港股通量化' },
    { day: 252, title: '系统测试' },
    { day: 253, title: '系统部署' },
    { day: 254, title: '系统监控维护' },
    { day: 255, title: '实盘交易接口' },
  ]},
  { week: 39, phase: 11, part: 4, days: [
    { day: 256, title: '周末复习：day249-255', type: 'review' },
    { day: 257, title: '量化投资进阶书单与资源' },
    { day: 258, title: '量化投资职业发展' },
    { day: 259, title: '量化交易法律法规' },
    { day: 260, title: '量化投资哲学' },
  ]},
  // Phase 12: 总复习
  { week: 40, phase: 12, part: 5, days: [
    { day: 261, title: '总复习一：Day001-090基础知识回顾', type: 'review' },
    { day: 262, title: '总复习二：Day091-155 AI与Python回顾', type: 'review' },
    { day: 263, title: '总复习三：Day156-235量化系统回顾', type: 'review' },
    { day: 264, title: '总复习四：Day236-260进阶策略回顾', type: 'review' },
    { day: 265, title: '综合模拟大考：50道全覆盖选择题', type: 'test' },
  ]},
  // Phase 13: 毕业项目
  { week: 41, phase: 13, part: 5, days: [
    { day: 266, title: '毕业项目一：选题与方案设计', type: 'project' },
    { day: 267, title: '毕业项目二：编码实现', type: 'project' },
    { day: 268, title: '毕业项目三：测试与优化', type: 'project' },
    { day: 269, title: '毕业项目四：报告撰写与答辩准备', type: 'project' },
    { day: 270, title: '毕业典礼：量化投资全科结业', type: 'project' },
  ]},
];

export const lessons: DayLesson[] = rawLessons.flatMap((w) =>
  w.days.map((d) => ({
    day: d.day,
    title: d.title,
    week: w.week,
    phase: w.phase,
    part: w.part,
    type: d.type || 'lesson',
  }))
);

export function getLessonByDay(day: number): DayLesson | undefined {
  return lessons.find((l) => l.day === day);
}

export function getPhaseByDay(day: number): PhaseInfo | undefined {
  return phases.find((p) => day >= p.startDay && day <= p.endDay);
}

export function getPartByDay(day: number): PartInfo | undefined {
  return parts.find((p) => day >= p.startDay && day <= p.endDay);
}

export function getLessonsByPhase(phase: number): DayLesson[] {
  return lessons.filter((l) => l.phase === phase);
}

export function getWeeksByPhase(phase: number): { week: number; days: DayLesson[] }[] {
  const phaseLessons = getLessonsByPhase(phase);
  const weekMap = new Map<number, DayLesson[]>();
  phaseLessons.forEach((l) => {
    if (!weekMap.has(l.week)) weekMap.set(l.week, []);
    weekMap.get(l.week)!.push(l);
  });
  return Array.from(weekMap.entries()).map(([week, days]) => ({ week, days }));
}
