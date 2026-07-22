import { useState } from 'react';
import { BookOpen, Video, FileText, CheckCircle, Clock, Award, ChevronRight, Play } from 'lucide-react';

export function Learning() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const courses = [
    {
      id: 'kline',
      title: 'K线基础教程',
      description: '从零开始学习K线理论，掌握K线形态分析方法',
      icon: FileText,
      color: 'bg-blue-500',
      modules: [
        { id: 'kline-1', title: 'K线基本概念', duration: '20分钟', completed: true },
        { id: 'kline-2', title: '单根K线形态解读', duration: '30分钟', completed: true },
        { id: 'kline-3', title: 'K线组合形态分析', duration: '40分钟', completed: false },
        { id: 'kline-4', title: 'K线实战应用', duration: '35分钟', completed: false },
      ],
    },
    {
      id: 'indicator',
      title: '技术指标详解',
      description: '深入学习常用技术指标的原理和应用',
      icon: Video,
      color: 'bg-green-500',
      modules: [
        { id: 'indicator-1', title: '移动平均线(MA)', duration: '25分钟', completed: true },
        { id: 'indicator-2', title: 'MACD指标详解', duration: '35分钟', completed: false },
        { id: 'indicator-3', title: 'RSI相对强弱指数', duration: '30分钟', completed: false },
        { id: 'indicator-4', title: '布林带(BOLL)', duration: '25分钟', completed: false },
        { id: 'indicator-5', title: 'KDJ随机指标', duration: '25分钟', completed: false },
      ],
    },
    {
      id: 'strategy',
      title: '交易策略入门',
      description: '学习常见交易策略，建立自己的交易体系',
      icon: BookOpen,
      color: 'bg-yellow-500',
      modules: [
        { id: 'strategy-1', title: '趋势跟踪策略', duration: '40分钟', completed: false },
        { id: 'strategy-2', title: '震荡行情策略', duration: '35分钟', completed: false },
        { id: 'strategy-3', title: '波段操作策略', duration: '45分钟', completed: false },
        { id: 'strategy-4', title: '风险管理策略', duration: '30分钟', completed: false },
      ],
    },
  ];

  const knowledgePoints = [
    { title: '支撑位与压力位', desc: '学会识别关键价格水平', icon: '📊' },
    { title: '成交量分析', desc: '量价关系解读技巧', icon: '📈' },
    { title: '趋势线画法', desc: '正确绘制趋势线的方法', icon: '📉' },
    { title: '背离形态', desc: 'MACD/RSI背离识别', icon: '🔄' },
  ];

  const stats = {
    totalHours: 12.5,
    completedModules: 4,
    totalModules: 13,
    accuracy: 85,
  };

  const toggleModule = (moduleId: string) => {
    if (completedModules.includes(moduleId)) {
      setCompletedModules(completedModules.filter(id => id !== moduleId));
    } else {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">学习时长</span>
            <Clock className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{stats.totalHours}</span>
            <span className="text-gray-400 text-sm ml-1">小时</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">已完成模块</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-green-500">{stats.completedModules}</span>
            <span className="text-gray-400 text-sm ml-1">/{stats.totalModules}</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">测验正确率</span>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-yellow-500">{stats.accuracy}</span>
            <span className="text-gray-400 text-sm ml-1">%</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">当前等级</span>
            <BookOpen className="w-5 h-5 text-stock-secondary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">初级分析师</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">学习课程</h3>
        </div>
        <div className="p-4 space-y-4">
          {courses.map((course) => {
            const Icon = course.icon;
            const completedCount = course.modules.filter(m => completedModules.includes(m.id)).length;
            const progress = (completedCount / course.modules.length) * 100;

            return (
              <div key={course.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => setActiveCourse(activeCourse === course.id ? null : course.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${course.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{course.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">{course.description}</p>
                      <div className="mt-2">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-stock-secondary" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{completedCount}/{course.modules.length} 模块已完成</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${activeCourse === course.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {activeCourse === course.id && (
                  <div className="px-4 pb-4 border-t border-gray-700">
                    <div className="mt-4 space-y-2">
                      {course.modules.map((module) => (
                        <div 
                          key={module.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            completedModules.includes(module.id) 
                              ? 'bg-green-500/10 border border-green-500/30' 
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                          onClick={() => toggleModule(module.id)}
                        >
                          <div className="flex items-center gap-3">
                            {completedModules.includes(module.id) ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                            )}
                            <span className="text-white">{module.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {module.duration}
                            </span>
                            <Play className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">知识点速查</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {knowledgePoints.map((point, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">{point.icon}</div>
                  <h4 className="text-white font-medium">{point.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">学习建议</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">今日推荐</h4>
              <p className="text-gray-300 text-sm">建议学习「K线组合形态分析」模块，这是技术分析的基础技能。</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">学习提示</h4>
              <p className="text-gray-300 text-sm">理论学习后，建议使用模拟交易功能进行实践，加深理解。</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-2">进阶目标</h4>
              <p className="text-gray-300 text-sm">完成所有课程后，尝试构建自己的量化交易策略并进行回测验证。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
