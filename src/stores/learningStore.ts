import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lessons } from '@/data/courseData';

interface LearningState {
  completedDays: number[];
  currentDay: number;
  quizScores: Record<number, { score: number; total: number }>;
  studyNotes: Record<number, string>;
  lastStudyDate: string | null;
  streak: number;
  markDayComplete: (day: number) => void;
  markDayIncomplete: (day: number) => void;
  setCurrentDay: (day: number) => void;
  setQuizScore: (day: number, score: number, total: number) => void;
  setStudyNote: (day: number, note: string) => void;
  resetProgress: () => void;
  getProgressPercent: () => number;
  getPhaseProgress: (phaseNum: number) => number;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      completedDays: [],
      currentDay: 1,
      quizScores: {},
      studyNotes: {},
      lastStudyDate: null,
      streak: 0,

      markDayComplete: (day: number) => {
        const { completedDays, lastStudyDate, streak } = get();
        const today = new Date().toDateString();
        let newStreak = streak;
        if (lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastStudyDate === yesterday.toDateString()) {
            newStreak = streak + 1;
          } else {
            newStreak = 1;
          }
        }
        set({
          completedDays: [...new Set([...completedDays, day])].sort((a, b) => a - b),
          lastStudyDate: today,
          streak: newStreak,
        });
      },

      markDayIncomplete: (day: number) => {
        const { completedDays } = get();
        set({
          completedDays: completedDays.filter((d) => d !== day),
        });
      },

      setCurrentDay: (day: number) => {
        set({ currentDay: day });
      },

      setQuizScore: (day: number, score: number, total: number) => {
        const { quizScores } = get();
        set({
          quizScores: { ...quizScores, [day]: { score, total } },
        });
      },

      setStudyNote: (day: number, note: string) => {
        const { studyNotes } = get();
        set({
          studyNotes: { ...studyNotes, [day]: note },
        });
      },

      resetProgress: () => {
        set({
          completedDays: [],
          currentDay: 1,
          quizScores: {},
          studyNotes: {},
          lastStudyDate: null,
          streak: 0,
        });
      },

      getProgressPercent: () => {
        const { completedDays } = get();
        return Math.round((completedDays.length / lessons.length) * 100);
      },

      getPhaseProgress: (phaseNum: number) => {
        const { completedDays } = get();
        const phaseLessons = lessons.filter((l) => l.phase === phaseNum);
        const completed = phaseLessons.filter((l) => completedDays.includes(l.day)).length;
        return phaseLessons.length > 0 ? Math.round((completed / phaseLessons.length) * 100) : 0;
      },
    }),
    {
      name: 'stockwin-learning-storage',
    }
  )
);
