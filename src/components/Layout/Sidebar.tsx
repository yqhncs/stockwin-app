import { LayoutDashboard, TrendingUp, Bot, BarChart3, Wallet, BookOpen, X, Star, Search } from 'lucide-react';
import { useState } from 'react';
import { mockStockApi } from '@/api/stock';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onPageChange, isOpen, onClose }: SidebarProps) {
  const [watchlist, setWatchlist] = useState<{ code: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ code: string; name: string }[]>([]);

  const menuItems = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard },
    { id: 'market', label: '行情', icon: TrendingUp },
    { id: 'ai-select', label: 'AI选股', icon: Bot },
    { id: 'strategy', label: '量化策略', icon: BarChart3 },
    { id: 'trading', label: '交易辅助', icon: Wallet },
    { id: 'learning', label: '学习训练', icon: BookOpen },
  ];

  const loadWatchlist = async () => {
    const data = await mockStockApi.getWatchlist();
    setWatchlist(data);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const data = await mockStockApi.searchStock(query);
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const handleStockClick = (code: string) => {
    onPageChange('market');
    onClose();
    localStorage.setItem('selectedStock', code);
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-stock-dark border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-stock-secondary" />
            股票辅助系统
          </h1>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索股票..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-stock-secondary"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 bg-gray-800 rounded-lg border border-gray-700 max-h-48 overflow-y-auto">
              {searchResults.map((stock, index) => (
                <div
                  key={index}
                  onClick={() => handleStockClick(stock.code)}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 cursor-pointer"
                >
                  <div>
                    <span className="text-white text-sm">{stock.name}</span>
                    <span className="text-gray-500 text-xs ml-2">{stock.code}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="p-4 border-b border-gray-800">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-stock-secondary text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm font-medium">自选股</span>
            <button onClick={loadWatchlist} className="ml-auto text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="space-y-1">
            {watchlist.length > 0 ? (
              watchlist.map((stock, index) => (
                <div
                  key={index}
                  onClick={() => handleStockClick(stock.code)}
                  className="flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-white text-sm">{stock.name}</span>
                    <span className="text-gray-500 text-xs ml-2">{stock.code}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm text-center py-4">
                暂无自选股
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="text-gray-500 text-sm">
            <p>版本: 1.0.0</p>
            <p className="mt-1">数据更新: 实时</p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose}></div>
      )}
    </>
  );
}
