import { useState, useMemo } from 'react';
import { Trophy, CheckCircle2, XCircle, RotateCcw, ChevronRight, Award, Brain } from 'lucide-react';
import quizData from '@/data/quizData.json';
import { useLearningStore } from '@/stores/learningStore';

interface QuizQuestion {
  question: string;
  options: { label: string; text: string }[];
  answer: string;
  explain: string;
}

interface QuizPanelProps {
  day: number;
}

export function QuizPanel({ day }: QuizPanelProps) {
  const dayQuizzes = useMemo<QuizQuestion[]>(() => {
    return (quizData as Record<string, QuizQuestion[]>)[day.toString()] || [];
  }, [day]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { quizScores, setQuizScore } = useLearningStore();
  const existingScore = quizScores[day];

  // Reset when day changes
  useMemo(() => {
    setAnswers({});
    setSubmitted(false);
  }, [day]);

  if (dayQuizzes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <Brain className="w-10 h-10 text-gray-600" />
          </div>
          <h4 className="text-white font-semibold mb-2">本日无测验题目</h4>
          <p className="text-gray-500 text-sm">这一天没有测试题，可以直接学习课件内容。</p>
        </div>
      </div>
    );
  }

  const handleSelect = (qIndex: number, label: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: label }));
  };

  const handleSubmit = () => {
    const correct = dayQuizzes.reduce(
      (count, q, i) => (answers[i] === q.answer ? count + 1 : count),
      0
    );
    setQuizScore(day, correct, dayQuizzes.length);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const correctCount = dayQuizzes.reduce(
    (count, q, i) => (answers[i] === q.answer ? count + 1 : count),
    0
  );
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === dayQuizzes.length;
  const score = existingScore?.score ?? 0;
  const total = existingScore?.total ?? dayQuizzes.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-gray-900 overflow-hidden">
      {/* Header with stats */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-gray-800 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-white font-semibold text-sm">课后测验</span>
          <span className="text-gray-500 text-xs">第{day}天 · 共{dayQuizzes.length}题</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {submitted && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold ${
              percentage >= 80 ? 'bg-green-500/20 text-green-400' :
              percentage >= 60 ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              <Award className="w-4 h-4" />
              {correctCount}/{dayQuizzes.length} · {Math.round((correctCount/dayQuizzes.length)*100)}%
            </div>
          )}
          {!submitted && (
            <div className="text-xs text-gray-500">
              已答 {answeredCount}/{dayQuizzes.length}
            </div>
          )}
        </div>
      </div>

      {/* Questions - scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {dayQuizzes.map((q, qIndex) => {
            const userAnswer = answers[qIndex];
            const isCorrect = userAnswer === q.answer;
            const showResult = submitted;

            return (
              <div
                key={qIndex}
                className={`rounded-xl border p-4 transition-colors ${
                  showResult
                    ? isCorrect
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-red-500/30 bg-red-500/5'
                    : 'border-gray-800 bg-gray-800/30'
                }`}
              >
                {/* Question */}
                <div className="flex items-start gap-3 mb-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    showResult
                      ? isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {qIndex + 1}
                  </span>
                  <p className="text-white text-sm font-medium pt-0.5">{q.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-2 ml-9">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.label;
                    const isRightAnswer = q.answer === opt.label;

                    let optClass = 'border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600 hover:text-white';
                    if (showResult) {
                      if (isRightAnswer) {
                        optClass = 'border-green-500/40 bg-green-500/10 text-green-400';
                      } else if (isSelected && !isRightAnswer) {
                        optClass = 'border-red-500/40 bg-red-500/10 text-red-400';
                      } else {
                        optClass = 'border-gray-800 bg-gray-800/20 text-gray-500';
                      }
                    } else if (isSelected) {
                      optClass = 'border-blue-500/40 bg-blue-500/10 text-white';
                    }

                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelect(qIndex, opt.label)}
                        disabled={showResult}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm text-left transition-all ${optClass} ${
                          !showResult ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                          showResult && isRightAnswer ? 'border-green-500 bg-green-500/20' :
                          showResult && isSelected && !isRightAnswer ? 'border-red-500 bg-red-500/20' :
                          isSelected ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {showResult && isRightAnswer && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        {showResult && isSelected && !isRightAnswer && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResult && !isCorrect && q.explain && (
                  <div className="mt-3 ml-9 p-3 rounded-lg bg-gray-800/60 border border-gray-700/50">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-400 mb-1">解析</p>
                        <p className="text-xs text-gray-400 leading-relaxed">{q.explain}</p>
                        <p className="text-xs text-green-400 mt-1">正确答案：{q.answer}</p>
                      </div>
                    </div>
                  </div>
                )}
                {showResult && isCorrect && q.explain && (
                  <div className="mt-3 ml-9 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-400 leading-relaxed">{q.explain}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-gray-800 flex items-center justify-between">
        {!submitted ? (
          <>
            <div className="text-xs text-gray-500">
              {allAnswered ? '可以提交了！' : `还有 ${dayQuizzes.length - answeredCount} 题未作答`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                allAnswered
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              提交答卷
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="text-xs">
              <span className="text-gray-500">最终成绩：</span>
              <span className={`font-bold ml-1 ${
                percentage >= 80 ? 'text-green-400' :
                percentage >= 60 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {score}/{total} ({percentage}%)
              </span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重新答题
            </button>
          </>
        )}
      </div>
    </div>
  );
}
