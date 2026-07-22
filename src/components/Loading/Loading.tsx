interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loading({ size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-6',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-stock-secondary border-t-transparent rounded-full animate-spin`}></div>
      {text && <span className="text-gray-400 text-sm">{text}</span>}
    </div>
  );
}

export function Skeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: '60%' }}></div>
            <div className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: '40%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-20 h-4 bg-gray-800 rounded"></div>
        <div className="w-8 h-8 bg-gray-800 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-20 bg-gray-800 rounded-lg"></div>
        <div className="h-4 bg-gray-800 rounded" style={{ width: '80%' }}></div>
        <div className="h-4 bg-gray-800 rounded" style={{ width: '60%' }}></div>
      </div>
    </div>
  );
}
