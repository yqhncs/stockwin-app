import { LayoutDashboard, TrendingUp, Bot, BarChart3, Wallet, BookOpen } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard },
    { id: 'market', label: '行情', icon: TrendingUp },
    { id: 'ai-select', label: 'AI选股', icon: Bot },
    { id: 'strategy', label: '量化策略', icon: BarChart3 },
    { id: 'trading', label: '交易辅助', icon: Wallet },
    { id: 'learning', label: '学习训练', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-stock-dark border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-stock-secondary" />
          股票辅助系统
        </h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
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

      <div className="p-4 border-t border-gray-800">
        <div className="text-gray-500 text-sm">
          <p>版本: 1.0.0</p>
          <p className="mt-1">数据更新: 实时</p>
        </div>
      </div>
    </aside>
  );
}
