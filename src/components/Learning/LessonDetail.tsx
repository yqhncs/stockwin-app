import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Circle, BookMarked, FileText, StickyNote, Trophy, RefreshCcw, Share2 } from 'lucide-react';
import { getLessonByDay, getPhaseByDay, lessons } from '@/data/courseData';
import { useLearningStore } from '@/stores/learningStore';

interface LessonDetailProps {
  day: number;
  onBack: () => void;
  onDayChange: (day: number) => void;
}

export function LessonDetail({ day, onBack, onDayChange }: LessonDetailProps) {
  const lesson = getLessonByDay(day);
  const phase = getPhaseByDay(day);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'quiz'>('content');
  const [note, setNote] = useState('');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const {
    completedDays,
    markDayComplete,
    markDayIncomplete,
    setCurrentDay,
    studyNotes,
    setStudyNote,
    quizScores,
  } = useLearningStore();

  const isCompleted = completedDays.includes(day);
  const hasPrev = day > 1;
  const hasNext = day < 270;

  useEffect(() => {
    setCurrentDay(day);
    setNote(studyNotes[day] || '');
    setIframeLoaded(false);
    setActiveTab('content');
  }, [day]);

  useEffect(() => {
    if (studyNotes[day] !== undefined) {
      setNote(studyNotes[day]);
    }
  }, [studyNotes, day]);

  const handleNoteChange = (value: string) => {
    setNote(value);
    setStudyNote(day, value);
  };

  const goPrev = () => hasPrev && onDayChange(day - 1);
  const goNext = () => hasNext && onDayChange(day + 1);

  const fileName = `day${day.toString().padStart(3, '0')}.html`;
  const iframeSrc = `/learning/${fileName}`;

  if (!lesson || !phase) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p>课程不存在</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
          返回课程列表
        </button>
      </div>
    );
  }

  const quizScore = quizScores[day];

  const tabs = [
    { id: 'content', label: '课程内容', icon: BookMarked },
    { id: 'notes', label: '学习笔记', icon: StickyNote },
    { id: 'quiz', label: '课后测验', icon: Trophy },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 rounded-xl border border-gray-800 p-4 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br"
                style={{ background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)` }}
              >
                {day}
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-semibold truncate">{lesson.title}</h2>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">第{phase.phase}阶段 · {phase.name}</span>
                  <span className="text-xs" style={{ color: phase.color }}>第{weekOfPhase(day)}周</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => isCompleted ? markDayIncomplete(day) : markDayComplete(day)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isCompleted
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCompleted ? '已完成' : '标记完成'}</span>
          </button>

          <div className="flex-shrink-0 flex items-center gap-1">
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              disabled={!hasNext}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 p-1 bg-gray-800/50 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {activeTab === 'content' && (
          <div className="h-full relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="flex flex-col items-center text-gray-500">
                  <RefreshCcw className="w-8 h-8 animate-spin mb-3" />
                  <span className="text-sm">加载中...</span>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              className="w-full h-full bg-white"
              onLoad={() => setIframeLoaded(true)}
              title={`第${day}天 - ${lesson.title}`}
            />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <StickyNote className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold">学习笔记</h3>
                <span className="text-xs text-gray-500 ml-auto">自动保存</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="在这里记录你的学习心得、重点知识、疑问点...
&#10;&#10;提示：
• 用自己的话总结知识点
• 记录实战案例和感悟
• 标记不懂的地方后续复习"
                className="w-full h-[calc(100vh-400px)] min-h-[400px] bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 font-mono text-sm leading-relaxed"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{note.length} 字</span>
                <span>笔记保存在本地浏览器</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold">课后测验</h3>
              </div>

              {quizScore ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">测验完成！</h4>
                  <p className="text-3xl font-bold text-green-400 mb-4">
                    {quizScore.score} / {quizScore.total}
                  </p>
                  <p className="text-gray-400 text-sm">
                    正确率 {Math.round((quizScore.score / quizScore.total) * 100)}%
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-gray-600" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">测验功能开发中</h4>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    课后测验功能正在开发中。您可以在课程页面中找到每日的复习测试题，
                    完成后手动记录成绩。
                  </p>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="mt-6 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    返回课程内容
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 flex items-center justify-between mt-4">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <div className="text-left hidden sm:block">
            <div className="text-xs text-gray-500">上一天</div>
            <div className="text-sm font-medium truncate max-w-[200px]">
              {hasPrev ? getLessonByDay(day - 1)?.title : ''}
            </div>
          </div>
        </button>

        <div className="text-center text-gray-500 text-sm">
          第 <span className="text-white font-medium">{day}</span> / 270 天
        </div>

        <button
          onClick={goNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-500">下一天</div>
            <div className="text-sm font-medium truncate max-w-[200px]">
              {hasNext ? getLessonByDay(day + 1)?.title : ''}
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function weekOfPhase(day: number): number {
  const lesson = lessons.find((l) => l.day === day);
  return lesson?.week || 1;
}
