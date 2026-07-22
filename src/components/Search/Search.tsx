import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { mockStockApi } from '@/api/stock';

interface SearchProps {
  onSelectStock: (code: string, name: string) => void;
}

export function StockSearch({ onSelectStock }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ code: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(async () => {
        const data = await mockStockApi.searchStock(query);
        setResults(data);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (code: string, name: string) => {
    onSelectStock(code, name);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors w-64"
        >
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">搜索股票...</span>
        </button>
      ) : (
        <div className="relative w-80">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
            <SearchIcon className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入股票代码或名称..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
              {results.map((stock, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(stock.code, stock.name)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800 last:border-b-0"
                >
                  <div>
                    <span className="text-white font-medium">{stock.name}</span>
                    <span className="text-gray-500 text-sm ml-2">{stock.code}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-500">
              未找到匹配的股票
            </div>
          )}
        </div>
      )}
    </div>
  );
}
