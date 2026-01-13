
import React from 'react';
import { Home, Utensils, Calendar, User, Info, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首頁' },
    { path: '/menu', icon: Utensils, label: '線上菜單' },
    { path: '/booking', icon: Calendar, label: '立即訂位' },
    { path: '/member', icon: User, label: '會員中心' },
    { path: '/info', icon: Info, label: '門市資訊' },
    { path: '/pos', icon: LayoutDashboard, label: 'POS管理' }
  ];

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto bg-white shadow-xl relative">
      <header className="bg-emerald-800 text-white p-4 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-center italic font-serif">Bella Vita</h1>
      </header>

      <main className="animate-fade-in">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-2 py-3 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === item.path ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
