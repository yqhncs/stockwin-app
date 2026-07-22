import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Market } from '@/pages/Market';
import { AISelect } from '@/pages/AISelect';
import { Strategy } from '@/pages/Strategy';
import { Trading } from '@/pages/Trading';
import { Learning } from '@/pages/Learning';

const pageConfig: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: '首页仪表盘', subtitle: '市场概览与投资报告' },
  market: { title: '行情分析', subtitle: 'K线图与技术指标' },
  'ai-select': { title: 'AI智能选股', subtitle: '自然语言选股与热点追踪' },
  strategy: { title: '量化策略', subtitle: '策略回测与信号分析' },
  trading: { title: '交易辅助', subtitle: '下单交易与仓位管理' },
  learning: { title: '学习训练', subtitle: '教程与知识体系' },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'market':
        return <Market />;
      case 'ai-select':
        return <AISelect />;
      case 'strategy':
        return <Strategy />;
      case 'trading':
        return <Trading />;
      case 'learning':
        return <Learning />;
      default:
        return <Dashboard />;
    }
  };

  const config = pageConfig[currentPage];

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      title={config.title}
      subtitle={config.subtitle}
    >
      {renderPage()}
    </Layout>
  );
}
