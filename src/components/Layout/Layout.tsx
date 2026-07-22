import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  title: string;
  subtitle?: string;
}

export function Layout({ children, currentPage, onPageChange, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <div className="ml-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
