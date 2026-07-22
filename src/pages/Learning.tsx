import { useState } from 'react';
import { LearningHome } from '@/components/Learning/LearningHome';
import { LessonDetail } from '@/components/Learning/LessonDetail';
import { useLearningStore } from '@/stores/learningStore';

export function Learning() {
  const [view, setView] = useState<'home' | 'detail'>('home');
  const { currentDay, setCurrentDay } = useLearningStore();

  const handleSelectDay = (day: number) => {
    setCurrentDay(day);
    setView('detail');
  };

  const handleBack = () => {
    setView('home');
  };

  const handleDayChange = (day: number) => {
    setCurrentDay(day);
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px]">
      {view === 'home' ? (
        <LearningHome onSelectDay={handleSelectDay} />
      ) : (
        <LessonDetail
          day={currentDay}
          onBack={handleBack}
          onDayChange={handleDayChange}
        />
      )}
    </div>
  );
}
