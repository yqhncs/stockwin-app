import { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Target, Flame, ChevronRight, Play, Award, TrendingUp, Zap } from 'lucide-react';
import { parts, phases, lessons, getWeeksByPhase, getPhaseByDay } from '@/data/courseData';
import { useLearningStore } from '@/stores/learningStore';

interface LearningHomeProps {
  onSelectDay: (day: number) => void;
}

export function LearningHome({ onSelectDay }: LearningHomeProps) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [activePart, setActivePart] = useState<number>(1);
  const { completedDays, currentDay, streak, getProgressPercent, getPhaseProgress } = useLearningStore();

  const progress = getProgressPercent();
  const currentLesson = lessons.find((l) => l.day === currentDay) || lessons[0];
  const currentPhase = getPhaseByDay(currentDay);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'test': return <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">测验</span>;
      case 'review': return <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">复习</span>;
      case 'summary': return <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">总结</span>;
      case 'project': return <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full">项目</span>;
      default: return null;
    }
  };

  const stats = [
    { label: '总体进度', value: `${progress}%`, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: '已完成天数', value: `${completedDays.length}/270`, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: '连续学习', value: `${streak}天`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { label: '当前阶段', value: currentPhase ? `第${currentPhase.phase}阶段` : '未开始', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-amber-500/20 rounded-2xl border border-gray-800 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">270天量化投资全栈训练营</h1>
              <p className="text-gray-400 mt-1">从K线小白到量化高手，13个阶段系统进阶</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-gray-900/60 backdrop-blur rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                  </div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">学习进度</span>
              <span className="text-sm text-blue-400 font-medium">{progress}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Continue Learning */}
          {currentLesson && (
            <button
              onClick={() => onSelectDay(currentDay)}
              className="mt-6 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              <Play className="w-5 h-5" />
              <span>继续学习：第{currentLesson.day}天 - {currentLesson.title}</span>
              <ChevronRight className="w-5 h-5 ml-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Part Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {parts.map((part) => (
          <button
            key={part.part}
            onClick={() => {
              setActivePart(part.part);
              const firstPhase = part.phases[0];
              setExpandedPhase(firstPhase);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePart === part.part
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
            }`}
          >
            第{part.part}部分
          </button>
        ))}
      </div>

      {/* Part Description */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
        <h3 className="text-white font-semibold">{parts[activePart - 1]?.name}</h3>
        <p className="text-gray-400 text-sm mt-1">{parts[activePart - 1]?.description}</p>
        <p className="text-blue-400 text-sm mt-2">{parts[activePart - 1]?.dayRange}</p>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases
          .filter((p) => parts[activePart - 1]?.phases.includes(p.phase))
          .map((phase) => {
            const phaseProgress = getPhaseProgress(phase.phase);
            const weeks = getWeeksByPhase(phase.phase);
            const isExpanded = expandedPhase === phase.phase;

            return (
              <div
                key={phase.phase}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                  className="w-full p-5 flex items-start gap-4 hover:bg-gray-800/30 transition-colors text-left"
                >
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br"
                    style={{ background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)` }}
                  >
                    {phase.phase.toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-white font-semibold">{phase.name}</h3>
                      <span className="text-sm text-gray-500 flex-shrink-0">第{phase.startDay}-{phase.endDay}天</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">学习重点：{phase.focus}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${phaseProgress}%`, backgroundColor: phase.color }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 flex-shrink-0">{phaseProgress}%</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-800 p-5 space-y-5">
                    {weeks.map((weekData) => (
                      <div key={weekData.week}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: phase.color }} />
                          <span className="text-sm font-medium text-white">第{weekData.week}周</span>
                          <span className="text-sm text-gray-500">（共{weekData.days.length}天）</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-3.5">
                          {weekData.days.map((lesson) => {
                            const isCompleted = completedDays.includes(lesson.day);
                            const isCurrent = lesson.day === currentDay;
                            return (
                              <button
                                key={lesson.day}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectDay(lesson.day);
                                }}
                                className={`group flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                  isCurrent
                                    ? 'bg-blue-500/20 border border-blue-500/30'
                                    : isCompleted
                                    ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20'
                                    : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                                }`}
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  isCompleted
                                    ? 'bg-green-500/30 text-green-400'
                                    : isCurrent
                                    ? 'bg-blue-500/30 text-blue-400'
                                    : 'bg-gray-700 text-gray-400'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    lesson.day
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm truncate ${
                                    isCompleted ? 'text-green-300' : isCurrent ? 'text-blue-300' : 'text-gray-300'
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {getTypeIcon(lesson.type)}
                                  </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  isCurrent ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                                }`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Learning Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold">学习建议</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: '坚持每日学习', desc: '每天1-2小时集中学习，周末复习测试' },
              { title: '理论结合实战', desc: '学完后立即在行情软件中验证案例' },
              { title: '重视复习测试', desc: '周测和阶段测试是巩固记忆的关键' },
              { title: '做好学习笔记', desc: '用自己的语言总结，建立个人知识库' },
            ].map((tip, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{tip.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-violet-400" />
            <h3 className="text-white font-semibold">五大部分总览</h3>
          </div>
          <div className="space-y-2">
            {parts.map((part) => {
              const partProgress = Math.round(
                (completedDays.filter((d) => d >= part.startDay && d <= part.endDay).length /
                  (part.endDay - part.startDay + 1)) * 100
              );
              return (
                <div key={part.part} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-sm font-medium">{part.name}</span>
                    <span className="text-gray-400 text-xs">{partProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${partProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
        <h3 className="text-amber-400 font-semibold mb-2">⚠️ 风险提示</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          股市有风险，投资需谨慎。本训练营旨在帮助您建立系统的量化投资知识框架，但不构成任何投资建议。所学知识不能保证交易盈利，实际交易中请结合自身风险承受能力，理性决策。过往走势不代表未来表现。
        </p>
      </div>
    </div>
  );
}
