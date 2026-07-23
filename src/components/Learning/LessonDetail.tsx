import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Circle, BookMarked, StickyNote, Trophy, RefreshCcw, FileText } from 'lucide-react';
import { getLessonByDay, getPhaseByDay, lessons } from '@/data/courseData';
import { useLearningStore } from '@/stores/learningStore';
import { QuizPanel } from './QuizPanel';

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

  const tabs = [
    { id: 'content' as const, label: '课件', icon: BookMarked },
    { id: 'notes' as const, label: '笔记', icon: StickyNote },
    { id: 'quiz' as const, label: '测验', icon: Trophy },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Compact Toolbar - single row */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-t-xl border border-gray-800 border-b-0">
        <button
          onClick={onBack}
          className="flex-shrink-0 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          title="返回课程列表"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
          style={{ background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)` }}
        >
          {day}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-white text-sm font-semibold truncate">{lesson.title}</h2>
          <p className="text-gray-500 text-xs truncate">第{phase.phase}阶段 · {phase.name} · 第{weekOfPhase(day)}周</p>
        </div>

        {/* Tab buttons */}
        <div className="flex-shrink-0 flex items-center gap-1 bg-gray-800/50 rounded-lg p-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={tab.label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => isCompleted ? markDayIncomplete(day) : markDayComplete(day)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium text-xs transition-all ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
          }`}
          title={isCompleted ? '已完成' : '标记完成'}
        >
          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isCompleted ? '已完成' : '完成'}</span>
        </button>

        <div className="flex-shrink-0 flex items-center gap-1">
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="上一天"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 px-1">{day}/270</span>
          <button
            onClick={goNext}
            disabled={!hasNext}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="下一天"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area - takes all remaining space */}
      <div className="flex-1 min-h-0 bg-white rounded-b-xl border border-gray-800 border-t-0 overflow-hidden">
        {activeTab === 'content' && (
          <div className="h-full relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="flex flex-col items-center text-gray-500">
                  <RefreshCcw className="w-8 h-8 animate-spin mb-3" />
                  <span className="text-sm">加载课件中...</span>
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
          <div className="h-full p-5 overflow-y-auto bg-gray-900">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold">学习笔记 - 第{day}天</h3>
                <span className="text-xs text-gray-500 ml-auto">自动保存</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder={`记录第${day}天的学习心得、重点知识、疑问点...\n\n提示：\n• 用自己的话总结知识点\n• 记录实战案例和感悟\n• 标记不懂的地方后续复习`}
                className="w-full h-[calc(100%-60px)] min-h-[300px] bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 font-mono text-sm leading-relaxed"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{note.length} 字</span>
                <span>笔记保存在本地浏览器</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <QuizPanel day={day} />
        )}
      </div>
    </div>
  );
}

function weekOfPhase(day: number): number {
  const lesson = lessons.find((l) => l.day === day);
  return lesson?.week || 1;
}
